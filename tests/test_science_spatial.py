"""Spatial invariants and independently calculated regression anchors."""
import csv
import json
from pathlib import Path
import unittest

DATA = Path(__file__).resolve().parents[1] / 'laboratorio/ciencia-e-pos-graduacao/data'


class SpatialData(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.measures = json.loads((DATA / 'spatial.json').read_text())['measures']

    def test_2024_anchors(self):
        year = self.measures['tit_doutorado']['years']['2024']
        self.assertEqual(year['brasil']['count'], 25915)
        self.assertAlmostEqual(year['brasil']['rate'], 12.8, delta=.05)
        pr = year['uf']['PR']
        self.assertEqual(pr['count'], 1913)
        self.assertEqual(pr['population'], 11444380)
        self.assertAlmostEqual(pr['rate'], 16.7, delta=.05)
        self.assertAlmostEqual(year['uf']['AP']['rate'], 1.2, delta=.05)
        self.assertAlmostEqual(year['uf']['DF']['rate'], 27.9, delta=.05)
        self.assertEqual(self.measures['programas']['per'], 1000000)

    def test_no_invented_years(self):
        self.assertEqual(list(self.measures['tit_doutorado']['years']), ['2002','2010','2015','2018','2022','2024'])
        self.assertNotIn('2002', self.measures['bolsas']['years'])
        self.assertNotIn('2010', self.measures['programas']['years'])
        self.assertNotIn('2023', self.measures['programas']['years'])

    def test_weighted_rates_and_totals(self):
        for measure in self.measures.values():
            for levels in measure['years'].values():
                for level in ('uf', 'regiao'):
                    self.assertEqual(sum(u['count'] for u in levels[level].values()), levels['brasil']['count'])
                    self.assertEqual(sum(u['population'] for u in levels[level].values()), levels['brasil']['population'])
                    for u in levels[level].values():
                        self.assertAlmostEqual(u['rate'], u['count']/u['population']*measure['per'])

    def test_geometry_and_csv_coverage(self):
        geo = json.loads((DATA / 'brazil.geojson').read_text())
        self.assertEqual(geo['type'], 'FeatureCollection')
        self.assertEqual(len(geo['features']), 32)
        with (DATA / 'spatial.csv').open() as f:
            rows = list(csv.DictReader(f))
        self.assertEqual(len(rows), 672)
        self.assertEqual(len({(r['measure'],r['year'],r['level'],r['id']) for r in rows}), 672)
        for r in rows:
            unit = self.measures[r['measure']]['years'][r['year']][r['level']][r['id']]
            self.assertEqual(int(r['count']), unit['count'])
            self.assertEqual(float(r['rate']), unit['rate'])
