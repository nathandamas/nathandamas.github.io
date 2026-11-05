"""Check reported observations, derived sums and published exports."""
import csv
import hashlib
import json
import math
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'laboratorio/ciencia-e-pos-graduacao/data'


class ScienceDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = json.loads((DATA / 'source-series.json').read_text())
        cls.web = json.loads((DATA / 'series.json').read_text())['datasets']

    def test_frozen_input(self):
        provenance = json.loads((DATA / 'provenance.json').read_text())
        self.assertEqual(hashlib.sha256((DATA / 'source-series.json').read_bytes()).hexdigest(), provenance['source_series_sha256'])
        self.assertEqual(provenance['upstream_commit'], 'cd79b6124949f6fbd4ac3ae884b8e6d10176d950')

    def test_published_observations(self):
        # Independent anchors read from the upstream numeric data, not its prose.
        abroad = self.web['abroad']
        self.assertEqual(abroad['years'][abroad['series'][0]['values'].index(44412)], 2014)
        self.assertEqual(abroad['series'][0]['values'][-1], 8856)
        self.assertEqual(self.web['programmes']['series'][0]['values'][-1], 4635)
        self.assertEqual(self.web['graduates']['series'][1]['values'][-1], 25915)
        self.assertEqual(self.web['share']['series'][0]['values'][-1], .4194)

    def test_source_parity_and_coverage(self):
        for key, dataset in self.source.items():
            with self.subTest(key=key):
                self.assertEqual(self.web[key]['series'][:len(dataset['series'])], dataset['series'])
                years = self.web[key]['years']
                self.assertEqual(years, list(range(2000, 2024 if key in ('investment', 'share') else 2025)))
                for series in self.web[key]['series']:
                    self.assertEqual(len(series['values']), len(years))
                    self.assertTrue(all(math.isfinite(v) and v >= 0 for v in series['values']))

    def test_investment_components(self):
        series = self.web['investment']['series']
        for i, value in enumerate(series[2]['values']):
            self.assertAlmostEqual(value, series[0]['values'][i] + series[1]['values'][i], places=5)
            self.assertAlmostEqual(value, self.source['investment']['total'][i], places=2)

    def test_csv_matches_displayed_values(self):
        with (DATA / 'series.csv').open(newline='') as handle:
            rows = list(csv.DictReader(handle))
        self.assertEqual(len(rows), 246)
        keys = set()
        for row in rows:
            key = (row['dataset'], row['series'], row['year'])
            self.assertNotIn(key, keys)
            keys.add(key)
            dataset = self.web[row['dataset']]
            series = next(s for s in dataset['series'] if s['id'] == row['series'])
            self.assertEqual(float(row['value']), series['values'][dataset['years'].index(int(row['year']))])
            self.assertEqual(row['unit'], dataset['unit'])


if __name__ == '__main__':
    unittest.main()
