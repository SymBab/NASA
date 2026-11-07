'use strict';
function meter(k){
  const d=dayEnd().t[k];
  const v=G[k];
  const isR=k==='research';
  const pct=isR?clamp(v/G.target*100,0,100):v;
  const crit=!isR&&v<25;
  let tr='';
  if(!isR){
    const after=v+d;
    tr=`ปลายวัน <b>${d===0?'±0':sign(d)}</b>`+(after<=0?` <span class="warn">· ${k==='power'?'ไฟจะหมด!':k==='food'?'อาหารจะหมด!':'สุขภาพวิกฤต!'}</span>`:'');
  }else tr=`เป้า <b>${G.target}</b> แต้ม`;
  return `<div class="meter m-${k}"><div class="row"><span class="lab">${ic(RI[k])}${RL[k]}${crit?' <span class="pill crit" style="padding:0 8px;font-size:.78rem">วิกฤต</span>':''}</span>
   <span class="val"><span class="n">${v}</span>${isR?'':'<small>/100</small>'}</span></div>
   <div class="bar" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="${isR?G.target:100}" aria-label="${RL[k]}"><i style="width:${pct}%"></i></div>
   <div class="trend">${tr}</div></div>`;
}
