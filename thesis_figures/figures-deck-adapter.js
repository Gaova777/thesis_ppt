/* ============================================================
   Deck adapter: exposes window.renderFig(id) returning an SVG string.
   Relies on window.THESIS_FIGS (from figures-data.js).
   Uses the SAME chart functions as figures-render.js by re-declaring
   them in this module (kept in sync manually).
   ============================================================ */

(function(){

const ACCENT='#B84A2E', SUPPORT='#6B8E23', SUPPORT2='#8A7A5C', INK='#2C2A27',
      INK_SOFT='#5A564F', INK_MUTE='#8B867B', RULE='#D4CDBF', BG_ALT='#EEE8DE',
      HL='#F4E9D1', ACCENT_SOFT='#E58A6E';

const fmt = (v, d=2) => v==null ? '—' : v.toFixed(d);
const fmtPct = v => Math.round(v*100)+'%';
const axisBox = (w,h,m) => ({x:m.left, y:m.top, w:w-m.left-m.right, h:h-m.top-m.bottom});

/* ---- bars_h ---- */
function bars_h(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:200,bottom:70,left:200});
  const xmax=f.xMax||1, rowH=A.h/f.data.length, bh=rowH*0.6;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.25,0.5,0.75,1].filter(t=>t<=xmax+.01).forEach(t=>{
    const x=A.x+(t/xmax)*A.w;
    s+=`<line class="g" x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${x}" y="${A.y+A.h+28}" text-anchor="middle" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)">${fmtPct(t)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.data.forEach((d,i)=>{
    const y=A.y+i*rowH+rowH/2-bh/2, w=(d.rate/xmax)*A.w;
    const c=d.highlight?ACCENT:d.danger?INK_MUTE:SUPPORT2;
    s+=`<rect x="${A.x}" y="${y}" width="${w}" height="${bh}" fill="${c}"/>`;
    s+=`<text x="${A.x-16}" y="${y+bh/2+8}" text-anchor="end" font-size="26" font-family="var(--ff-serif)" fill="${INK}" font-weight="600">${d.label}</text>`;
    const pt=d.passed!=null?` (${d.passed}/${d.total})`:'';
    s+=`<text x="${A.x+w+12}" y="${y+bh/2+8}" font-size="24" fill="${INK}" font-family="var(--ff-sans)" font-weight="600">${fmtPct(d.rate)}<tspan fill="${INK_MUTE}" font-weight="400">${pt}</tspan></text>`;
  });
  if(f.xAxisLabel) s+=`<text x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.xAxisLabel}</text>`;
  s+=`</svg>`;return s;
}

/* ---- bars_h_n ---- */
function bars_h_n(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:140,bottom:70,left:200});
  const xmax=f.xMax||1, rowH=A.h/f.data.length, bh=rowH*0.6;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8,1].filter(t=>t<=xmax+.01).forEach(t=>{
    const x=A.x+(t/xmax)*A.w;
    s+=`<line x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${x}" y="${A.y+A.h+28}" text-anchor="middle" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)">${t.toFixed(1)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.data.forEach((d,i)=>{
    const y=A.y+i*rowH+rowH/2-bh/2, w=(d.rate/xmax)*A.w;
    const c=d.highlight?ACCENT:SUPPORT2;
    s+=`<rect x="${A.x}" y="${y}" width="${w}" height="${bh}" fill="${c}"/>`;
    s+=`<text x="${A.x-16}" y="${y+bh/2+8}" text-anchor="end" font-size="26" font-family="var(--ff-serif)" fill="${INK}" font-weight="600">${d.label}</text>`;
    s+=`<text x="${A.x+w+12}" y="${y+bh/2+8}" font-size="24" fill="${INK}" font-family="var(--ff-sans)" font-weight="600">${d.rate.toFixed(3)} <tspan fill="${INK_MUTE}" font-weight="400">(n=${d.n})</tspan></text>`;
  });
  if(f.xAxisLabel) s+=`<text x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.xAxisLabel}</text>`;
  s+=`</svg>`;return s;
}

/* ---- heatmap ---- */
function heatmap(f){
  const W=1100,H=560,A=axisBox(W,H,{top:70,right:40,bottom:70,left:200});
  const cw=A.w/f.cols.length, rh=A.h/f.rows.length;
  const cmin=f.colorMin, cmax=f.colorMax;
  const lerp=(v)=>{
    if(v==null) return '#F0EBDF';
    const t=Math.max(0,Math.min(1,(v-cmin)/(cmax-cmin)));
    const r=Math.round(244+(184-244)*t), g=Math.round(233+(74-233)*t), b=Math.round(209+(46-209)*t);
    return `rgb(${r},${g},${b})`;
  };
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  f.cols.forEach((c,j)=>{
    s+=`<text x="${A.x+j*cw+cw/2}" y="${A.y-18}" text-anchor="middle" font-size="24" font-weight="600" fill="${INK}" font-family="var(--ff-sans)">${c}</text>`;
  });
  f.rows.forEach((r,i)=>{
    s+=`<text x="${A.x-16}" y="${A.y+i*rh+rh/2+8}" text-anchor="end" font-size="26" font-weight="600" fill="${INK}" font-family="var(--ff-serif)">${r}</text>`;
    f.cols.forEach((_,j)=>{
      const v=f.data[i][j];
      s+=`<rect x="${A.x+j*cw+3}" y="${A.y+i*rh+3}" width="${cw-6}" height="${rh-6}" fill="${lerp(v)}" stroke="${RULE}" stroke-width="1"/>`;
      const txt=v==null?'—':v.toFixed(3);
      const tcol=v!=null&&v>(cmin+cmax)/2?'#fff':INK;
      s+=`<text x="${A.x+j*cw+cw/2}" y="${A.y+i*rh+rh/2+9}" text-anchor="middle" font-size="26" font-weight="600" fill="${tcol}" font-family="var(--ff-mono)">${txt}</text>`;
    });
  });
  if(f.xAxisLabel) s+=`<text x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.xAxisLabel}</text>`;
  s+=`</svg>`;return s;
}

/* ---- peak_collapse ---- */
function peak_collapse(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:200,bottom:80,left:90});
  const ymax=0.8, xs=f.scenarios.length;
  const colX=(i)=>A.x+(i/(xs-1))*A.w;
  const yV=(v)=>A.y+A.h-(v/ymax)*A.h;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    const y=yV(t);
    s+=`<line x1="${A.x}" y1="${y}" x2="${A.x+A.w}" y2="${y}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${A.x-12}" y="${y+8}" text-anchor="end" font-size="24" fill="${INK_MUTE}" font-family="var(--ff-sans)">${t.toFixed(1)}</text>`;
  });
  f.scenarios.forEach((sc,i)=>{
    s+=`<text x="${colX(i)}" y="${A.y+A.h+36}" text-anchor="middle" font-size="26" fill="${INK}" font-family="var(--ff-sans)" font-weight="600">${sc}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.series.forEach((ser,si)=>{
    const color=si===0?ACCENT:si===1?SUPPORT:SUPPORT2;
    const pts=ser.values.map((v,i)=>`${colX(i)},${yV(v)}`).join(' ');
    s+=`<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    ser.values.forEach((v,i)=>{
      s+=`<circle cx="${colX(i)}" cy="${yV(v)}" r="8" fill="${color}"/>`;
    });
    const lastV=ser.values[ser.values.length-1];
    s+=`<text x="${colX(xs-1)+16}" y="${yV(lastV)+7}" font-size="24" fill="${color}" font-family="var(--ff-sans)" font-weight="600">${ser.name}</text>`;
  });
  if(f.yAxisLabel) s+=`<text transform="rotate(-90 30 ${A.y+A.h/2})" x="30" y="${A.y+A.h/2}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.yAxisLabel}</text>`;
  s+=`</svg>`;return s;
}

/* ---- quadrants ---- */
function quadrants(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:80,bottom:80,left:110});
  const xV=(v)=>A.x+((v-f.xMin)/(f.xMax-f.xMin))*A.w;
  const yV=(v)=>A.y+A.h-((v-f.yMin)/(f.yMax-f.yMin))*A.h;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  // grid
  [0.3,0.4,0.5].forEach(t=>{const x=xV(t);s+=`<line x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1"/><text x="${x}" y="${A.y+A.h+30}" text-anchor="middle" font-size="22" fill="${INK_MUTE}">${t}</text>`;});
  [0.4,0.5,0.6,0.7].forEach(t=>{const y=yV(t);s+=`<line x1="${A.x}" y1="${y}" x2="${A.x+A.w}" y2="${y}" stroke="${RULE}" stroke-width="1"/><text x="${A.x-12}" y="${y+7}" text-anchor="end" font-size="22" fill="${INK_MUTE}">${t}</text>`;});
  // dividers
  s+=`<line x1="${xV(f.xDiv)}" y1="${A.y}" x2="${xV(f.xDiv)}" y2="${A.y+A.h}" stroke="${ACCENT}" stroke-width="2" stroke-dasharray="6 8" opacity=".5"/>`;
  s+=`<line x1="${A.x}" y1="${yV(f.yDiv)}" x2="${A.x+A.w}" y2="${yV(f.yDiv)}" stroke="${ACCENT}" stroke-width="2" stroke-dasharray="6 8" opacity=".5"/>`;
  // axes
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  // quadrant labels if present
  if(f.quadrants){
    f.quadrants.forEach(q=>{
      let x,y;
      if(q.pos==='tr'){x=xV(f.xDiv)+20;y=A.y+24;}
      else if(q.pos==='tl'){x=A.x+20;y=A.y+24;}
      else if(q.pos==='br'){x=xV(f.xDiv)+20;y=A.y+A.h-16;}
      else {x=A.x+20;y=A.y+A.h-16;}
      s+=`<text x="${x}" y="${y}" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)" font-style="italic">${q.label}</text>`;
    });
  }
  // points
  f.data.forEach(d=>{
    const x=xV(d.x), y=yV(d.y);
    const col=d.highlight?ACCENT:INK;
    s+=`<circle cx="${x}" cy="${y}" r="16" fill="${col}" opacity=".85"/>`;
    s+=`<text x="${x+22}" y="${y+9}" font-size="26" font-weight="700" fill="${col}" font-family="var(--ff-serif)">${d.label}</text>`;
  });
  if(f.xAxisLabel) s+=`<text x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.xAxisLabel}</text>`;
  if(f.yAxisLabel) s+=`<text transform="rotate(-90 35 ${A.y+A.h/2})" x="35" y="${A.y+A.h/2}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.yAxisLabel}</text>`;
  s+=`</svg>`;return s;
}
const quadrants_labeled = quadrants;

/* ---- strip_by_explainer ---- */
function strip_by_explainer(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:60,bottom:80,left:110});
  const cols=f.explainers.length, cw=A.w/cols;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    const y=A.y+A.h-(t/0.8)*A.h;
    s+=`<line x1="${A.x}" y1="${y}" x2="${A.x+A.w}" y2="${y}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${A.x-12}" y="${y+7}" text-anchor="end" font-size="22" fill="${INK_MUTE}">${t.toFixed(1)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.explainers.forEach((e,i)=>{
    const cx=A.x+i*cw+cw/2;
    const col=i===0?ACCENT:i===1?SUPPORT:SUPPORT2;
    e.values.forEach(v=>{
      const y=A.y+A.h-(v/0.8)*A.h;
      const jit=(Math.sin((v+i)*23)*0.5)*cw*0.3;
      s+=`<circle cx="${cx+jit}" cy="${y}" r="8" fill="${col}" opacity=".55"/>`;
    });
    const my=A.y+A.h-(e.median/0.8)*A.h;
    s+=`<line x1="${cx-80}" y1="${my}" x2="${cx+80}" y2="${my}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
    s+=`<text x="${cx}" y="${A.y+A.h+36}" text-anchor="middle" font-size="26" font-weight="600" fill="${INK}" font-family="var(--ff-sans)">${e.name}</text>`;
    s+=`<text x="${cx}" y="${A.y+A.h+62}" text-anchor="middle" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)">mediana ${e.median.toFixed(2)}</text>`;
  });
  if(f.yAxisLabel) s+=`<text transform="rotate(-90 35 ${A.y+A.h/2})" x="35" y="${A.y+A.h/2}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.yAxisLabel}</text>`;
  s+=`</svg>`;return s;
}

/* ---- errorbars ---- */
function errorbars(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:60,bottom:80,left:110});
  const ymax=0.9, xs=f.data.length;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    const y=A.y+A.h-(t/ymax)*A.h;
    s+=`<line x1="${A.x}" y1="${y}" x2="${A.x+A.w}" y2="${y}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${A.x-12}" y="${y+7}" text-anchor="end" font-size="22" fill="${INK_MUTE}">${t.toFixed(1)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  const cw=A.w/xs;
  f.data.forEach((d,i)=>{
    const cx=A.x+i*cw+cw/2;
    const col=d.highlight?ACCENT:d.danger?INK_MUTE:SUPPORT;
    const ymean=A.y+A.h-(d.mean/ymax)*A.h;
    const ymin=A.y+A.h-(d.min/ymax)*A.h;
    const ymax_=A.y+A.h-(d.max/ymax)*A.h;
    s+=`<line x1="${cx}" y1="${ymin}" x2="${cx}" y2="${ymax_}" stroke="${col}" stroke-width="3"/>`;
    s+=`<line x1="${cx-20}" y1="${ymin}" x2="${cx+20}" y2="${ymin}" stroke="${col}" stroke-width="3"/>`;
    s+=`<line x1="${cx-20}" y1="${ymax_}" x2="${cx+20}" y2="${ymax_}" stroke="${col}" stroke-width="3"/>`;
    s+=`<circle cx="${cx}" cy="${ymean}" r="14" fill="${col}"/>`;
    s+=`<text x="${cx+22}" y="${ymean+7}" font-size="26" font-weight="600" fill="${col}" font-family="var(--ff-sans)">${d.mean.toFixed(2)}</text>`;
    s+=`<text x="${cx}" y="${A.y+A.h+36}" text-anchor="middle" font-size="26" font-weight="600" fill="${INK}" font-family="var(--ff-sans)">${d.label}</text>`;
    s+=`<text x="${cx}" y="${A.y+A.h+62}" text-anchor="middle" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)">n=${d.n}</text>`;
  });
  if(f.yAxisLabel) s+=`<text transform="rotate(-90 35 ${A.y+A.h/2})" x="35" y="${A.y+A.h/2}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.yAxisLabel}</text>`;
  s+=`</svg>`;return s;
}

/* ---- sota_bars ---- */
function sota_bars(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:80,bottom:70,left:460});
  const xmax=1.0, rowH=A.h/f.data.length, bh=rowH*0.55;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.25,0.5,0.75,1].forEach(t=>{
    const x=A.x+t*A.w;
    s+=`<line x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${x}" y="${A.y+A.h+28}" text-anchor="middle" font-size="22" fill="${INK_MUTE}">${t.toFixed(2)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.data.forEach((d,i)=>{
    const y=A.y+i*rowH+rowH/2-bh/2, w=d.f1*A.w;
    const c=d.tag==='ours'?(d.highlight?ACCENT:ACCENT_SOFT):SUPPORT2;
    s+=`<rect x="${A.x}" y="${y}" width="${w}" height="${bh}" fill="${c}"/>`;
    s+=`<text x="${A.x-16}" y="${y+bh/2+8}" text-anchor="end" font-size="22" fill="${INK}" font-family="var(--ff-sans)" font-weight="600">${d.label}</text>`;
    s+=`<text x="${A.x+w+10}" y="${y+bh/2+8}" font-size="24" fill="${INK}" font-family="var(--ff-mono)" font-weight="600">${d.f1.toFixed(2)}</text>`;
  });
  s+=`<text x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">F1</text>`;
  s+=`</svg>`;return s;
}

/* ---- pg_degeneration ---- */
function pg_degeneration(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:60,bottom:100,left:340});
  const xmax=1.0, rowH=A.h/f.data.length, bh=rowH*0.6;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.25,0.5,0.75,1].forEach(t=>{
    const x=A.x+t*A.w;
    s+=`<line x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${x}" y="${A.y+A.h+28}" text-anchor="middle" font-size="22" fill="${INK_MUTE}">${t.toFixed(2)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.data.forEach((d,i)=>{
    const y=A.y+i*rowH+rowH/2-bh/2;
    s+=`<rect x="${A.x}" y="${y}" width="${d.ex*A.w}" height="${bh*0.45}" fill="${ACCENT}" opacity=".85"/>`;
    s+=`<rect x="${A.x}" y="${y+bh*0.5}" width="${Math.max(d.pg*A.w,3)}" height="${bh*0.45}" fill="${INK_MUTE}"/>`;
    s+=`<text x="${A.x-16}" y="${y+bh/2+8}" text-anchor="end" font-size="20" fill="${INK}" font-family="var(--ff-mono)">${d.label}</text>`;
  });
  s+=`<g font-family="var(--ff-sans)" font-size="24" font-weight="600">
    <rect x="${A.x+A.w/2-180}" y="${A.y+A.h+60}" width="22" height="14" fill="${ACCENT}"/>
    <text x="${A.x+A.w/2-150}" y="${A.y+A.h+72}" fill="${INK}">GNNExplainer</text>
    <rect x="${A.x+A.w/2+50}" y="${A.y+A.h+60}" width="22" height="14" fill="${INK_MUTE}"/>
    <text x="${A.x+A.w/2+80}" y="${A.y+A.h+72}" fill="${INK}">PGExplainer (≡ 0)</text>
  </g>`;
  s+=`</svg>`;return s;
}

/* ---- ranked_bars ---- */
function ranked_bars(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:60,bottom:60,left:440});
  const rowH=A.h/f.data.length, bh=rowH*0.7;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.25,0.5,0.75,1].forEach(t=>{
    const x=A.x+t*A.w;
    s+=`<line x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${x}" y="${A.y+A.h+28}" text-anchor="middle" font-size="22" fill="${INK_MUTE}">${t.toFixed(2)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.data.forEach((d,i)=>{
    const y=A.y+i*rowH+rowH/2-bh/2;
    const c=d.hl?ACCENT:SUPPORT2;
    s+=`<rect x="${A.x}" y="${y}" width="${d.v*A.w}" height="${bh}" fill="${c}"/>`;
    const lab=`${d.rank}. ${d.a} · ${d.s} · ${d.b}`;
    s+=`<text x="${A.x-16}" y="${y+bh/2+8}" text-anchor="end" font-size="22" fill="${INK}" font-family="var(--ff-sans)" font-weight="600">${lab}</text>`;
    s+=`<text x="${A.x+d.v*A.w+10}" y="${y+bh/2+8}" font-size="24" fill="${INK}" font-family="var(--ff-mono)" font-weight="600">${d.v.toFixed(3)}</text>`;
  });
  s+=`</svg>`;return s;
}

/* ---- recommendation_matrix ---- */
function recommendation_matrix(f){
  const W=1100,H=560,A=axisBox(W,H,{top:50,right:30,bottom:40,left:500});
  const cw=A.w/f.cols.length, rh=A.h/f.rows.length;
  const colorFor=(sc)=>{
    if(sc===3) return ACCENT;
    if(sc===2) return ACCENT_SOFT;
    if(sc===1) return BG_ALT;
    return '#F7F2E7';
  };
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  f.cols.forEach((c,j)=>s+=`<text x="${A.x+j*cw+cw/2}" y="${A.y-14}" text-anchor="middle" font-size="26" font-weight="700" fill="${INK}" font-family="var(--ff-serif)">${c}</text>`);
  f.rows.forEach((r,i)=>{
    s+=`<text x="${A.x-16}" y="${A.y+i*rh+rh/2+8}" text-anchor="end" font-size="22" fill="${INK}" font-family="var(--ff-sans)" font-weight="500">${r.name}</text>`;
    f.cols.forEach((c,j)=>{
      const sc=r.scores[c];
      s+=`<rect x="${A.x+j*cw+4}" y="${A.y+i*rh+4}" width="${cw-8}" height="${rh-8}" fill="${colorFor(sc)}" stroke="${RULE}" stroke-width="1"/>`;
      s+=`<text x="${A.x+j*cw+cw/2}" y="${A.y+i*rh+rh/2+10}" text-anchor="middle" font-size="28" font-weight="700" fill="${sc>=2?'#fff':INK_MUTE}" font-family="var(--ff-mono)">${sc}</text>`;
    });
  });
  s+=`</svg>`;return s;
}

/* ---- stacked_hours ---- */
function stacked_hours(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:100,bottom:70,left:360});
  const maxH=Math.max(...f.data.map(d=>d.train+d.explain));
  const rowH=A.h/f.data.length, bh=rowH*0.5;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,5,10,15,20,25,30].filter(t=>t<=maxH+2).forEach(t=>{
    const x=A.x+(t/maxH)*A.w;
    s+=`<line x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${x}" y="${A.y+A.h+28}" text-anchor="middle" font-size="22" fill="${INK_MUTE}">${t}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.data.forEach((d,i)=>{
    const y=A.y+i*rowH+rowH/2-bh/2;
    const wT=(d.train/maxH)*A.w, wE=(d.explain/maxH)*A.w;
    s+=`<rect x="${A.x}" y="${y}" width="${wT}" height="${bh}" fill="${SUPPORT}"/>`;
    s+=`<rect x="${A.x+wT}" y="${y}" width="${wE}" height="${bh}" fill="${ACCENT}"/>`;
    s+=`<text x="${A.x-16}" y="${y+bh/2+8}" text-anchor="end" font-size="24" fill="${INK}" font-family="var(--ff-sans)" font-weight="600">${d.machine}</text>`;
    s+=`<text x="${A.x+wT+wE+10}" y="${y+bh/2+8}" font-size="24" fill="${INK}" font-family="var(--ff-mono)" font-weight="600">${(d.train+d.explain).toFixed(1)} h</text>`;
    // inline segment labels
    if(wT>80) s+=`<text x="${A.x+wT/2}" y="${y+bh/2+8}" text-anchor="middle" font-size="22" fill="#fff" font-weight="600">train ${d.train.toFixed(1)}</text>`;
    if(wE>80) s+=`<text x="${A.x+wT+wE/2}" y="${y+bh/2+8}" text-anchor="middle" font-size="22" fill="#fff" font-weight="600">XAI ${d.explain.toFixed(1)}</text>`;
  });
  s+=`<text x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">horas-GPU</text>`;
  s+=`</svg>`;return s;
}

/* ---- effect_sizes ---- */
function effect_sizes(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:60,bottom:70,left:280});
  const rowH=A.h/f.data.length, bh=rowH*0.55;
  const dmax=1.2;
  const mid=A.x+A.w/2;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [-1,-0.5,0,0.5,1].forEach(t=>{
    const x=mid+(t/dmax)*(A.w/2);
    s+=`<line x1="${x}" y1="${A.y}" x2="${x}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${x}" y="${A.y+A.h+28}" text-anchor="middle" font-size="22" fill="${INK_MUTE}">${t.toFixed(1)}</text>`;
  });
  s+=`<line x1="${mid}" y1="${A.y}" x2="${mid}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  f.data.forEach((d,i)=>{
    const y=A.y+i*rowH+rowH/2-bh/2;
    s+=`<text x="${A.x-16}" y="${y+bh/2+8}" text-anchor="end" font-size="22" fill="${INK}" font-family="var(--ff-sans)" font-weight="600">${d.label}</text>`;
    if(d.d==null){
      s+=`<text x="${mid+10}" y="${y+bh/2+8}" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)" font-style="italic">n/a (muestra insuficiente)</text>`;
    } else {
      const c=d.highlight?ACCENT:SUPPORT2;
      const w=(Math.abs(d.d)/dmax)*(A.w/2);
      const x0=d.d<0?mid-w:mid;
      s+=`<rect x="${x0}" y="${y}" width="${w}" height="${bh}" fill="${c}"/>`;
      s+=`<text x="${d.d<0?x0-8:x0+w+8}" y="${y+bh/2+8}" text-anchor="${d.d<0?'end':'start'}" font-size="22" fill="${INK}" font-family="var(--ff-mono)" font-weight="600">d=${d.d.toFixed(2)} · ${d.mag}</text>`;
    }
  });
  s+=`<text x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">d de Cohen</text>`;
  s+=`</svg>`;return s;
}

/* ---- jaccard_histogram ---- */
function jaccard_histogram(f){
  const W=1100,H=560,A=axisBox(W,H,{top:40,right:80,bottom:70,left:100});
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,4,8,12,16].forEach(t=>{
    const y=A.y+A.h-(t/17)*A.h;
    s+=`<line x1="${A.x}" y1="${y}" x2="${A.x+A.w}" y2="${y}" stroke="${RULE}" stroke-width="1"/>`;
    s+=`<text x="${A.x-12}" y="${y+7}" text-anchor="end" font-size="22" fill="${INK_MUTE}">${t}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  // one very tall bar at Jaccard=1.0
  const bx=A.x+A.w*0.85, bw=80, by=A.y;
  s+=`<rect x="${bx}" y="${by}" width="${bw}" height="${A.h}" fill="${ACCENT}"/>`;
  s+=`<text x="${bx+bw/2}" y="${by-14}" text-anchor="middle" font-size="28" font-weight="700" fill="${ACCENT}" font-family="var(--ff-sans)">17 / 17</text>`;
  // x ticks
  [0,0.25,0.5,0.75,1].forEach(t=>{
    const x=A.x+t*A.w;
    s+=`<text x="${x}" y="${A.y+A.h+28}" text-anchor="middle" font-size="22" fill="${INK_MUTE}">${t.toFixed(2)}</text>`;
  });
  s+=`<text x="${A.x+A.w/2}" y="${H-14}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">Jaccard medio</text>`;
  s+=`<text transform="rotate(-90 30 ${A.y+A.h/2})" x="30" y="${A.y+A.h/2}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">Configuraciones</text>`;
  s+=`</svg>`;return s;
}

/* ---- scatter_filter (R5) — F1 vs MCC with threshold region ---- */
function scatter_filter(f){
  const W=1100,H=620,A=axisBox(W,H,{top:40,right:60,bottom:90,left:120});
  const xmin=-0.05, xmax=0.6, ymin=-0.05, ymax=0.6;
  const X=v=>A.x+((v-xmin)/(xmax-xmin))*A.w;
  const Y=v=>A.y+A.h-((v-ymin)/(ymax-ymin))*A.h;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // grid + axis labels
  [0,0.1,0.2,0.3,0.4,0.5,0.6].forEach(t=>{
    s+=`<line x1="${X(t)}" y1="${A.y}" x2="${X(t)}" y2="${A.y+A.h}" stroke="${RULE}" stroke-width="1" stroke-dasharray="3 4"/>`;
    s+=`<line x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}" stroke="${RULE}" stroke-width="1" stroke-dasharray="3 4"/>`;
    s+=`<text x="${X(t)}" y="${A.y+A.h+30}" text-anchor="middle" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)">${t.toFixed(1)}</text>`;
    s+=`<text x="${A.x-14}" y="${Y(t)+8}" text-anchor="end" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)">${t.toFixed(1)}</text>`;
  });

  // region shading
  s+=`<rect x="${X(f.thresholdX)}" y="${A.y}" width="${A.x+A.w-X(f.thresholdX)}" height="${Y(f.thresholdY)-A.y}" fill="${HL}" opacity="0.55"/>`;
  // thresholds
  s+=`<line x1="${X(f.thresholdX)}" y1="${A.y}" x2="${X(f.thresholdX)}" y2="${A.y+A.h}" stroke="${ACCENT}" stroke-width="2" stroke-dasharray="6 5"/>`;
  s+=`<line x1="${A.x}" y1="${Y(f.thresholdY)}" x2="${A.x+A.w}" y2="${Y(f.thresholdY)}" stroke="${ACCENT}" stroke-width="2" stroke-dasharray="6 5"/>`;
  s+=`<text x="${X(f.thresholdX)+10}" y="${A.y+24}" font-size="20" fill="${ACCENT}" font-family="var(--ff-sans)" font-weight="600" letter-spacing="0.08em">F1 ≥ ${f.thresholdX}</text>`;
  s+=`<text x="${A.x+A.w-10}" y="${Y(f.thresholdY)-10}" text-anchor="end" font-size="20" fill="${ACCENT}" font-family="var(--ff-sans)" font-weight="600" letter-spacing="0.08em">MCC ≥ ${f.thresholdY}</text>`;

  // axes
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;

  // points
  const pts = f.data || [];
  pts.forEach(p=>{
    const color = p.passed ? (p.native?ACCENT:ACCENT) : INK_MUTE;
    const r = p.passed ? 9 : 6;
    const op = p.passed ? 0.9 : 0.45;
    const stroke = p.native && p.passed ? INK : (p.passed?'#fff':'none');
    const sw = p.native && p.passed ? 2 : (p.passed?1.5:0);
    s+=`<circle cx="${X(p.f1)}" cy="${Y(p.mcc)}" r="${r}" fill="${color}" opacity="${op}" stroke="${stroke}" stroke-width="${sw}"/>`;
  });

  // axis titles
  s+=`<text x="${A.x+A.w/2}" y="${H-18}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.xAxisLabel||''}</text>`;
  s+=`<text transform="rotate(-90 34 ${A.y+A.h/2})" x="34" y="${A.y+A.h/2}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.yAxisLabel||''}</text>`;

  // legend
  const passed = pts.filter(p=>p.passed).length;
  const failed = pts.length - passed;
  const nativeCount = pts.filter(p=>p.native).length;
  const lgx=A.x+A.w-300, lgy=A.y+50;
  s+=`<rect x="${lgx-14}" y="${lgy-30}" width="290" height="${nativeCount?110:78}" fill="${BG_ALT}" stroke="${RULE}" stroke-width="1.5"/>`;
  s+=`<circle cx="${lgx+4}" cy="${lgy}" r="9" fill="${ACCENT}"/>`;
  s+=`<text x="${lgx+24}" y="${lgy+7}" font-size="20" fill="${INK}" font-family="var(--ff-sans)">Aprobadas (${passed})</text>`;
  s+=`<circle cx="${lgx+4}" cy="${lgy+30}" r="7" fill="${INK_MUTE}"/>`;
  s+=`<text x="${lgx+24}" y="${lgy+37}" font-size="20" fill="${INK}" font-family="var(--ff-sans)">Rechazadas (${failed})</text>`;
  if(nativeCount){
    s+=`<circle cx="${lgx+4}" cy="${lgy+60}" r="9" fill="${ACCENT}" stroke="${INK}" stroke-width="2"/>`;
    s+=`<text x="${lgx+24}" y="${lgy+67}" font-size="20" fill="${INK}" font-family="var(--ff-sans)">Nativo 1:30 (${nativeCount})</text>`;
  }

  s+=`</svg>`;return s;
}

/* ---- ranked_table (R6) — summary table with bars per row ---- */
function ranked_table(f){
  const W=1280, H=920;
  const rows = f.rows;
  const colX = {s:50, a:220, b:340, f1:480, mcc:670, sp:860};
  const rowH = Math.min(32, (H-100)/rows.length);
  const headerY = 50;
  const startY = headerY+26;
  const barW = 150;

  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // headers
  const hdrs = [
    {x:colX.s,  t:"ESCENARIO"},
    {x:colX.a,  t:"ARQUIT."},
    {x:colX.b,  t:"BALANCEO"},
    {x:colX.f1, t:"F1 VAL"},
    {x:colX.mcc,t:"MCC"},
    {x:colX.sp, t:"SPEARMAN (GNNExp.)"}
  ];
  hdrs.forEach(h=>{
    s+=`<text x="${h.x}" y="${headerY}" font-size="18" letter-spacing="0.14em" fill="${ACCENT}" font-family="var(--ff-sans)" font-weight="600">${h.t}</text>`;
  });
  s+=`<line x1="30" y1="${headerY+12}" x2="${W-30}" y2="${headerY+12}" stroke="${INK}" stroke-width="2"/>`;

  rows.forEach((r,i)=>{
    const y = startY + i*rowH;
    if(r.hl) s+=`<rect x="30" y="${y-20}" width="${W-60}" height="${rowH}" fill="${HL}"/>`;
    if(r.danger) s+=`<rect x="30" y="${y-20}" width="${W-60}" height="${rowH}" fill="${BG_ALT}"/>`;
    if(r.native) s+=`<rect x="30" y="${y-20}" width="6" height="${rowH}" fill="${ACCENT}"/>`;
    s+=`<text x="${colX.s}" y="${y+6}" font-family="var(--ff-mono)" font-size="18" fill="${INK}">${r.s}</text>`;
    s+=`<text x="${colX.a}" y="${y+6}" font-family="var(--ff-sans)" font-size="20" fill="${INK}" font-weight="600">${r.a}</text>`;
    const balLbl = r.b==="focal_loss"?"focal loss":r.b==="class_weighting"?"class weight.":"sin balanceo";
    s+=`<text x="${colX.b}" y="${y+6}" font-family="var(--ff-sans)" font-size="18" fill="${INK_SOFT}">${balLbl}</text>`;

    // f1 bar
    const f1w = (r.f1/0.55)*barW;
    s+=`<rect x="${colX.f1}" y="${y-12}" width="${f1w}" height="22" fill="${SUPPORT2}" opacity="0.55"/>`;
    s+=`<text x="${colX.f1+f1w+8}" y="${y+6}" font-family="var(--ff-mono)" font-size="18" fill="${INK}">${r.f1.toFixed(3)}</text>`;

    // mcc bar
    const mw = (r.mcc/0.55)*barW;
    s+=`<rect x="${colX.mcc}" y="${y-12}" width="${mw}" height="22" fill="${SUPPORT}" opacity="0.55"/>`;
    s+=`<text x="${colX.mcc+mw+8}" y="${y+6}" font-family="var(--ff-mono)" font-size="18" fill="${INK}">${r.mcc.toFixed(3)}</text>`;

    // spearman bar
    const spColor = r.sp>0.6?ACCENT:r.sp>0.4?ACCENT_SOFT:INK_MUTE;
    const spw = (r.sp/0.85)*(barW+120);
    s+=`<rect x="${colX.sp}" y="${y-12}" width="${spw}" height="22" fill="${spColor}" opacity="0.8"/>`;
    s+=`<text x="${colX.sp+spw+8}" y="${y+6}" font-family="var(--ff-mono)" font-size="18" fill="${INK}" font-weight="600">${r.sp.toFixed(3)}</text>`;

    if(i<rows.length-1) s+=`<line x1="30" y1="${y+rowH-20}" x2="${W-30}" y2="${y+rowH-20}" stroke="${RULE}" stroke-width="0.8" opacity="0.6"/>`;
  });

  s+=`</svg>`;return s;
}

/* ---- boxplot (A7) — quartiles with points + Kruskal-Wallis panel ---- */
function boxplot(f){
  const W=1100,H=620,A=axisBox(W,H,{top:50,right:280,bottom:100,left:120});
  const ymin=0, ymax=0.9;
  const Y=v=>A.y+A.h-((v-ymin)/(ymax-ymin))*A.h;
  const colW=A.w/f.data.length;

  function quartiles(vals){
    const v=[...vals].sort((a,b)=>a-b);
    if(v.length===1) return {q1:v[0], q2:v[0], q3:v[0], min:v[0], max:v[0]};
    const q2 = v.length%2 ? v[(v.length-1)/2] : (v[v.length/2-1]+v[v.length/2])/2;
    const lower = v.slice(0, Math.floor(v.length/2));
    const upper = v.slice(Math.ceil(v.length/2));
    const med = arr => arr.length%2 ? arr[(arr.length-1)/2] : (arr[arr.length/2-1]+arr[arr.length/2])/2;
    return {q1:med(lower), q2, q3:med(upper), min:v[0], max:v[v.length-1]};
  }

  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}" stroke="${RULE}" stroke-width="1" stroke-dasharray="3 4"/>`;
    s+=`<text x="${A.x-14}" y="${Y(t)+8}" text-anchor="end" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)">${t.toFixed(1)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;

  f.data.forEach((d,i)=>{
    const cx = A.x + i*colW + colW/2;
    const bw = 90;
    const q = quartiles(d.values);
    // whiskers
    s+=`<line x1="${cx}" y1="${Y(q.min)}" x2="${cx}" y2="${Y(q.max)}" stroke="${INK}" stroke-width="2"/>`;
    s+=`<line x1="${cx-28}" y1="${Y(q.min)}" x2="${cx+28}" y2="${Y(q.min)}" stroke="${INK}" stroke-width="2"/>`;
    s+=`<line x1="${cx-28}" y1="${Y(q.max)}" x2="${cx+28}" y2="${Y(q.max)}" stroke="${INK}" stroke-width="2"/>`;
    if(d.values.length>1){
      const y1=Math.min(Y(q.q1),Y(q.q3)), h=Math.abs(Y(q.q3)-Y(q.q1));
      s+=`<rect x="${cx-bw/2}" y="${y1}" width="${bw}" height="${h}" fill="${ACCENT_SOFT}" opacity="0.45" stroke="${ACCENT}" stroke-width="2"/>`;
      s+=`<line x1="${cx-bw/2}" y1="${Y(q.q2)}" x2="${cx+bw/2}" y2="${Y(q.q2)}" stroke="${ACCENT}" stroke-width="4"/>`;
    }
    d.values.forEach((v,k)=>{
      const jitter=((k*23)%100)/100 - 0.5;
      s+=`<circle cx="${cx+jitter*50}" cy="${Y(v)}" r="6" fill="${INK}" opacity="0.55"/>`;
    });
    s+=`<text x="${cx}" y="${A.y+A.h+34}" text-anchor="middle" font-size="24" fill="${INK}" font-family="var(--ff-sans)" font-weight="600">${d.label}</text>`;
    s+=`<text x="${cx}" y="${A.y+A.h+58}" text-anchor="middle" font-size="18" fill="${INK_MUTE}" font-family="var(--ff-sans)">n=${d.values.length}</text>`;
  });

  // stats panel (Kruskal-Wallis)
  if(f.stats){
    const px=A.x+A.w+30, py=A.y+60;
    s+=`<rect x="${px-16}" y="${py-36}" width="250" height="180" fill="${BG_ALT}" stroke="${RULE}" stroke-width="1.5"/>`;
    s+=`<text x="${px}" y="${py-10}" font-family="var(--ff-sans)" font-size="16" letter-spacing="0.18em" fill="${ACCENT}" font-weight="600">KRUSKAL–WALLIS</text>`;
    s+=`<text x="${px}" y="${py+30}" font-family="var(--ff-serif)" font-size="38" font-weight="600" fill="${INK}">H = ${f.stats.H.toFixed(2)}</text>`;
    s+=`<text x="${px}" y="${py+70}" font-family="var(--ff-serif)" font-size="38" font-weight="600" fill="${INK}">p = ${f.stats.p.toFixed(3)}</text>`;
    s+=`<text x="${px}" y="${py+105}" font-family="var(--ff-sans)" font-size="18" fill="${INK_SOFT}">No significativo (α=0.05)</text>`;
  }

  s+=`<text transform="rotate(-90 34 ${A.y+A.h/2})" x="34" y="${A.y+A.h/2}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.yAxisLabel||''}</text>`;
  s+=`</svg>`;return s;
}

/* ---- native_vs_forced (A11) — errorbars with native visually distinguished ---- */
function native_vs_forced(f){
  const W=1100,H=620,A=axisBox(W,H,{top:40,right:60,bottom:110,left:120});
  const ymin=0, ymax=0.85;
  const Y=v=>A.y+A.h-((v-ymin)/(ymax-ymin))*A.h;
  const colW=A.w/f.data.length;

  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // grid
  [0,0.2,0.4,0.6,0.8].forEach(t=>{
    s+=`<line x1="${A.x}" y1="${Y(t)}" x2="${A.x+A.w}" y2="${Y(t)}" stroke="${RULE}" stroke-width="1" stroke-dasharray="3 4"/>`;
    s+=`<text x="${A.x-14}" y="${Y(t)+8}" text-anchor="end" font-size="22" fill="${INK_MUTE}" font-family="var(--ff-sans)">${t.toFixed(1)}</text>`;
  });
  s+=`<line x1="${A.x}" y1="${A.y+A.h}" x2="${A.x+A.w}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;
  s+=`<line x1="${A.x}" y1="${A.y}" x2="${A.x}" y2="${A.y+A.h}" stroke="${INK}" stroke-width="2"/>`;

  f.data.forEach((d,i)=>{
    const cx = A.x + i*colW + colW/2;
    const bw = Math.min(120, colW*0.58);
    const top = Y(d.mean);
    const bottom = A.y+A.h;
    // color: native -> ACCENT; highlight -> ACCENT_SOFT on top of SUPPORT; otherwise SUPPORT
    let fill = SUPPORT;
    if(d.native) fill = ACCENT;
    else if(d.highlight) fill = ACCENT_SOFT;
    else if(d.danger) fill = INK_MUTE;
    // bar
    s+=`<rect x="${cx-bw/2}" y="${top}" width="${bw}" height="${bottom-top}" fill="${fill}" opacity="${d.native?0.9:0.75}"${d.native?' stroke="'+INK+'" stroke-width="3"':''}/>`;
    // native hatch pattern overlay — diagonal stripes for visual distinction
    if(d.native){
      for(let yp=top+8; yp<bottom; yp+=16){
        s+=`<line x1="${cx-bw/2}" y1="${yp}" x2="${cx-bw/2+Math.min(bw,bottom-yp)}" y2="${yp+Math.min(bw,bottom-yp)}" stroke="${INK}" stroke-width="1.2" opacity="0.25"/>`;
      }
    }
    // error bar (std)
    const errTop = Y(d.mean + d.std);
    const errBot = Y(Math.max(0, d.mean - d.std));
    s+=`<line x1="${cx}" y1="${errTop}" x2="${cx}" y2="${errBot}" stroke="${INK}" stroke-width="2.5"/>`;
    s+=`<line x1="${cx-24}" y1="${errTop}" x2="${cx+24}" y2="${errTop}" stroke="${INK}" stroke-width="2.5"/>`;
    s+=`<line x1="${cx-24}" y1="${errBot}" x2="${cx+24}" y2="${errBot}" stroke="${INK}" stroke-width="2.5"/>`;
    // mean value label above bar
    s+=`<text x="${cx}" y="${top-14}" text-anchor="middle" font-size="22" fill="${INK}" font-family="var(--ff-mono)" font-weight="600">${d.mean.toFixed(3)}</text>`;
    // x label
    const labelColor = d.native ? ACCENT : INK;
    const labelWeight = d.native ? 700 : 600;
    s+=`<text x="${cx}" y="${A.y+A.h+36}" text-anchor="middle" font-size="22" fill="${labelColor}" font-family="var(--ff-sans)" font-weight="${labelWeight}">${d.label}</text>`;
    s+=`<text x="${cx}" y="${A.y+A.h+60}" text-anchor="middle" font-size="18" fill="${INK_MUTE}" font-family="var(--ff-sans)">n=${d.n}</text>`;
  });

  // axis labels
  s+=`<text x="${A.x+A.w/2}" y="${H-20}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.xAxisLabel||''}</text>`;
  s+=`<text transform="rotate(-90 34 ${A.y+A.h/2})" x="34" y="${A.y+A.h/2}" text-anchor="middle" font-size="24" fill="${INK_SOFT}" font-family="var(--ff-sans)">${f.yAxisLabel||''}</text>`;

  // legend
  const lgx=A.x+A.w-330, lgy=A.y+30;
  s+=`<rect x="${lgx-14}" y="${lgy-24}" width="320" height="80" fill="${BG_ALT}" stroke="${RULE}" stroke-width="1.5"/>`;
  s+=`<rect x="${lgx+2}" y="${lgy-6}" width="28" height="14" fill="${SUPPORT}" opacity="0.75"/>`;
  s+=`<text x="${lgx+38}" y="${lgy+6}" font-size="20" fill="${INK}" font-family="var(--ff-sans)">Escenarios forzados</text>`;
  s+=`<rect x="${lgx+2}" y="${lgy+22}" width="28" height="14" fill="${ACCENT}" opacity="0.9" stroke="${INK}" stroke-width="2"/>`;
  s+=`<text x="${lgx+38}" y="${lgy+34}" font-size="20" fill="${ACCENT}" font-family="var(--ff-sans)" font-weight="700">Escenario nativo (paradoja)</text>`;

  s+=`</svg>`;return s;
}

/* ---- generic fallback ---- */
function fallback(id){return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="500" fill="#F7F2E7"/><text x="400" y="250" text-anchor="middle" font-size="28" fill="#8B867B">Figura ${id}</text></svg>`;}

const RENDERERS = {
  bars_h, bars_h_n, heatmap, peak_collapse, quadrants, quadrants_labeled,
  strip_by_explainer, errorbars, sota_bars, pg_degeneration, ranked_bars,
  recommendation_matrix, stacked_hours, effect_sizes, jaccard_histogram,
  scatter_filter, ranked_table, boxplot, native_vs_forced
};

window.renderFig = function(id){
  const f = (window.THESIS_FIGS||[]).find(x=>x.id===id);
  if(!f) return fallback(id);
  const r = RENDERERS[f.chart];
  return r ? r(f) : fallback(id);
};

window.getFig = function(id){
  return (window.THESIS_FIGS||[]).find(x=>x.id===id);
};

})();
