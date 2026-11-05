let language = new URLSearchParams(location.search).get('lang') === 'pt' ? 'pt' : 'en';
function translate() {
  document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  document.title = `${language === 'pt' ? 'Laboratório' : 'Lab'} · Nathan Damas Antonio`;
  document.querySelectorAll('[data-en]').forEach(node => { node.textContent = node.dataset[language]; });
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
  document.querySelector('#open-story').href = `ciencia-e-pos-graduacao/?lang=${language}`;
  const chart = document.querySelector('#sparkline svg');
  if (chart) chart.setAttribute('aria-label', language === 'pt' ? 'Investimento federal em C&T, 2000 a 2023' : 'Federal investment in S&T, 2000 to 2023');
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
  language = button.dataset.lang;
  const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url); translate();
}));
translate();
fetch('ciencia-e-pos-graduacao/data/series.json').then(response => { if (!response.ok) throw new Error('Data unavailable'); return response.json(); }).then(data => {
  const values = data.datasets.investment.series.find(s => s.id === 'total').values;
  const max = Math.max(...values); const coords = values.map((v, i) => `${10 + i * 380 / (values.length - 1)},${150 - v / max * 125}`);
  document.querySelector('#sparkline').innerHTML = `<svg viewBox="0 0 400 180" role="img"><path d="M${coords.join(' L')} L390,160 L10,160 Z" fill="var(--accent)" opacity=".12"/><path d="M${coords.join(' L')}" fill="none" stroke="var(--accent)" stroke-width="3"/><text x="10" y="178" fill="var(--muted)" font-size="12">2000</text><text x="355" y="178" fill="var(--muted)" font-size="12">2023</text></svg>`;
  translate();
}).catch(() => { document.querySelector('#sparkline').textContent = '2000 → 2023'; });
