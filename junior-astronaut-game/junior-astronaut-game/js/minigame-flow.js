'use strict';
function beginMini(def,ctx){
  G.mini={def,ctx,title:def.title};G.screen='mini';
}
function finishMini(score,skipped){
  miniClear();
  const m=G.mini;if(!m)return;
  G.mini=null;
  const note=skipped?'ข้ามมินิเกม ผลปกติ':'มินิเกม: '+SCORE_TXT[score];
  if(m.ctx.t==='act'){
    const id=m.ctx.id;
    doAction(id,score,note);
    if(G.screen==='result')return;
    const L=ACT_SAY[id];const l=L[Math.floor(rnd()*L.length)];addFeed(l[0],l[1]);
    if(!skipped){if(score===2)addFeed('mintra','ฝีมือยอดเยี่ยมมาก!');else if(score===0)addFeed('mintra','ไม่เป็นไร ครั้งหน้าเอาใหม่นะ');}
    G.screen='play';
  }else{
    chooseOption(m.ctx.i,score,note,skipped);
  }
}
function pickOption(i){
  const def=MINI_EV[G.ev.id];
  if(!def){chooseOption(i);return;}
  beginMini(def,{t:'ev',i});
}
