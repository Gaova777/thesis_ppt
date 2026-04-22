/* ============================================================
   Renderer for thesis figures.
   Each chart type is a pure SVG function returning a string.
   ============================================================ */

(function(){

const ACCENT='#B84A2E', SUPPORT='#6B8E23', SUPPORT2='#8A7A5C', INK='#2C2A27',
      INK_SOFT='#5A564F', INK_MUTE='#8B867B', RULE='#D4CDBF', BG_ALT='#EEE8DE',
      HL='#F4E9D1', ACCENT_SOFT='#E58A6E';

const fmt = (v, d=2) => v==null ? '—' : v.toFixed(d);
const fmtPct = v => Math.round(v*100)+'%';

/* ---------- Helpers ---------- */
function axisBox(w, h, m){
  // m = {top,right,bottom,left}
  return {x:m.left, y:m.top, w:w-m.left-m.right, h:h-m.top-m.bottom};
}

/* ---------- Chart: horizontal bars (pass rates) ---------- */
function bars_h(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:40,right:120,bottom:70,left:200});
  const xmax = f.xMax || 1.0;
  const bh = A.h / (f.data.length*1.5);
  const rowH = A.h / f.data.length;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  // x grid + labels
  const ticks = [0,0.25,0.5,0.75,1.0].filter(t=>t<=xmax+0.01);
  ticks.forEach(t=>{
    const x = A.x + (t/xmax)*A.w;
    s+=`<line class="gridline" x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}"/>`;
    s+=`<text class="ax-label" x="${x}" y="${A.y+A.h+24}" text-anchor="middle">${fmtPct(t)}</text>`;
  });
  // axis lines
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const y = A.y + i*rowH + rowH/2 - bh/2;
    const w = (d.rate/xmax)*A.w;
    const color = d.highlight ? ACCENT : d.danger ? INK_MUTE : SUPPORT2;
    s+=`<rect x="${A.x}" y="${y}" width="${w}" height="${bh}" fill="${color}"/>`;
    // category label
    s+=`<text class="cat-label" x="${A.x-16}" y="${y+bh/2+5}" text-anchor="end">${d.label}</text>`;
    // value label
    const passText = d.passed!=null ? `${d.passed}/${d.total}` : '';
    s+=`<text class="val-label" x="${A.x+w+10}" y="${y+bh/2+5}">${fmtPct(d.rate)} <tspan fill="${INK_MUTE}" font-size="11">${passText}</tspan></text>`;
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">${f.xAxisLabel||''}</text>`;
  s+=`</svg>`;
  return s;
}

function bars_h_n(f){
  // like bars_h but shows "n=" next to value
  const W=1100, H=560;
  const A=axisBox(W,H,{top:40,right:140,bottom:70,left:200});
  const xmax = f.xMax || 1.0;
  const rowH = A.h / f.data.length;
  const bh = rowH*0.6;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  const ticks = [0,0.2,0.4,0.6,0.8,1.0].filter(t=>t<=xmax+0.01);
  ticks.forEach(t=>{
    const x = A.x + (t/xmax)*A.w;
    s+=`<line class="gridline" x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}"/>`;
    s+=`<text class="ax-label" x="${x}" y="${A.y+A.h+24}" text-anchor="middle">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const y = A.y + i*rowH + rowH/2 - bh/2;
    const w = (d.rate/xmax)*A.w;
    const color = d.highlight ? ACCENT : SUPPORT2;
    s+=`<rect x="${A.x}" y="${y}" width="${w}" height="${bh}" fill="${color}"/>`;
    s+=`<text class="cat-label" x="${A.x-16}" y="${y+bh/2+5}" text-anchor="end">${d.label}</text>`;
    s+=`<text class="val-label" x="${A.x+w+10}" y="${y+bh/2+5}">${d.rate.toFixed(3)} <tspan fill="${INK_MUTE}" font-size="11">n=${d.n}</tspan></text>`;
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">${f.xAxisLabel||''}</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- Chart: heatmap ---------- */
function heatmap(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:60,right:180,bottom:70,left:160});
  const nr = f.rows.length, nc = f.cols.length;
  const cw = A.w/nc, ch = A.h/nr;

  function colorFor(v){
    if(v==null) return BG_ALT;
    const t = Math.max(0,Math.min(1,(v-f.colorMin)/(f.colorMax-f.colorMin)));
    // interp from light cream to accent
    const r = Math.round(245 + t*(184-245));
    const g = Math.round(242 + t*(74-242));
    const b = Math.round(236 + t*(46-236));
    return `rgb(${r},${g},${b})`;
  }

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // cells
  for(let i=0;i<nr;i++){
    for(let j=0;j<nc;j++){
      const v = f.data[i][j];
      const x = A.x + j*cw, y = A.y + i*ch;
      s+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${colorFor(v)}" stroke="${BG_ALT}" stroke-width="2"/>`;
      if(v!=null){
        const textColor = ((v-f.colorMin)/(f.colorMax-f.colorMin)>0.55) ? '#F5F2EC' : INK;
        s+=`<text x="${x+cw/2}" y="${y+ch/2+6}" text-anchor="middle" font-family="JetBrains Mono" font-size="18" font-weight="500" fill="${textColor}">${v.toFixed(3)}</text>`;
      } else {
        s+=`<text x="${x+cw/2}" y="${y+ch/2+5}" text-anchor="middle" font-family="Source Sans 3" font-size="16" fill="${INK_MUTE}" font-style="italic">—</text>`;
      }
    }
  }

  // col labels
  f.cols.forEach((c,j)=>{
    s+=`<text class="cat-label" x="${A.x + j*cw + cw/2}" y="${A.y-18}" text-anchor="middle">${c}</text>`;
  });
  // row labels
  f.rows.forEach((r,i)=>{
    s+=`<text class="cat-label" x="${A.x-14}" y="${A.y + i*ch + ch/2+5}" text-anchor="end">${r}</text>`;
  });

  // legend
  const lx = A.x+A.w+30, ly=A.y, lw=20, lh=A.h;
  const grad = `
    <defs>
      <linearGradient id="heatGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="${colorFor(f.colorMin)}"/>
        <stop offset="1" stop-color="${colorFor(f.colorMax)}"/>
      </linearGradient>
    </defs>`;
  s+=grad;
  s+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="url(#heatGrad)" stroke="${RULE}"/>`;
  s+=`<text class="ax-label" x="${lx+lw+8}" y="${ly+8}" font-size="11">${f.colorMax.toFixed(2)}</text>`;
  s+=`<text class="ax-label" x="${lx+lw+8}" y="${ly+lh}" font-size="11">${f.colorMin.toFixed(2)}</text>`;

  // axis titles
  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${A.y+A.h+40}" text-anchor="middle">${f.xAxisLabel||''}</text>`;
  s+=`<text class="ax-title" x="${22}" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">${f.yAxisLabel||''}</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- Chart: scatter with filter thresholds (R5) ---------- */
function scatter_filter(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:40,right:40,bottom:70,left:80});

  // points from figures-data.js (v3.1: 60 configs, 23 passed including native)
  const pts = f.data || window.THESIS_SCATTER_48 || [];

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  // axes
  const xmin=-0.05, xmax=0.6, ymin=-0.05, ymax=0.6;
  const X = v => A.x + ((v-xmin)/(xmax-xmin))*A.w;
  const Y = v => A.y + A.h - ((v-ymin)/(ymax-ymin))*A.h;

  // grid
  [0,0.1,0.2,0.3,0.4,0.5,0.6].forEach(t=>{
    s+=`<line class="gridline" x1="${X(t)}" y1="${A.y}" x2="${X(t)}" y2="${A.y+A.h}"/>`;
    s+=`<line class="gridline" x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}"/>`;
    s+=`<text class="ax-label" x="${X(t)}" y="${A.y+A.h+20}" text-anchor="middle">${t.toFixed(1)}</text>`;
    s+=`<text class="ax-label" x="${A.x-10}" y="${Y(t)+4}" text-anchor="end">${t.toFixed(1)}</text>`;
  });
  // thresholds
  s+=`<line x1="${X(f.thresholdX)}" y1="${A.y}" x2="${X(f.thresholdX)}" y2="${A.y+A.h}" stroke="${ACCENT}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  s+=`<line x1="${A.x}" y1="${Y(f.thresholdY)}" x2="${A.x+A.w}" y2="${Y(f.thresholdY)}" stroke="${ACCENT}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  // threshold labels
  s+=`<text x="${X(f.thresholdX)+6}" y="${A.y+14}" class="hl-t">F1 ≥ ${f.thresholdX}</text>`;
  s+=`<text x="${A.x+A.w-6}" y="${Y(f.thresholdY)-6}" class="hl-t" text-anchor="end">MCC ≥ ${f.thresholdY}</text>`;

  // region shading
  s+=`<rect x="${X(f.thresholdX)}" y="${A.y}" width="${A.x+A.w-X(f.thresholdX)}" height="${Y(f.thresholdY)-A.y}" fill="${HL}" opacity="0.5"/>`;

  // axes
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  // points
  pts.forEach(p=>{
    const color = p.passed ? ACCENT : INK_MUTE;
    const r = p.passed ? 7 : 5;
    const op = p.passed ? 0.85 : 0.45;
    const stroke = p.passed && p.native ? INK : (p.passed?'#fff':'none');
    const sw = p.passed && p.native ? 1.5 : (p.passed?1.2:0);
    s+=`<circle cx="${X(p.f1)}" cy="${Y(p.mcc)}" r="${r}" fill="${color}" opacity="${op}" stroke="${stroke}" stroke-width="${sw}"/>`;
  });

  // axis titles
  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">${f.xAxisLabel}</text>`;
  s+=`<text class="ax-title" x="${22}" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">${f.yAxisLabel}</text>`;

  // legend
  const lgx = A.x+A.w-220, lgy=A.y+30;
  s+=`<rect x="${lgx-8}" y="${lgy-16}" width="210" height="60" fill="${BG_ALT}" stroke="${RULE}"/>`;
  const _passed = pts.filter(p=>p.passed).length;
  const _failed = pts.length - _passed;
  const _native = pts.filter(p=>p.native).length;
  s+=`<circle cx="${lgx+6}" cy="${lgy}" r="7" fill="${ACCENT}"/>`;
  s+=`<text class="legend-t" x="${lgx+22}" y="${lgy+4}">Aprobadas (${_passed})</text>`;
  s+=`<circle cx="${lgx+6}" cy="${lgy+22}" r="5" fill="${INK_MUTE}"/>`;
  s+=`<text class="legend-t" x="${lgx+22}" y="${lgy+26}">Rechazadas (${_failed})</text>`;
  if(_native){
    s+=`<circle cx="${lgx+6}" cy="${lgy+44}" r="7" fill="${ACCENT}" stroke="${INK}" stroke-width="1.5"/>`;
    s+=`<text class="legend-t" x="${lgx+22}" y="${lgy+48}">Nativo 1:30 (${_native})</text>`;
  }

  s+=`</svg>`;
  return s;
}

/* ---------- Chart: ranked summary table (R6) ---------- */
function ranked_table(f){
  const W=1100, H=820;
  const rows = f.rows;
  const colX = {s:40, a:160, b:280, f1:420, mcc:580, sp:740};
  const rowH = Math.min(28, (H-80)/rows.length);
  const headerY = 46;
  const startY = headerY+18;
  const barW = 120;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // headers
  const hdrs = [
    {x:colX.s,  t:"Escenario"},
    {x:colX.a,  t:"Arquit."},
    {x:colX.b,  t:"Balanceo"},
    {x:colX.f1, t:"F1 val"},
    {x:colX.mcc,t:"MCC"},
    {x:colX.sp, t:"Spearman (GNNExp.)"}
  ];
  hdrs.forEach(h=>{
    s+=`<text class="ax-title" x="${h.x}" y="${headerY}" font-size="10">${h.t}</text>`;
  });
  s+=`<line x1="20" y1="${headerY+8}" x2="${W-20}" y2="${headerY+8}" stroke="${INK}" stroke-width="1"/>`;

  rows.forEach((r,i)=>{
    const y = startY + i*rowH;
    if(r.hl) s+=`<rect x="20" y="${y-16}" width="${W-40}" height="${rowH}" fill="${HL}"/>`;
    if(r.danger) s+=`<rect x="20" y="${y-16}" width="${W-40}" height="${rowH}" fill="${BG_ALT}"/>`;
    if(r.native) s+=`<rect x="20" y="${y-16}" width="4" height="${rowH}" fill="${ACCENT}"/>`;
    s+=`<text x="${colX.s}" y="${y+4}" font-family="JetBrains Mono" font-size="13" fill="${INK}">${r.s}</text>`;
    s+=`<text x="${colX.a}" y="${y+4}" font-family="Source Sans 3" font-size="13" fill="${INK}" font-weight="500">${r.a}</text>`;
    const balLbl = r.b==="focal_loss"?"focal loss":r.b==="class_weighting"?"class weight.":"sin balanceo";
    s+=`<text x="${colX.b}" y="${y+4}" font-family="Source Sans 3" font-size="12" fill="${INK_SOFT}">${balLbl}</text>`;

    // f1 bar
    const f1w = (r.f1/0.55)*barW;
    s+=`<rect x="${colX.f1}" y="${y-10}" width="${f1w}" height="16" fill="${SUPPORT2}" opacity="0.5"/>`;
    s+=`<text x="${colX.f1+f1w+6}" y="${y+4}" font-family="JetBrains Mono" font-size="12" fill="${INK}">${r.f1.toFixed(3)}</text>`;

    // mcc bar
    const mw = (r.mcc/0.55)*barW;
    s+=`<rect x="${colX.mcc}" y="${y-10}" width="${mw}" height="16" fill="${SUPPORT}" opacity="0.5"/>`;
    s+=`<text x="${colX.mcc+mw+6}" y="${y+4}" font-family="JetBrains Mono" font-size="12" fill="${INK}">${r.mcc.toFixed(3)}</text>`;

    // spearman bar (highlighted color)
    const spColor = r.sp>0.6?ACCENT:r.sp>0.4?ACCENT_SOFT:INK_MUTE;
    const spw = (r.sp/0.85)*(barW+100);
    s+=`<rect x="${colX.sp}" y="${y-10}" width="${spw}" height="16" fill="${spColor}" opacity="0.75"/>`;
    s+=`<text x="${colX.sp+spw+6}" y="${y+4}" font-family="JetBrains Mono" font-size="12" fill="${INK}" font-weight="500">${r.sp.toFixed(3)}</text>`;

    // subtle row divider
    if(i<rows.length-1) s+=`<line x1="20" y1="${y+14}" x2="${W-20}" y2="${y+14}" stroke="${RULE}" stroke-width="0.5" opacity="0.6"/>`;
  });

  s+=`</svg>`;
  return s;
}

/* ---------- A1: strip per explainer ---------- */
function strip_by_explainer(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:50,right:40,bottom:70,left:80});
  const ymin=-0.05, ymax=0.85;
  const Y = v => A.y + A.h - ((v-ymin)/(ymax-ymin))*A.h;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  // grid + y labels
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line class="gridline" x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}"/>`;
    s+=`<text class="ax-label" x="${A.x-10}" y="${Y(t)+4}" text-anchor="end">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  const colW = A.w / f.explainers.length;
  f.explainers.forEach((ex, i)=>{
    const cx = A.x + i*colW + colW/2;
    const color = i===0 ? ACCENT : i===1 ? SUPPORT : SUPPORT2;
    // points — jitter x
    ex.values.forEach((v,k)=>{
      const jitter = ((k*37)%100)/100 - 0.5;
      const x = cx + jitter*80;
      s+=`<circle cx="${x}" cy="${Y(v)}" r="6" fill="${color}" opacity="0.55" stroke="${color}" stroke-width="1"/>`;
    });
    // median line
    s+=`<line x1="${cx-80}" y1="${Y(ex.median)}" x2="${cx+80}" y2="${Y(ex.median)}" stroke="${INK}" stroke-width="3"/>`;
    // median label
    s+=`<text x="${cx+88}" y="${Y(ex.median)+4}" font-family="JetBrains Mono" font-size="13" fill="${INK}">${ex.median.toFixed(2)}</text>`;
    // category label
    s+=`<text class="cat-label" x="${cx}" y="${A.y+A.h+32}" text-anchor="middle" font-size="15">${ex.name}</text>`;
    s+=`<text class="ax-label" x="${cx}" y="${A.y+A.h+50}" text-anchor="middle" fill="${INK_MUTE}">n = ${ex.values.length}</text>`;
  });

  s+=`<text class="ax-title" x="${22}" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">${f.yAxisLabel}</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- A2: errorbars (scenario) ---------- */
function errorbars(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:40,right:40,bottom:80,left:80});
  const ymin=0, ymax=0.9;
  const Y = v => A.y + A.h - ((v-ymin)/(ymax-ymin))*A.h;
  const colW = A.w / f.data.length;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line class="gridline" x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}"/>`;
    s+=`<text class="ax-label" x="${A.x-10}" y="${Y(t)+4}" text-anchor="end">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  // connecting line
  let path='';
  f.data.forEach((d,i)=>{
    const x = A.x + i*colW + colW/2;
    path += (i===0?'M':'L') + x + ',' + Y(d.mean) + ' ';
  });
  s+=`<path d="${path}" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>`;

  f.data.forEach((d,i)=>{
    const x = A.x + i*colW + colW/2;
    const color = d.highlight ? ACCENT : d.danger ? INK_MUTE : SUPPORT2;
    // errorbar
    s+=`<line x1="${x}" y1="${Y(d.min)}" x2="${x}" y2="${Y(d.max)}" stroke="${color}" stroke-width="2.5"/>`;
    s+=`<line x1="${x-14}" y1="${Y(d.max)}" x2="${x+14}" y2="${Y(d.max)}" stroke="${color}" stroke-width="2.5"/>`;
    s+=`<line x1="${x-14}" y1="${Y(d.min)}" x2="${x+14}" y2="${Y(d.min)}" stroke="${color}" stroke-width="2.5"/>`;
    // mean point
    s+=`<circle cx="${x}" cy="${Y(d.mean)}" r="9" fill="${color}" stroke="#fff" stroke-width="2"/>`;
    // value label
    s+=`<text x="${x+14}" y="${Y(d.mean)+4}" font-family="JetBrains Mono" font-size="13" fill="${INK}">${d.mean.toFixed(3)}</text>`;
    // category
    s+=`<text class="cat-label" x="${x}" y="${A.y+A.h+26}" text-anchor="middle">${d.label}</text>`;
    s+=`<text class="ax-label" x="${x}" y="${A.y+A.h+44}" text-anchor="middle" fill="${INK_MUTE}">n=${d.n}</text>`;
  });

  s+=`<text class="ax-title" x="${22}" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">${f.yAxisLabel}</text>`;
  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">${f.xAxisLabel}</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- A4/D2: quadrant scatter ---------- */
function quadrants(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:40,right:40,bottom:70,left:80});
  const X = v => A.x + ((v-f.xMin)/(f.xMax-f.xMin))*A.w;
  const Y = v => A.y + A.h - ((v-f.yMin)/(f.yMax-f.yMin))*A.h;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  // bg quadrant (top-right = ideal)
  s+=`<rect x="${X(f.xDiv)}" y="${A.y}" width="${A.x+A.w-X(f.xDiv)}" height="${Y(f.yDiv)-A.y}" fill="${HL}" opacity="0.45"/>`;

  // ticks
  const xT = [0.25,0.30,0.35,0.40,0.45,0.50,0.55];
  const yT = [0.30,0.40,0.50,0.60,0.70];
  xT.forEach(t=>{ if(t>=f.xMin && t<=f.xMax){
    s+=`<line class="gridline" x1="${X(t)}" y1="${A.y}" x2="${X(t)}" y2="${A.y+A.h}"/>`;
    s+=`<text class="ax-label" x="${X(t)}" y="${A.y+A.h+20}" text-anchor="middle">${t.toFixed(2)}</text>`;
  }});
  yT.forEach(t=>{ if(t>=f.yMin && t<=f.yMax){
    s+=`<line class="gridline" x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}"/>`;
    s+=`<text class="ax-label" x="${A.x-10}" y="${Y(t)+4}" text-anchor="end">${t.toFixed(2)}</text>`;
  }});

  // divider lines
  s+=`<line x1="${X(f.xDiv)}" y1="${A.y}" x2="${X(f.xDiv)}" y2="${A.y+A.h}" stroke="${INK_SOFT}" stroke-dasharray="4 4" stroke-width="1.3"/>`;
  s+=`<line x1="${A.x}" y1="${Y(f.yDiv)}" x2="${A.x+A.w}" y2="${Y(f.yDiv)}" stroke="${INK_SOFT}" stroke-dasharray="4 4" stroke-width="1.3"/>`;

  // quadrant labels (for D2)
  if(f.quadrants){
    const qPos = {
      tr:{x:A.x+A.w-12, y:A.y+18, anchor:"end"},
      tl:{x:A.x+12, y:A.y+18, anchor:"start"},
      br:{x:A.x+A.w-12, y:A.y+A.h-12, anchor:"end"},
      bl:{x:A.x+12, y:A.y+A.h-12, anchor:"start"}
    };
    f.quadrants.forEach(q=>{
      const p = qPos[q.pos];
      const col = q.pos==='tr' ? ACCENT : INK_MUTE;
      s+=`<text x="${p.x}" y="${p.y}" text-anchor="${p.anchor}" font-family="Source Sans 3" font-size="12" font-weight="600" letter-spacing="0.1em" fill="${col}" text-transform="uppercase">${q.label.toUpperCase()}</text>`;
    });
  }

  // axes
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  // points
  f.data.forEach(p=>{
    const col = p.highlight ? ACCENT : SUPPORT2;
    s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="14" fill="${col}" opacity="0.95" stroke="#fff" stroke-width="2.5"/>`;
    // labels to the right (or above for top ones)
    const lx = X(p.x)+22, ly = Y(p.y)+5;
    s+=`<text x="${lx}" y="${ly}" font-family="Source Serif 4" font-size="18" font-weight="600" fill="${INK}">${p.label}</text>`;
    s+=`<text x="${lx}" y="${ly+18}" font-family="JetBrains Mono" font-size="12" fill="${INK_MUTE}">F1=${p.x.toFixed(3)} · ρ=${p.y.toFixed(3)}</text>`;
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">${f.xAxisLabel}</text>`;
  s+=`<text class="ax-title" x="${22}" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">${f.yAxisLabel}</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- A6: Jaccard histogram ---------- */
function jaccard_histogram(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:80,right:40,bottom:100,left:80});
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // Single big bar at 1.0
  const nBins = 10;
  const binW = A.w/nBins;
  for(let i=0;i<nBins;i++){
    const v = i/(nBins-1);
    const x = A.x + i*binW;
    const isFull = i===nBins-1;
    const h = isFull ? A.h : 6;
    const y = A.y + A.h - h;
    const col = isFull ? ACCENT : RULE;
    s+=`<rect x="${x+4}" y="${y}" width="${binW-8}" height="${h}" fill="${col}"/>`;
    if(isFull){
      s+=`<text x="${x+binW/2}" y="${y-12}" text-anchor="middle" font-family="JetBrains Mono" font-size="20" font-weight="600" fill="${ACCENT}">17/17</text>`;
      s+=`<text x="${x+binW/2}" y="${y-34}" text-anchor="middle" font-family="Source Sans 3" font-size="12" letter-spacing="0.18em" fill="${ACCENT}" font-weight="600" text-transform="uppercase">100% DE CONFIGS</text>`;
    }
  }

  // axis
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  // x labels
  for(let i=0;i<nBins;i++){
    const v = i/(nBins-1);
    s+=`<text class="ax-label" x="${A.x+i*binW+binW/2}" y="${A.y+A.h+22}" text-anchor="middle">${v.toFixed(1)}</text>`;
  }

  // y labels
  [0,5,10,15].forEach(t=>{
    const y = A.y + A.h - (t/17)*A.h;
    s+=`<text class="ax-label" x="${A.x-10}" y="${y+4}" text-anchor="end">${t}</text>`;
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-20}" text-anchor="middle">Índice de Jaccard (subgrafos explicativos)</text>`;
  s+=`<text class="ax-title" x="${22}" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">Nº de configuraciones</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- A7: Boxplot ---------- */
function boxplot(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:50,right:240,bottom:70,left:80});
  const ymin=0, ymax=0.9;
  const Y = v => A.y + A.h - ((v-ymin)/(ymax-ymin))*A.h;
  const colW = A.w / f.data.length;

  function quartiles(vals){
    const v = [...vals].sort((a,b)=>a-b);
    if(v.length===1) return {q1:v[0], q2:v[0], q3:v[0], min:v[0], max:v[0]};
    const q2 = v.length%2 ? v[(v.length-1)/2] : (v[v.length/2-1]+v[v.length/2])/2;
    const lower = v.slice(0, Math.floor(v.length/2));
    const upper = v.slice(Math.ceil(v.length/2));
    const med = arr => arr.length%2 ? arr[(arr.length-1)/2] : (arr[arr.length/2-1]+arr[arr.length/2])/2;
    return {q1: med(lower), q2, q3: med(upper), min:v[0], max:v[v.length-1]};
  }

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line class="gridline" x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}"/>`;
    s+=`<text class="ax-label" x="${A.x-10}" y="${Y(t)+4}" text-anchor="end">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const cx = A.x + i*colW + colW/2;
    const bw = 70;
    const q = quartiles(d.values);
    // whiskers
    s+=`<line x1="${cx}" y1="${Y(q.min)}" x2="${cx}" y2="${Y(q.max)}" stroke="${INK}" stroke-width="1.3"/>`;
    s+=`<line x1="${cx-20}" y1="${Y(q.min)}" x2="${cx+20}" y2="${Y(q.min)}" stroke="${INK}" stroke-width="1.3"/>`;
    s+=`<line x1="${cx-20}" y1="${Y(q.max)}" x2="${cx+20}" y2="${Y(q.max)}" stroke="${INK}" stroke-width="1.3"/>`;
    // box (only if >1 point)
    if(d.values.length>1){
      const y1 = Math.min(Y(q.q1),Y(q.q3)), h = Math.abs(Y(q.q3)-Y(q.q1));
      s+=`<rect x="${cx-bw/2}" y="${y1}" width="${bw}" height="${h}" fill="${ACCENT_SOFT}" opacity="0.4" stroke="${ACCENT}" stroke-width="1.5"/>`;
      // median
      s+=`<line x1="${cx-bw/2}" y1="${Y(q.q2)}" x2="${cx+bw/2}" y2="${Y(q.q2)}" stroke="${ACCENT}" stroke-width="3"/>`;
    }
    // individual points
    d.values.forEach((v,k)=>{
      const jitter = ((k*23)%100)/100 - 0.5;
      s+=`<circle cx="${cx+jitter*40}" cy="${Y(v)}" r="4" fill="${INK}" opacity="0.5"/>`;
    });
    // labels
    s+=`<text class="cat-label" x="${cx}" y="${A.y+A.h+26}" text-anchor="middle">${d.label}</text>`;
    s+=`<text class="ax-label" x="${cx}" y="${A.y+A.h+44}" text-anchor="middle" fill="${INK_MUTE}">n=${d.values.length}</text>`;
  });

  // stats panel
  const px = A.x+A.w+30, py=A.y+40;
  s+=`<rect x="${px-14}" y="${py-26}" width="210" height="130" fill="${BG_ALT}" stroke="${RULE}"/>`;
  s+=`<text x="${px}" y="${py-6}" font-family="Source Sans 3" font-size="10" letter-spacing="0.18em" fill="${ACCENT}" font-weight="600">KRUSKAL–WALLIS</text>`;
  s+=`<text x="${px}" y="${py+24}" font-family="Source Serif 4" font-size="28" font-weight="600" fill="${INK}">H = ${f.stats.H.toFixed(2)}</text>`;
  s+=`<text x="${px}" y="${py+58}" font-family="Source Serif 4" font-size="28" font-weight="600" fill="${INK}">p = ${f.stats.p.toFixed(3)}</text>`;
  s+=`<text x="${px}" y="${py+86}" font-family="Source Sans 3" font-size="12" fill="${INK_SOFT}">No significativo (α=0.05)</text>`;

  s+=`<text class="ax-title" x="${22}" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">${f.yAxisLabel}</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- A8: effect sizes ---------- */
function effect_sizes(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:50,right:140,bottom:70,left:260});
  const xmin=-1.2, xmax=0.3;
  const X = v => A.x + ((v-xmin)/(xmax-xmin))*A.w;
  const rowH = A.h / f.data.length;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  // magnitude bands (behind)
  const bands = [
    {from:-1.2, to:-0.8, label:"grande",    col:"#E58A6E", op:0.18},
    {from:-0.8, to:-0.5, label:"mediana",   col:"#B84A2E", op:0.12},
    {from:-0.5, to:-0.2, label:"pequeña",   col:"#8A7A5C", op:0.12},
    {from:-0.2, to: 0.2, label:"despreciable", col:"#8B867B", op:0.08}
  ];
  bands.forEach(b=>{
    s+=`<rect x="${X(b.from)}" y="${A.y}" width="${X(b.to)-X(b.from)}" height="${A.h}" fill="${b.col}" opacity="${b.op}"/>`;
    s+=`<text class="ax-label" x="${(X(b.from)+X(b.to))/2}" y="${A.y-8}" text-anchor="middle" font-size="10" letter-spacing="0.14em" fill="${INK_SOFT}" font-weight="600" text-transform="uppercase">${b.label.toUpperCase()}</text>`;
  });

  // zero line
  s+=`<line x1="${X(0)}" y1="${A.y}" x2="${X(0)}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="1.3"/>`;
  // ticks
  [-1,-0.8,-0.5,-0.2,0].forEach(t=>{
    s+=`<text class="ax-label" x="${X(t)}" y="${A.y+A.h+22}" text-anchor="middle">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const y = A.y + i*rowH + rowH/2;
    s+=`<text class="cat-label" x="${A.x-16}" y="${y+5}" text-anchor="end">${d.label}</text>`;
    if(d.d==null){
      s+=`<text x="${X(0)+10}" y="${y+5}" font-family="Source Sans 3" font-size="13" fill="${INK_MUTE}" font-style="italic">no calculable (n=1)</text>`;
    } else {
      const color = d.highlight ? ACCENT : SUPPORT2;
      const x0 = X(0), x1 = X(d.d);
      s+=`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${color}" stroke-width="16" stroke-linecap="round" opacity="0.85"/>`;
      s+=`<text x="${x1-10}" y="${y+5}" text-anchor="end" font-family="JetBrains Mono" font-size="12" fill="#fff" font-weight="600">${d.d.toFixed(3)}</text>`;
      s+=`<text x="${X(0)+10}" y="${y+5}" font-family="Source Sans 3" font-size="11" fill="${INK_MUTE}" letter-spacing="0.14em" text-transform="uppercase">${d.mag.toUpperCase()}</text>`;
    }
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">d de Cohen</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- A9: PG degeneration ---------- */
function pg_degeneration(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:60,right:60,bottom:80,left:280});
  const xmax=0.85;
  const X = v => A.x + (v/xmax)*A.w;
  const rowH = A.h / f.data.length;
  const bh = rowH*0.6;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  // legend
  s+=`<rect x="${A.x+A.w-250}" y="${A.y-44}" width="260" height="34" fill="${BG_ALT}" stroke="${RULE}"/>`;
  s+=`<rect x="${A.x+A.w-240}" y="${A.y-36}" width="18" height="16" fill="${ACCENT}" opacity="0.85"/>`;
  s+=`<text x="${A.x+A.w-218}" y="${A.y-23}" font-family="Source Sans 3" font-size="12" fill="${INK}">GNNExplainer</text>`;
  s+=`<rect x="${A.x+A.w-100}" y="${A.y-36}" width="18" height="16" fill="${INK_MUTE}"/>`;
  s+=`<text x="${A.x+A.w-78}" y="${A.y-23}" font-family="Source Sans 3" font-size="12" fill="${INK}">PGExplainer</text>`;

  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line class="gridline" x1="${X(t)}" y1="${A.y}" x2="${X(t)}" y2="${A.y+A.h}"/>`;
    s+=`<text class="ax-label" x="${X(t)}" y="${A.y+A.h+22}" text-anchor="middle">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const y = A.y + i*rowH + rowH/2 - bh/2;
    s+=`<rect x="${A.x}" y="${y}" width="${X(d.ex)-A.x}" height="${bh}" fill="${ACCENT}" opacity="0.75"/>`;
    // PG=0 shown as small notch at origin
    s+=`<circle cx="${A.x+2}" cy="${y+bh/2}" r="4" fill="${INK_MUTE}"/>`;
    s+=`<text class="cat-label" x="${A.x-14}" y="${y+bh/2+5}" text-anchor="end" font-family="JetBrains Mono" font-size="10">${d.label}</text>`;
    s+=`<text x="${X(d.ex)+6}" y="${y+bh/2+4}" font-family="JetBrains Mono" font-size="11" fill="${INK}">${d.ex.toFixed(2)}</text>`;
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">Spearman medio</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- A10: ranked bars ---------- */
function ranked_bars(f){
  const W=1100, H=620;
  const A=axisBox(W,H,{top:40,right:60,bottom:60,left:380});
  const xmax=0.85;
  const X = v => A.x + (v/xmax)*A.w;
  const rowH = A.h / f.data.length;
  const bh = rowH*0.62;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line class="gridline" x1="${X(t)}" y1="${A.y}" x2="${X(t)}" y2="${A.y+A.h}"/>`;
    s+=`<text class="ax-label" x="${X(t)}" y="${A.y+A.h+22}" text-anchor="middle">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const y = A.y + i*rowH + rowH/2 - bh/2;
    const col = d.hl ? ACCENT : d.v>0.6 ? ACCENT_SOFT : SUPPORT2;
    s+=`<rect x="${A.x}" y="${y}" width="${X(d.v)-A.x}" height="${bh}" fill="${col}" opacity="0.9"/>`;
    // rank
    s+=`<text x="${12}" y="${y+bh/2+6}" font-family="Source Serif 4" font-size="20" font-weight="600" fill="${d.hl?ACCENT:INK_MUTE}">${d.rank}</text>`;
    // config label
    const balLbl = d.b==='focal_loss'?'focal loss':d.b==='class_weighting'?'class weighting':'sin balanceo';
    s+=`<text x="46" y="${y+bh/2-2}" font-family="Source Sans 3" font-size="14" font-weight="600" fill="${INK}">${d.s} · ${d.a}</text>`;
    s+=`<text x="46" y="${y+bh/2+14}" font-family="Source Sans 3" font-size="12" fill="${INK_SOFT}">${balLbl}</text>`;
    // value
    s+=`<text x="${X(d.v)+8}" y="${y+bh/2+5}" font-family="JetBrains Mono" font-size="13" font-weight="500" fill="${INK}">${d.v.toFixed(3)}</text>`;
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">Spearman medio (GNNExplainer)</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- D1: SotA bars ---------- */
function sota_bars(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:40,right:280,bottom:60,left:380});
  const xmax=1.0;
  const X = v => A.x + (v/xmax)*A.w;
  const rowH = A.h / f.data.length;
  const bh = rowH*0.58;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.25,0.5,0.75,1.0].forEach(t=>{
    s+=`<line class="gridline" x1="${X(t)}" y1="${A.y}" x2="${X(t)}" y2="${A.y+A.h}"/>`;
    s+=`<text class="ax-label" x="${X(t)}" y="${A.y+A.h+22}" text-anchor="middle">${t.toFixed(2)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const y = A.y + i*rowH + rowH/2 - bh/2;
    const col = d.tag==='ours' ? ACCENT : SUPPORT2;
    s+=`<rect x="${A.x}" y="${y}" width="${X(d.f1)-A.x}" height="${bh}" fill="${col}" opacity="${d.tag==='ours'?0.9:0.55}"/>`;
    s+=`<text class="cat-label" x="${A.x-14}" y="${y+bh/2-2}" text-anchor="end" font-size="13">${d.label}</text>`;
    s+=`<text x="${A.x-14}" y="${y+bh/2+14}" text-anchor="end" font-family="Source Sans 3" font-style="italic" font-size="11" fill="${INK_MUTE}">${d.note}</text>`;
    s+=`<text x="${X(d.f1)+8}" y="${y+bh/2+5}" font-family="JetBrains Mono" font-size="14" font-weight="500" fill="${INK}">${d.f1.toFixed(2)}</text>`;
  });

  // legend
  const lx = A.x+A.w+20, ly = A.y+10;
  s+=`<rect x="${lx}" y="${ly}" width="220" height="100" fill="${BG_ALT}" stroke="${RULE}"/>`;
  s+=`<rect x="${lx+14}" y="${ly+14}" width="22" height="14" fill="${ACCENT}"/>`;
  s+=`<text x="${lx+44}" y="${ly+26}" font-family="Source Sans 3" font-size="12" fill="${INK}">Esta tesis</text>`;
  s+=`<rect x="${lx+14}" y="${ly+42}" width="22" height="14" fill="${SUPPORT2}" opacity="0.55"/>`;
  s+=`<text x="${lx+44}" y="${ly+54}" font-family="Source Sans 3" font-size="12" fill="${INK}">Trabajos externos</text>`;
  s+=`<text x="${lx+14}" y="${ly+78}" font-family="Source Sans 3" font-style="italic" font-size="10" fill="${INK_MUTE}">Protocolos heterogéneos</text>`;
  s+=`<text x="${lx+14}" y="${ly+92}" font-family="Source Sans 3" font-style="italic" font-size="10" fill="${INK_MUTE}">(val vs test, splits)</text>`;

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">F1 (ilícito)</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- D3: peak and collapse ---------- */
function peak_collapse(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:50,right:200,bottom:80,left:80});
  const ymin=-0.05, ymax=0.8;
  const Y = v => A.y + A.h - ((v-ymin)/(ymax-ymin))*A.h;
  const colW = A.w / (f.scenarios.length-1);
  const X = i => A.x + i*colW;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line class="gridline" x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}"/>`;
    s+=`<text class="ax-label" x="${A.x-10}" y="${Y(t)+4}" text-anchor="end">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  const colors = [ACCENT, SUPPORT, SUPPORT2];
  f.series.forEach((ser,si)=>{
    const c = colors[si];
    let path='';
    ser.values.forEach((v,i)=>{ path += (i===0?'M':'L') + X(i) + ',' + Y(v) + ' '; });
    s+=`<path d="${path}" fill="none" stroke="${c}" stroke-width="3"/>`;
    ser.values.forEach((v,i)=>{
      s+=`<circle cx="${X(i)}" cy="${Y(v)}" r="7" fill="${c}" stroke="#fff" stroke-width="2"/>`;
      if(si===0) s+=`<text x="${X(i)}" y="${Y(v)-14}" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="${c}" font-weight="500">${v.toFixed(3)}</text>`;
    });
    // annotate peak for first series
    if(si===0){
      const peakIdx=2;
      s+=`<text x="${X(peakIdx)}" y="${Y(ser.values[peakIdx])-34}" text-anchor="middle" class="hl-t">PICO</text>`;
      s+=`<text x="${X(3)}" y="${Y(ser.values[3])-14}" text-anchor="middle" font-family="Source Sans 3" font-size="11" fill="${INK_MUTE}" font-weight="600" letter-spacing="0.14em" text-transform="uppercase">COLAPSO</text>`;
    }
  });

  // x labels
  f.scenarios.forEach((c,i)=>{
    s+=`<text class="cat-label" x="${X(i)}" y="${A.y+A.h+28}" text-anchor="middle">${c}</text>`;
  });

  // legend
  const lx = A.x+A.w+20, ly=A.y+20;
  s+=`<rect x="${lx-8}" y="${ly-14}" width="180" height="100" fill="${BG_ALT}" stroke="${RULE}"/>`;
  f.series.forEach((ser,i)=>{
    s+=`<line x1="${lx}" y1="${ly+i*26}" x2="${lx+24}" y2="${ly+i*26}" stroke="${colors[i]}" stroke-width="3"/>`;
    s+=`<circle cx="${lx+12}" cy="${ly+i*26}" r="5" fill="${colors[i]}"/>`;
    s+=`<text x="${lx+32}" y="${ly+i*26+4}" font-family="Source Sans 3" font-size="12" fill="${INK}">${ser.name}</text>`;
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">${f.xAxisLabel}</text>`;
  s+=`<text class="ax-title" x="${22}" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">${f.yAxisLabel}</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- D4: recommendation matrix ---------- */
function recommendation_matrix(f){
  const W=1100, H=620;
  const A=axisBox(W,H,{top:80,right:40,bottom:60,left:420});
  const cols = f.cols;
  const rows = f.rows;
  const cw = A.w/cols.length;
  const ch = A.h/rows.length;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // column headers
  cols.forEach((c,j)=>{
    s+=`<text class="cat-label" x="${A.x + j*cw + cw/2}" y="${A.y-22}" text-anchor="middle" font-size="15" font-weight="600">${c}</text>`;
  });

  // column totals
  const totals = cols.map(c => rows.reduce((a,r)=>a+r.scores[c],0));
  const maxTotal = Math.max(...totals);

  rows.forEach((r,i)=>{
    const y = A.y + i*ch;
    s+=`<text class="cat-label" x="${A.x-14}" y="${y+ch/2+5}" text-anchor="end" font-size="13">${r.name}</text>`;
    cols.forEach((c,j)=>{
      const x = A.x + j*cw;
      const score = r.scores[c];
      // cell border
      s+=`<rect x="${x+4}" y="${y+6}" width="${cw-8}" height="${ch-12}" fill="${BG_ALT}" stroke="${RULE}"/>`;
      // fill proportional to score/3
      const frac = score/3;
      const color = score===3 ? ACCENT : score===2 ? ACCENT_SOFT : score===1 ? SUPPORT2 : 'transparent';
      if(score>0){
        s+=`<rect x="${x+4}" y="${y+6}" width="${(cw-8)*frac}" height="${ch-12}" fill="${color}" opacity="0.85"/>`;
      }
      // score number
      const tColor = score>=2 ? '#fff' : INK;
      s+=`<text x="${x+cw/2}" y="${y+ch/2+8}" text-anchor="middle" font-family="Source Serif 4" font-size="28" font-weight="600" fill="${tColor}">${score}</text>`;
    });
  });

  // totals row
  const ty = A.y + A.h + 20;
  s+=`<text class="cat-label" x="${A.x-14}" y="${ty+4}" text-anchor="end" font-weight="600" font-size="12" letter-spacing="0.14em" text-transform="uppercase">TOTAL</text>`;
  cols.forEach((c,j)=>{
    const x = A.x + j*cw + cw/2;
    const isMax = totals[j]===maxTotal;
    s+=`<text x="${x}" y="${ty+4}" text-anchor="middle" font-family="JetBrains Mono" font-size="14" font-weight="600" fill="${isMax?ACCENT:INK}">${totals[j]}</text>`;
  });

  // scale legend
  const lx = A.x, ly = 20;
  s+=`<text x="${lx}" y="${ly+12}" font-family="Source Sans 3" font-size="10" letter-spacing="0.22em" text-transform="uppercase" font-weight="600" fill="${ACCENT}">ESCALA</text>`;
  ['0 — no apto','1 — limitado','2 — adecuado','3 — óptimo'].forEach((txt,i)=>{
    const lxi = lx+90+i*170;
    const col = i===3 ? ACCENT : i===2 ? ACCENT_SOFT : i===1 ? SUPPORT2 : INK_MUTE;
    s+=`<rect x="${lxi}" y="${ly+2}" width="14" height="14" fill="${col}" opacity="${i===0?0.3:0.85}"/>`;
    s+=`<text x="${lxi+20}" y="${ly+14}" font-family="Source Sans 3" font-size="12" fill="${INK}">${txt}</text>`;
  });

  s+=`</svg>`;
  return s;
}

/* ---------- D5: stacked hours ---------- */
function stacked_hours(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:80,right:80,bottom:90,left:280});
  const xmax = Math.max(...f.data.map(d=>d.train+d.explain)) * 1.1;
  const X = v => A.x + (v/xmax)*A.w;
  const rowH = A.h / f.data.length;
  const bh = rowH*0.5;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // legend
  const lx = A.x, ly = 30;
  s+=`<rect x="${lx}" y="${ly}" width="18" height="18" fill="${SUPPORT}"/>`;
  s+=`<text x="${lx+26}" y="${ly+14}" font-family="Source Sans 3" font-size="14" fill="${INK}">Entrenamiento</text>`;
  s+=`<rect x="${lx+190}" y="${ly}" width="18" height="18" fill="${ACCENT}"/>`;
  s+=`<text x="${lx+216}" y="${ly+14}" font-family="Source Sans 3" font-size="14" fill="${INK}">Explicación XAI</text>`;

  [0,5,10,15,20,25,30].forEach(t=>{
    if(t<=xmax){
      s+=`<line class="gridline" x1="${X(t)}" y1="${A.y}" x2="${X(t)}" y2="${A.y+A.h}"/>`;
      s+=`<text class="ax-label" x="${X(t)}" y="${A.y+A.h+22}" text-anchor="middle">${t}</text>`;
    }
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const y = A.y + i*rowH + rowH/2 - bh/2;
    const trainW = X(d.train)-A.x;
    const expW = X(d.train+d.explain)-X(d.train);
    s+=`<rect x="${A.x}" y="${y}" width="${trainW}" height="${bh}" fill="${SUPPORT}" opacity="0.88"/>`;
    s+=`<rect x="${X(d.train)}" y="${y}" width="${expW}" height="${bh}" fill="${ACCENT}" opacity="0.88"/>`;
    s+=`<text class="cat-label" x="${A.x-14}" y="${y+bh/2+5}" text-anchor="end" font-size="14">${d.machine}</text>`;
    // mid labels
    if(trainW>40) s+=`<text x="${A.x+trainW/2}" y="${y+bh/2+5}" text-anchor="middle" font-family="JetBrains Mono" font-size="13" fill="#fff" font-weight="500">${d.train} h</text>`;
    else s+=`<text x="${A.x+trainW+6}" y="${y+bh/2+5}" font-family="JetBrains Mono" font-size="11" fill="${INK}">${d.train} h</text>`;
    if(expW>40) s+=`<text x="${X(d.train)+expW/2}" y="${y+bh/2+5}" text-anchor="middle" font-family="JetBrains Mono" font-size="13" fill="#fff" font-weight="500">${d.explain} h</text>`;
    // total at end
    s+=`<text x="${X(d.train+d.explain)+10}" y="${y+bh/2+5}" font-family="JetBrains Mono" font-size="12" fill="${INK_MUTE}">= ${(d.train+d.explain).toFixed(1)} h</text>`;
    // ratio annotation
    const ratio = d.explain/d.train;
    if(d.highlight){
      s+=`<text x="${A.x-14}" y="${y+bh+26}" text-anchor="end" font-family="Source Sans 3" font-style="italic" font-size="12" fill="${ACCENT}">explain = ${ratio.toFixed(1)}× train</text>`;
    } else {
      s+=`<text x="${A.x-14}" y="${y+bh+26}" text-anchor="end" font-family="Source Sans 3" font-style="italic" font-size="12" fill="${INK_MUTE}">explain = ${ratio.toFixed(1)}× train</text>`;
    }
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">Horas-GPU</text>`;
  s+=`</svg>`;
  return s;
}

/* ---------- D2: quadrants labeled — uses quadrants() ---------- */
const quadrants_labeled = quadrants;

/* ============================================================
   R5 scatter dataset: 48 points (from CSV)
   ============================================================ */
window.THESIS_SCATTER_48 = [
  {f1:0.2075,mcc:0.2694,passed:false},{f1:0.2935,mcc:0.2693,passed:false},{f1:0.0259,mcc:-0.0092,passed:false},
  {f1:0.2983,mcc:0.2803,passed:false},{f1:0.1597,mcc:0.1299,passed:false},{f1:0.0022,mcc:0.0080,passed:false},
  {f1:0.4380,mcc:0.4409,passed:true}, {f1:0.0041,mcc:-0.0007,passed:false},{f1:0.0087,mcc:0.0651,passed:false},
  {f1:0.2490,mcc:0.2311,passed:false},{f1:0.0022,mcc:0.0089,passed:false},{f1:0.0000,mcc:0.0000,passed:false},
  {f1:0.1995,mcc:0.2669,passed:false},{f1:0.3261,mcc:0.3205,passed:true}, {f1:0.4595,mcc:0.4436,passed:true},
  {f1:0.3148,mcc:0.3103,passed:true}, {f1:0.2908,mcc:0.2721,passed:false},{f1:0.2163,mcc:0.1889,passed:false},
  {f1:0.4785,mcc:0.4672,passed:true}, {f1:0.5295,mcc:0.5196,passed:true}, {f1:0.4714,mcc:0.4538,passed:true},
  {f1:0.2633,mcc:0.2412,passed:false},{f1:0.3077,mcc:0.2955,passed:true}, {f1:0.3774,mcc:0.3679,passed:true},
  {f1:0.3150,mcc:0.2955,passed:true}, {f1:0.2031,mcc:0.2491,passed:false},{f1:0.2449,mcc:0.3102,passed:false},
  {f1:0.2145,mcc:0.2479,passed:false},{f1:0.0870,mcc:0.0902,passed:false},{f1:0.1926,mcc:0.2226,passed:false},
  {f1:0.3434,mcc:0.3834,passed:true}, {f1:0.2616,mcc:0.3285,passed:false},{f1:0.3623,mcc:0.4020,passed:true},
  {f1:0.2676,mcc:0.2451,passed:false},{f1:0.2474,mcc:0.2939,passed:false},{f1:0.2676,mcc:0.2451,passed:false},
  {f1:0.3150,mcc:0.2944,passed:true}, {f1:0.4199,mcc:0.4006,passed:true}, {f1:0.2593,mcc:0.2583,passed:false},
  {f1:0.2973,mcc:0.3068,passed:false},{f1:0.0746,mcc:0.1139,passed:false},{f1:0.1349,mcc:0.1433,passed:false},
  {f1:0.5166,mcc:0.5067,passed:true}, {f1:0.5226,mcc:0.5115,passed:true}, {f1:0.2540,mcc:0.2329,passed:false},
  {f1:0.2549,mcc:0.2362,passed:false},{f1:0.3097,mcc:0.2971,passed:true}, {f1:0.0000,mcc:0.0000,passed:false}
];

/* ---------- A11: native vs forced (errorbars with native highlight) ---------- */
function native_vs_forced(f){
  const W=1100, H=560;
  const A=axisBox(W,H,{top:40,right:40,bottom:90,left:80});
  const ymin=0, ymax=0.85;
  const Y = v => A.y + A.h - ((v-ymin)/(ymax-ymin))*A.h;
  const colW = A.w / f.data.length;

  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line class="gridline" x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}"/>`;
    s+=`<text class="ax-label" x="${A.x-10}" y="${Y(t)+4}" text-anchor="end">${t.toFixed(1)}</text>`;
  });
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}"/>`;
  s+=`<line class="ax-line" x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}"/>`;

  f.data.forEach((d,i)=>{
    const cx = A.x + i*colW + colW/2;
    const bw = Math.min(80, colW*0.55);
    const top = Y(d.mean);
    const bottom = A.y+A.h;
    let fill = SUPPORT;
    if(d.native) fill = ACCENT;
    else if(d.highlight) fill = ACCENT_SOFT;
    else if(d.danger) fill = INK_MUTE;
    s+=`<rect x="${cx-bw/2}" y="${top}" width="${bw}" height="${bottom-top}" fill="${fill}" opacity="${d.native?0.9:0.75}"${d.native?' stroke="'+INK+'" stroke-width="2"':''}/>`;
    if(d.native){
      for(let yp=top+5; yp<bottom; yp+=10){
        s+=`<line x1="${cx-bw/2}" y1="${yp}" x2="${cx-bw/2+Math.min(bw,bottom-yp)}" y2="${yp+Math.min(bw,bottom-yp)}" stroke="${INK}" stroke-width="0.8" opacity="0.25"/>`;
      }
    }
    const errTop = Y(d.mean + d.std);
    const errBot = Y(Math.max(0, d.mean - d.std));
    s+=`<line x1="${cx}" y1="${errTop}" x2="${cx}" y2="${errBot}" stroke="${INK}" stroke-width="1.5"/>`;
    s+=`<line x1="${cx-16}" y1="${errTop}" x2="${cx+16}" y2="${errTop}" stroke="${INK}" stroke-width="1.5"/>`;
    s+=`<line x1="${cx-16}" y1="${errBot}" x2="${cx+16}" y2="${errBot}" stroke="${INK}" stroke-width="1.5"/>`;
    s+=`<text x="${cx}" y="${top-8}" text-anchor="middle" font-family="JetBrains Mono" font-size="13" font-weight="600" fill="${INK}">${d.mean.toFixed(3)}</text>`;
    s+=`<text class="cat-label" x="${cx}" y="${A.y+A.h+24}" text-anchor="middle"${d.native?' fill="'+ACCENT+'" font-weight="700"':''}>${d.label}</text>`;
    s+=`<text class="ax-label" x="${cx}" y="${A.y+A.h+42}" text-anchor="middle">n=${d.n}</text>`;
  });

  s+=`<text class="ax-title" x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle">${f.xAxisLabel||''}</text>`;
  s+=`<text class="ax-title" x="22" y="${A.y+A.h/2}" text-anchor="middle" transform="rotate(-90 22 ${A.y+A.h/2})">${f.yAxisLabel||''}</text>`;

  // legend
  const lgx=A.x+A.w-220, lgy=A.y+16;
  s+=`<rect x="${lgx-8}" y="${lgy-12}" width="220" height="52" fill="${BG_ALT}" stroke="${RULE}"/>`;
  s+=`<rect x="${lgx}" y="${lgy-2}" width="20" height="10" fill="${SUPPORT}" opacity="0.75"/>`;
  s+=`<text class="legend-t" x="${lgx+28}" y="${lgy+6}">Escenarios forzados</text>`;
  s+=`<rect x="${lgx}" y="${lgy+18}" width="20" height="10" fill="${ACCENT}" opacity="0.9" stroke="${INK}" stroke-width="1.5"/>`;
  s+=`<text class="legend-t" x="${lgx+28}" y="${lgy+26}" font-weight="700" fill="${ACCENT}">Escenario nativo</text>`;

  s+=`</svg>`;
  return s;
}

/* ============================================================
   Render
   ============================================================ */
const RENDERERS = {
  bars_h, bars_h_n, heatmap, scatter_filter, ranked_table,
  strip_by_explainer, errorbars, quadrants, jaccard_histogram,
  boxplot, effect_sizes, pg_degeneration, ranked_bars,
  sota_bars, peak_collapse, recommendation_matrix, stacked_hours,
  quadrants_labeled, native_vs_forced
};

function renderAll(){
  const host = document.getElementById('figs');
  let html = '';
  window.THESIS_FIGS.forEach((f,idx)=>{
    const renderer = RENDERERS[f.chart] || (()=>`<div style="padding:40px;color:#aaa">Chart type not implemented: ${f.chart}</div>`);
    const chartSVG = renderer(f);
    html += `
    <section class="page" id="${f.id}">
      <div class="fig-head">
        <div class="left">
          <div class="fig-id">Figura ${f.id} · ${String(idx+1).padStart(2,'0')} de ${window.THESIS_FIGS.length}</div>
          <h2 class="fig-title">${f.title}</h2>
        </div>
        <div class="section">${f.section}</div>
      </div>
      <div class="fig-read">
        <div class="lbl">CÓMO LEER</div>
        <div class="t">${f.reading}</div>
      </div>
      <div class="chart-area">${chartSVG}</div>
      <div class="fig-caption">${f.caption}</div>
      <div class="fig-foot">
        <div>Tesis · Estabilidad XAI en GNNs · Elliptic Dataset</div>
        <div class="src">Fuente: ${f.source}</div>
      </div>
    </section>`;
  });
  host.innerHTML = html;
}

renderAll();

})();
