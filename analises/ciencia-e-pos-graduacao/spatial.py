"""Rebuild spatial rates offline; extract only from the checksum-pinned publication."""
import argparse
import base64
import csv
import gzip
import hashlib
import io
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'laboratorio/ciencia-e-pos-graduacao/data'


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()


def extract(path, meta):
    html = path.read_bytes()
    assert hashlib.sha256(html).hexdigest() == meta['upstream_html_sha256'], 'Wrong upstream revision'
    payload = re.search(rb'<script id="plano"[^>]*>(.*?)</script>', html, re.S).group(1)
    source = json.loads(gzip.decompress(base64.b64decode(payload)))['base']['textos']
    result = {}
    for measure, years in source['c4_2']['v'].items():
        result[measure] = {}
        for year, entry in years.items():
            if not entry['dados']['niveis']:
                continue  # Unavailable years are absent, never zero-filled.
            levels = {}
            for level in entry['dados']['niveis']:
                units = {}
                for key, u in level['unidades'].items():
                    count = re.match(r'^([\d.]+) ', u['linhas'][1])
                    assert count, (measure, year, key)
                    units[key] = dict(name=u['nome'], region=u.get('pai'),
                        population=int(u['tamanho']), count=int(count[1].replace('.', '')),
                        published_rate=float(u['linhas'][0].split(' ')[0].replace('.', '').replace(',', '.')))
                levels[level['id']] = units
            result[measure][year] = levels
    features = []
    for level, collection in source['malhas'].items():
        for feature in collection['features']:
            feature['properties']['level'] = level
            features.append(feature)
    return {'source-spatial.json': encoded(result), 'brazil.geojson': (json.dumps(dict(type='FeatureCollection', features=features), ensure_ascii=False, separators=(',', ':')) + '\n').encode()}


def build(upstream=None, check=False):
    meta = json.loads((DATA / 'provenance.json').read_text())
    if upstream:
        for name, raw in extract(upstream, meta).items():
            if check:
                assert raw == (DATA / name).read_bytes(), name
            else:
                (DATA / name).write_bytes(raw)
                meta.setdefault('spatial_checksums', {})[name] = hashlib.sha256(raw).hexdigest()
        if not check:
            (DATA / 'provenance.json').write_bytes(encoded(meta))
    for name, digest in meta['spatial_checksums'].items():
        assert hashlib.sha256((DATA / name).read_bytes()).hexdigest() == digest, name
    source = json.loads((DATA / 'source-spatial.json').read_text())
    geometry = json.loads((DATA / 'brazil.geojson').read_text())
    output = {'population_year': 2022, 'snapshot_date': meta['snapshot_date'], 'measures': {}}
    stream = io.StringIO(newline='')
    writer = csv.writer(stream, lineterminator='\n')
    writer.writerow(['measure', 'year', 'level', 'id', 'name', 'count', 'population_2022', 'rate', 'per_inhabitants'])
    for measure, years in source.items():
        per = 1000000 if measure == 'programas' else 100000
        output['measures'][measure] = {'per': per, 'years': {}}
        for year, levels in years.items():
            assert len(levels['uf']) == 27 and len(levels['regiao']) == 5
            for level, units in levels.items():
                assert set(units) == {f['properties']['id'] for f in geometry['features'] if f['properties']['level'] == level}
                for key, u in units.items():
                    assert isinstance(u['count'], int) and u['count'] >= 0 and u['population'] > 0
                    rate = u['count'] / u['population'] * per
                    assert abs(rate - u['published_rate']) < .051, (measure, year, key, rate)
                    u['rate'] = rate
                    writer.writerow([measure, year, level, key, u['name'], u['count'], u['population'], rate, per])
            for region, u in levels['regiao'].items():
                members = [s for s in levels['uf'].values() if s['region'] == region]
                assert sum(s['count'] for s in members) == u['count'], (measure, year, region)
                assert sum(s['population'] for s in members) == u['population']
            count = sum(u['count'] for u in levels['uf'].values())
            pop = sum(u['population'] for u in levels['uf'].values())
            levels['brasil'] = dict(count=count, population=pop, rate=count / pop * per)
            output['measures'][measure]['years'][year] = levels
    for name, raw in {'spatial.json': encoded(output), 'spatial.csv': stream.getvalue().encode()}.items():
        if check:
            assert (DATA / name).read_bytes() == raw, 'Rebuild required: ' + name
        else:
            (DATA / name).write_bytes(raw)
    print('Verified spatial checksums, 27 UFs, five region sums, rounded source rates and CSV/JSON parity.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--upstream-html', type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    build(args.upstream_html, args.check)
