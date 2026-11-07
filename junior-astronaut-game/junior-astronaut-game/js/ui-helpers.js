'use strict';
/* ---------- render ---------- */
const $=s=>document.querySelector(s);
const sign=v=>(v>0?'+':'−')+Math.abs(v);
function chip(k,v){return `<span class="chip c-${k}"><svg class="ic" aria-hidden="true"><use href="#i-${RI[k]}"/></svg>${RL[k]} ${sign(v)}</span>`;}
function chips(fx,extra,risk){
  let h=RES.filter(k=>fx[k]).map(k=>chip(k,fx[k])).join('');
  (extra||[]).forEach(t=>h+=`<span class="chip extra">${t}</span>`);
  if(risk)h+=`<span class="chip risk"><svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg>เสี่ยง ${Math.round(risk.p*100)}%: ${risk.text} (${plain(risk.fx)})</span>`;
  return h;
}
function ic(n){return `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;}
function av(c){return `<span class="av" style="--c:${CREW[c].color}" aria-hidden="true">${CREW[c].init}</span>`;}
function bubble(c,text,t,big){return `<div class="bubble${big?' big':''}">${av(c)}<div class="tx"><div class="who">${CREW[c].name} · ${CREW[c].role}${t!=null?' · '+fmt(t):''}</div>${text}</div></div>`;}
