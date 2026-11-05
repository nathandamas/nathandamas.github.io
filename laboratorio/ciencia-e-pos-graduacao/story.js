/* Original interface by Nathan Damas Antonio · MIT. Dataset attribution in data/provenance.json. */
(() => {
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let translations, data, provenance, lang = 'en', index = 0, selectedYear;
  const ids = ['overview','investment','share','abroad','programmes','enrolment','graduates','methods'];
  const aliases = {'c1-1':'investment','c1-3':'share','c2-3':'abroad','c3-1':'programmes','c3-2':'enrolment','c3-3':'graduates'};
  const t = () => translations[lang];
  const locale = () => lang === 'pt' ? 'pt-BR' : 'en-US';
  const num = (value, digits = 0) => new Intl.NumberFormat(locale(), {maximumFractionDigits:digits}).format(value);
  function format(value, unit, compact = false) {
    if (unit === 'BRL_September_2026') return compact ? `${lang === 'pt' ? 'R$' : 'BRL'} ${num(value / 1e9, 1)} ${lang === 'pt' ? 'bi' : 'bn'}` : `${lang === 'pt' ? 'R$' : 'BRL'} ${num(value, 2)}`;
    if (unit === 'percent_GDP') return `${num(value, compact ? 2 : 4)}%`;
    return compact && value >= 10000 ? `${num(value / 1000, 1)} ${lang === 'pt' ? 'mil' : 'k'}` : num(value);
  }
  function readURL() {
    lang = new URLSearchParams(location.search).get('lang') === 'pt' ? 'pt' : 'en';
    const hash = new URLSearchParams(location.hash.slice(1));
    const id = aliases[hash.get('cartao')] || hash.get('cartao');
    index = Math.max(0, ids.indexOf(id)); selectedYear = Number(hash.get('year')) || undefined;
  }
  function writeURL(replace = false) {
    const url = new URL(location.href); url.searchParams.set('lang',lang);
    const hash = new URLSearchParams({cartao:ids[index]});
    if (data.datasets[ids[index]] && selectedYear) hash.set('year',selectedYear);
    url.hash = hash.toString(); history[replace ? 'replaceState' : 'pushState'](null,'',url);
  }
  function go(next) { if(!data)return; index = Math.max(0,Math.min(7,next)); selectedYear = undefined; writeURL(); render(true); }
  function methods() {
    const p = t();
    return `<p class="description">${escape(p.methodsIntro)}</p><ol class="methods">${p.methodItems.map(item=>`<li>${escape(item)}</li>`).join('')}</ol>
      <h3>${escape(p.primary)}</h3><ul>${provenance.primary_sources.map(s=>`<li><a href="${escape(s.url)}">${escape(s.id === 'mcti.indicadores_cti' ? 'MCTI · CT&I 2025' : 'IBGE · IPCA · SIDRA 1737')}</a></li>`).join('')}</ul>
      <h3>${escape(p.files)}</h3><p><a href="README.md">${escape(p.readme)}</a> · <a href="https://github.com/nathandamas/nathandamas.github.io/blob/master/analises/ciencia-e-pos-graduacao/prepare.py">${escape(p.code)}</a> · <a href="data/provenance.json">${escape(p.provenance)}</a></p><p class="notice">${escape(p.license)}<br>${escape(p.verification)}</p>`;
  }
  function stats(dataset) {
    const s = dataset.series.find(item=>item.id==='total') || dataset.series[0];
    const peak = Math.max(...s.values); const peakIndex = s.values.indexOf(peak);
    return `<p class="small">${escape(t().series[s.id])}</p><div class="stats">${[
      [s.values[0],t().start,dataset.years[0]],
      [s.values.at(-1),t().end,dataset.years.at(-1)],
      [peak,t().peak,dataset.years[peakIndex]]
    ].map(([v,label,year])=>`<div class="stat"><strong>${escape(format(v,dataset.unit,true))}</strong><span>${escape(label)} · ${year}</span></div>`).join('')}</div>`;
  }
  function table(dataset) {
    return `<details><summary>${escape(t().table)}</summary><div class="table-wrap"><table><caption>${escape(t().unitLabel)}: ${escape(t().units[dataset.unit])}</caption><thead><tr><th scope="col">${lang==='pt'?'Ano':'Year'}</th>${dataset.series.map(s=>`<th scope="col">${escape(t().series[s.id])}</th>`).join('')}</tr></thead><tbody>${dataset.years.map((year,i)=>`<tr><th scope="row">${year}</th>${dataset.series.map(s=>`<td>${escape(format(s.values[i],dataset.unit))}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
  }
  function chart(dataset) {
    const width = Math.max(260, Math.min(720, $('#plot').clientWidth));
    const height = width < 450 ? 260 : 290, left = width < 450 ? 52 : 76, right = 16, top = 18, bottom = 34;
    const values = dataset.series.flatMap(s=>s.values), rawMax = Math.max(...values);
    const power = 10 ** Math.floor(Math.log10(rawMax / 4));
    const step = [1, 2, 2.5, 5, 10].find(n => n * power >= rawMax / 4) * power;
    const max = Math.ceil(rawMax / step) * step;
    const x = i => left + i*(width-left-right)/(dataset.years.length-1);
    const y = v => height-bottom - v/max*(height-top-bottom);
    let selected = dataset.years.indexOf(selectedYear); if(selected<0) selected = dataset.years.length-1;
    selectedYear = dataset.years[selected];
    const ticks = Array.from({length:Math.round(max/step)+1},(_,i)=>step*i);
    const grid = ticks.map(v=>`<line class="grid" x1="${left}" y1="${y(v)}" x2="${width-right}" y2="${y(v)}"/><text x="${left-9}" y="${y(v)+4}" text-anchor="end">${escape(dataset.unit==='BRL_September_2026'?num(v/1e9,0):dataset.unit==='percent_GDP'?num(v,2):num(v,0))}</text>`).join('');
    const labels = dataset.years.map((year,i)=>i===0||i===dataset.years.length-1||(width<450?i===Math.floor(dataset.years.length/2):i%5===0)?`<text x="${x(i)}" y="${height-6}" text-anchor="middle">${year}</text>`:'').join('');
    const paths = dataset.series.map((s,j)=>`<path class="series-${j}" d="M${s.values.map((v,i)=>`${x(i)},${y(v)}`).join(' L')}" fill="none" stroke-width="${s.id==='total'?3.5:2.5}" ${j===1?'stroke-dasharray="7 4"':''}/><circle class="series-${j}" cx="${x(selected)}" cy="${y(s.values[selected])}" r="4" fill="var(--surface)" stroke-width="2"/>`).join('');
    $('#plot').innerHTML = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">${escape(t().cards[index].title)}</title><desc id="chart-desc">${dataset.years[0]}–${dataset.years.at(-1)}. ${escape(t().units[dataset.unit])}. ${escape(t().table)}.</desc>${grid}${labels}<line x1="${x(selected)}" y1="${top}" x2="${x(selected)}" y2="${height-bottom}" stroke="var(--muted)" opacity=".35"/>${paths}</svg>`;
    $('#year-value').textContent = selectedYear;
    $('#year').value = selected;
    $('#year').setAttribute('aria-valuetext', String(selectedYear));
    $('#readout').innerHTML = dataset.series.map(s=>`<span>${escape(t().series[s.id])}: <strong>${escape(format(s.values[selected],dataset.unit))}</strong></span>`).join('');
  }
  function render(focus = false) {
    const p = t(), card = p.cards[index], dataset = data.datasets[card.id];
    document.documentElement.lang = lang==='pt'?'pt-BR':'en'; document.title = `${p.title} · Nathan Damas Antonio`;
    $('#snapshot').textContent = p.snapshot; $('#credit').textContent = p.credit;
    $('#catalog-link').textContent = lang==='pt'?'← Laboratório':'← Lab'; $('#catalog-link').href = `../?lang=${lang}`;
    $('#original-link').textContent=p.original; $('#methods-link').textContent=p.methods;
    document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
    $('#steps').innerHTML = p.cards.map((c,i)=>`<button data-card="${i}" ${i===index?'aria-current="step"':''}><span>${String(i+1).padStart(2,'0')}</span>${escape(c.nav)}</button>`).join('');
    $('#steps').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.card))));
    $('#progress').style.width = `${(index+1)/8*100}%`;
    let body = '';
    if(card.id==='overview') body=`<p class="lead">${escape(p.overviewText)}</p><div class="stats">${['8','6','EN / PT'].map((v,i)=>`<div class="stat"><strong>${v}</strong><span>${escape(p.statLabels[i])}</span></div>`).join('')}</div><p class="notice">${escape(p.overviewNote)}</p><p class="small">${escape(p.credit)}</p>`;
    else if(card.id==='methods') body=methods();
    else body=`<p class="description">${escape(card.description)}</p>${stats(dataset)}<p class="small">${escape(p.units[dataset.unit])}${dataset.unit==='BRL_September_2026'?` · ${lang==='pt'?'eixo em bilhões':'axis in billions'}`:''}</p><div id="plot"></div><div class="legend">${dataset.series.map(s=>`<span>${escape(p.series[s.id])}</span>`).join('')}</div><div class="year-control"><label for="year">${escape(p.year)} · <strong id="year-value"></strong></label><input id="year" type="range" min="0" max="${dataset.years.length-1}" step="1"></div><div class="readout" id="readout" aria-live="polite"></div><p class="notice">${escape(card.note)}</p>${table(dataset)}`;
    $('#content').innerHTML=`<p class="eyebrow">${String(index+1).padStart(2,'0')} / 08 · ${escape(p.title)}</p><h1 id="card-title" tabindex="-1" style="font-size:clamp(1.8rem,3.7vw,3rem)">${escape(card.title)}</h1>${body}`;
    $('#previous').textContent=p.previous; $('#previous').disabled=index===0;
    $('#next').textContent=p.next; $('#next').disabled=index===7;
    $('#counter').textContent=`${index+1} ${p.of} 8`;
    $('#share').textContent=p.copy; $('#status').replaceChildren();
    $('.tools a[href="data/series.csv"]').textContent=p.csv; $('.tools a[href="data/series.json"]').textContent=p.json; $('.tools a[href="data/provenance.json"]').textContent=p.provenance;
    if(dataset){chart(dataset); $('#year').addEventListener('input',event=>{selectedYear=dataset.years[Number(event.target.value)];chart(dataset);writeURL(true);});}
    if(focus){$('#card-title').focus({preventScroll:true});$('#main').scrollIntoView({block:'start'});}
  }
  $('#previous').addEventListener('click',()=>go(index-1)); $('#next').addEventListener('click',()=>go(index+1));
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{if(!data)return;lang=button.dataset.lang;writeURL(true);render();}));
  $('#share').addEventListener('click',async()=>{
    if(!data)return;writeURL(true);
    try{await navigator.clipboard.writeText(location.href);$('#status').textContent=t().copied;}
    catch{const field=document.createElement('input');field.value=location.href;field.readOnly=true;field.className='copy-fallback';field.setAttribute('aria-label',t().copy);$('#status').textContent=t().copyFallback;$('#status').append(field);field.focus();field.select();}
  });
  document.addEventListener('keydown',event=>{
    if(!data||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT|BUTTON|A/.test(event.target.tagName))return;
    if(event.key==='ArrowRight'){event.preventDefault();go(index+1);}if(event.key==='ArrowLeft'){event.preventDefault();go(index-1);}
  });
  addEventListener('popstate',()=>{if(data){readURL();render();}});
  addEventListener('hashchange',()=>{if(data){readURL();render();}});
  addEventListener('resize',()=>{if(data && data.datasets[ids[index]]) chart(data.datasets[ids[index]]);});
  const load = path => fetch(path).then(r=>{if(!r.ok)throw new Error(`${path}: ${r.status}`);return r.json();});
  Promise.all([load('content.json'),load('data/series.json'),load('data/provenance.json')]).then(([copy,series,meta])=>{translations=copy;data=series;provenance=meta;readURL();render();}).catch(error=>{
    $('#content').innerHTML='<div class="error"><h1>Data unavailable / Dados indisponíveis</h1><p>Reload this page or download the CSV below. / Recarregue a página ou baixe o CSV abaixo.</p></div>';$('#previous').disabled=true;$('#next').disabled=true;console.error(error);
  });
})();
