/* Spatial interface © Nathan Damas Antonio · MIT. Data: see data/provenance.json. */
window.ScienceMap = (() => {
  let data, geometry, state = {}, lang, onChange;
  const colors = ['#c68a38','#99803e','#64716b','#328c80','#105f57'];
  const copy = {
    pt: {indicator:'Indicador',year:'Ano',area:'Estado ou região',uf:'UFs',regiao:'Regiões',brasil:'Brasil',
      measures:{tit_doutorado:'Doutores titulados',tit_mestrado:'Mestres titulados',bolsas:'Bolsas da CAPES',programas:'Programas de pós-graduação'},
      per:'por',inhabitants:'habitantes',population:'População · Censo 2022',count:'Valor absoluto',average:'Média do Brasil',
      legend:'Cor: taxa em relação à média do Brasil no mesmo ano',bands:['< 50%','50% a < 85%','85% a < 115%','115% a < 200%','≥ 200%'],
      hint:'Selecione um território no mapa ou na lista. Use + e − para ampliar e arraste para mover.',
      table:'Ver todos os territórios e valores',territory:'Território',rate:'Taxa',zoomIn:'Ampliar mapa',zoomOut:'Reduzir mapa',reset:'Restaurar mapa',
      downloads:'Baixar dados espaciais',note:'Taxas com população fixa do Censo 2022 em todos os anos; não representam taxas com a população estimada de cada ano. Titulados: UF do programa; bolsas e programas: UF da instituição. A troca dos valores de Amazonas e Amapá foi herdada da correção do autor da base. Sem detalhamento municipal nesta versão.',
      coverage:'Anos selecionados disponíveis na publicação de referência. Ausência de ano não significa zero.',between:'Varia de',to:'a'},
    en: {indicator:'Indicator',year:'Year',area:'State or region',uf:'States',regiao:'Regions',brasil:'Brazil',
      measures:{tit_doutorado:'Doctoral graduates',tit_mestrado:'Master’s graduates',bolsas:'CAPES scholarships',programas:'Postgraduate programmes'},
      per:'per',inhabitants:'inhabitants',population:'Population · 2022 Census',count:'Absolute count',average:'Brazil average',
      legend:'Colour: rate relative to Brazil’s average in the same year',bands:['< 50%','50% to < 85%','85% to < 115%','115% to < 200%','≥ 200%'],
      hint:'Select a territory on the map or in the list. Use + and − to zoom, and drag to pan.',
      table:'View all territories and values',territory:'Territory',rate:'Rate',zoomIn:'Zoom in',zoomOut:'Zoom out',reset:'Reset map',
      downloads:'Download spatial data',note:'Rates use the fixed 2022 Census population for every year; they are not rates based on each year’s estimated population. Graduates: programme’s state; scholarships and programmes: institution’s state. The source author’s correction swapping Amazonas and Amapá values is retained. No municipal breakdown in this version.',
      coverage:'Selected years available in the reference publication. An absent year does not mean zero.',between:'Ranges from',to:'to'}
  };
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const n = (v,d=0) => new Intl.NumberFormat(lang==='pt'?'pt-BR':'en-US',{maximumFractionDigits:d}).format(v);
  function normalise() {
    if(!Object.hasOwn(data.measures,state.measure)) state.measure='tit_doutorado';
    const years=data.measures[state.measure].years;
    if(!Object.hasOwn(years,state.year)) state.year=Object.keys(years).at(-1);
    if(!['uf','regiao'].includes(state.level)) state.level='uf';
    if(!Object.hasOwn(years[state.year][state.level],state.area)) state.area='';
  }
  function read(hash) {state={measure:hash.get('measure'),year:hash.get('year'),level:hash.get('level'),area:hash.get('area')};normalise();}
  function write(hash) {for(const [k,v] of Object.entries(state))if(v)hash.set(k,v);}
  function mount(root,language,changed) {
    lang=language;onChange=changed;normalise();
    const t=copy[lang], measure=data.measures[state.measure], year=measure.years[state.year], units=year[state.level];
    const rows=Object.entries(units).sort((a,b)=>b[1].rate-a[1].rate);
    const unit=`${t.per} ${n(measure.per)} ${t.inhabitants}`;
    const range=rows.at(-1)[1], top=rows[0][1];
    root.innerHTML=`<div class="map-filters"><label>${t.indicator}<select id="map-measure">${Object.keys(data.measures).map(k=>`<option value="${k}" ${k===state.measure?'selected':''}>${t.measures[k]}</option>`).join('')}</select></label><label>${t.year}<select id="map-year">${Object.keys(measure.years).map(y=>`<option ${y===state.year?'selected':''}>${y}</option>`).join('')}</select></label></div>
      <p class="map-headline"><strong>${t.brasil}: ${n(year.brasil.rate,1)}</strong> ${unit} · ${state.year}</p><p class="small">${t.between} <strong>${n(range.rate,1)}</strong> (${esc(range.name)}) ${t.to} <strong>${n(top.rate,1)}</strong> (${esc(top.name)}).</p>
      <div class="map-toolbar"><div class="map-level" role="group" aria-label="${t.area}">${['uf','regiao'].map(k=>`<button data-level="${k}" aria-pressed="${k===state.level}">${t[k]}</button>`).join('')}</div><label class="map-select">${t.area}<select id="map-area"><option value="">${t.brasil}</option>${Object.entries(units).sort((a,b)=>a[1].name.localeCompare(b[1].name)).map(([id,u])=>`<option value="${esc(id)}" ${id===state.area?'selected':''}>${esc(u.name)}${state.level==='uf'?' · '+id:''}</option>`).join('')}</select></label></div>
      <div class="map-canvas"><svg id="brazil-map" viewBox="0 0 600 580" role="group" aria-label="${t.measures[state.measure]} · ${state.year}"></svg><div class="map-tooltip" hidden aria-hidden="true"></div><div class="map-zoom"><button data-zoom="in" aria-label="${t.zoomIn}">+</button><button data-zoom="out" aria-label="${t.zoomOut}">−</button><button data-zoom="reset" aria-label="${t.reset}">↺</button></div></div>
      <div id="map-details" class="map-details" aria-live="polite" aria-atomic="true"></div><p class="small">${t.hint}</p>
      <div class="map-legend"><p>${t.legend}</p><div>${t.bands.map((b,i)=>`<span><i style="background:${colors[i]}"></i>${b}</span>`).join('')}</div></div>
      <p class="notice">${t.note}</p><p class="small">${t.coverage}</p>
      <details><summary>${t.table}</summary><div class="table-wrap"><table><caption>${t.measures[state.measure]} · ${state.year} · ${unit}</caption><thead><tr><th scope="col">${t.territory}</th><th scope="col">${t.count}</th><th scope="col">${t.population}</th><th scope="col">${t.rate}</th></tr></thead><tbody>${rows.map(([id,u])=>`<tr><th scope="row">${esc(u.name)}</th><td>${n(u.count)}</td><td>${n(u.population)}</td><td>${n(u.rate,1)}</td></tr>`).join('')}</tbody></table></div></details>
      <p class="small map-downloads">${t.downloads}: <a href="data/spatial.csv" download>CSV</a> · <a href="data/spatial.json" download>JSON</a> · <a href="data/brazil.geojson" download>GeoJSON</a></p>`;
    const svg=d3.select(root.querySelector('svg')), group=svg.append('g');
    const geo=geometry[state.level];
    const projection=d3.geoMercator().fitExtent([[25,20],[575,560]],geo), path=d3.geoPath(projection);
    const color=u=>colors[d3.bisectRight([.5,.85,1.15,2],u.rate/year.brasil.rate)];
    const details=id=>{
      const u=units[id]||year.brasil;
      root.querySelector('#map-details').innerHTML=`<div><span class="small">${esc(units[id]?.name||t.brasil)}</span><strong>${n(u.rate,1)} <small>${unit}</small></strong></div><div><span>${t.count}: <b>${n(u.count)}</b></span><span>${t.population}: ${n(u.population)}</span><span>${t.average}: ${n(year.brasil.rate,1)} ${unit}</span></div>`;
    };
    const tip=root.querySelector('.map-tooltip');
    const showTip=(event,f)=>{
      if(event.pointerType==='touch')return;
      const u=units[f.properties.id], canvas=root.querySelector('.map-canvas').getBoundingClientRect();
      tip.innerHTML=`<strong>${esc(u.name)}</strong><span>${n(u.rate,1)} ${unit}</span><span>${t.count}: ${n(u.count)}</span>`;tip.hidden=false;
      const box=event.currentTarget.getBoundingClientRect();
      const x=event.type==='focus'?box.x+box.width/2:event.clientX;
      const y=event.type==='focus'?box.y+box.height/2:event.clientY;
      tip.style.left=`${Math.max(8,Math.min(x-canvas.left+12,canvas.width-tip.offsetWidth-8))}px`;
      tip.style.top=`${Math.max(8,Math.min(y-canvas.top+12,canvas.height-tip.offsetHeight-8))}px`;
    };
    const select=id=>{state.area=id;root.querySelector('#map-area').value=id;group.selectAll('path').classed('selected',f=>f.properties.id===id).attr('aria-pressed',f=>String(f.properties.id===id));details(id);onChange();};
    group.selectAll('path').data(geo.features).join('path').attr('d',path).attr('fill',f=>color(units[f.properties.id])).attr('class','map-unit').classed('selected',f=>f.properties.id===state.area)
      .attr('data-id',f=>f.properties.id).attr('tabindex',0).attr('role','button').attr('aria-pressed',f=>String(f.properties.id===state.area))
      .attr('aria-label',f=>`${units[f.properties.id].name}: ${n(units[f.properties.id].rate,1)} ${unit}`)
      .on('pointerenter focus',(event,f)=>{details(f.properties.id);showTip(event,f);}).on('pointermove',showTip).on('pointerleave blur',()=>{details(state.area);tip.hidden=true;})
      .on('click',(_,f)=>select(f.properties.id)).on('keydown',(event,f)=>{if(['Enter',' '].includes(event.key)){event.preventDefault();event.stopPropagation();select(f.properties.id);}})
      .append('title').text(f=>`${units[f.properties.id].name}: ${n(units[f.properties.id].rate,1)} ${unit}`);
    const zoom=d3.zoom().scaleExtent([1,6]).translateExtent([[0,0],[600,580]]).extent([[0,0],[600,580]]).filter(e=>e.type!=='wheel'&&e.type!=='dblclick'&&!e.ctrlKey&&!e.button).on('zoom',e=>group.attr('transform',e.transform));
    svg.call(zoom);
    root.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>b.dataset.zoom==='reset'?svg.call(zoom.transform,d3.zoomIdentity):svg.call(zoom.scaleBy,b.dataset.zoom==='in'?1.5:1/1.5));
    root.querySelector('#map-area').onchange=e=>select(e.target.value);
    const update=()=>{normalise();onChange();mount(root,lang,onChange);};
    root.querySelector('#map-measure').onchange=e=>{state.measure=e.target.value;update();root.querySelector('#map-measure').focus();};
    root.querySelector('#map-year').onchange=e=>{state.year=e.target.value;update();root.querySelector('#map-year').focus();};
    root.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{state.level=b.dataset.level;state.area='';update();root.querySelector(`[data-level="${state.level}"]`).focus();});
    details(state.area);
  }
  return {init:(values,shapes)=>{data=values;geometry=Object.fromEntries(['uf','regiao'].map(level=>[level,{type:'FeatureCollection',features:structuredClone(shapes.features.filter(f=>f.properties.level===level))}]));for(const collection of Object.values(geometry))for(const f of collection.features)if(d3.geoArea(f)>2*Math.PI){const polygons=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;polygons.forEach(p=>p.forEach(r=>r.reverse()));}},read,write,mount};
})();
