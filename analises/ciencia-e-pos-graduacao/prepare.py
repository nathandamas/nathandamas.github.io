"""Rebuild the web dataset offline; optionally verify against pinned upstream HTML."""
import argparse
import base64
import csv
import gzip
import hashlib
import io
import json
import math
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'laboratorio/ciencia-e-pos-graduacao/data'


def build(upstream_html=None, check=False):
    raw = (DATA / 'source-series.json').read_bytes()
    provenance = json.loads((DATA / 'provenance.json').read_text())
    if hashlib.sha256(raw).hexdigest() != provenance['source_series_sha256']:
        raise ValueError('The frozen source dataset has changed')
    source = json.loads(raw)
    if upstream_html:
        html = Path(upstream_html).read_bytes()
        if hashlib.sha256(html).hexdigest() != provenance['upstream_html_sha256']:
            raise ValueError('Upstream HTML does not match the pinned revision')
        encoded = re.search(rb'<script id="plano"[^>]*>(.*?)</script>', html, re.S).group(1)
        upstream = json.loads(gzip.decompress(base64.b64decode(encoded)))['base']['textos']
        for dataset in source.values():
            original = upstream[dataset['upstream_card']]['dados']
            assert dataset['years'] == [int(y) for y in original['tempo']]
            assert dataset['series'] == [dict(id=s['id'], values=s['valores']) for s in original['series']]
            if 'total' in dataset:
                assert dataset['total'] == original['totais']
    csv_file = io.StringIO(newline='')
    writer = csv.writer(csv_file, lineterminator='\n')
    writer.writerow(['dataset', 'series', 'year', 'value', 'unit', 'snapshot_date'])
    result = {'snapshot_date': provenance['snapshot_date'], 'datasets': {}}
    for key, dataset in source.items():
        years = dataset['years']
        assert years == list(range(2000, (2023 if key in ('investment', 'share') else 2024) + 1))
        series = dataset['series'].copy()
        if key == 'investment':
            totals = [sum(s['values'][i] for s in series) for i in range(len(years))]
            assert all(math.isclose(a, b, rel_tol=1e-12, abs_tol=.01) for a, b in zip(totals, dataset['total']))
            series.append({'id': 'total', 'values': totals})
        unit = 'BRL_September_2026' if key == 'investment' else 'percent_GDP' if key == 'share' else 'count'
        for item in series:
            assert len(item['values']) == len(years)
            assert all(isinstance(v, (int, float)) and math.isfinite(v) and v >= 0 for v in item['values'])
            for year, value in zip(years, item['values']):
                writer.writerow([key, item['id'], year, value, unit, provenance['snapshot_date']])
        result['datasets'][key] = dict(years=years, series=series, unit=unit)
    outputs = {'series.json': json.dumps(result, ensure_ascii=False, indent=2) + '\n', 'series.csv': csv_file.getvalue()}
    for filename, content in outputs.items():
        if check:
            if (DATA / filename).read_bytes() != content.encode():
                raise ValueError('Rebuild required: ' + filename)
        else:
            (DATA / filename).write_bytes(content.encode())
    print('Verified six time series, source checksum, coverage, investment totals and CSV/JSON parity.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--upstream-html', type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    build(args.upstream_html, args.check)
