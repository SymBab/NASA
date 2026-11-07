'use strict';
function head(){
  const night=G.phase==='night';
  const crit=Math.min(G.power,G.food,G.health)<25;
  return `<div class="top"><span class="brand">JUNIOR ASTRONAUT MISSION TRAINER · PROTOTYPE</span>
   <div class="pills"><span class="pill">วันที่ ${G.day} / ${G.days}</span>
   <span class="pill">${ic(night?'moon':'sun')}${night?'กลางคืน':'กลางวัน'}</span>
   <span class="pill">${ic('flask')}${G.plan.name}</span>${G.shield?`<span class="pill">${ic('shield')}เกราะเปิดอยู่</span>`:''}${crit?'<span class="pill crit">สถานะวิกฤต</span>':''}</div></div>
   ${night?`<div class="banner">คืนจันทร์ (ย่อเวลา): แผงโซลาร์ได้ไฟน้อยลง และฐานใช้ไฟเพิ่ม 3 ต่อวันเพื่อทำความร้อน คืนจริงบนดวงจันทร์ยาวราว 14 วันตามเวลาโลก</div>`:''}
   ${sceneHtml()}
   ${clockHtml(G.screen==='play')}
   <div class="meters">${RES.map(meter).join('')}</div>`;
}
function popDots(){
  return '<span class="dots" aria-hidden="true">'+Array.from({length:G.popTotal},(_,i)=>`<i class="${i<G.popShown?'':'on'}"></i>`).join('')+'</span>';
}
function renderPlay(){
  const left=Math.max(0,G.popTotal-G.popShown);
  return `${head()}
  ${crewHtml()}
  <section class="panel" style="display:grid;gap:10px"><h2>วิทยุของฐาน</h2><div class="feed" id="feed" aria-live="polite">${feedHtml()}</div></section>
  <section class="panel" style="display:grid;gap:10px">
    <div class="row-end"><h2>ช่วงทำกิจกรรมของวันนี้</h2><span class="slots">ช่วงที่เหลือ ${popDots()}<b>${left}/${G.popTotal}</b></span></div>
    <div class="msg" aria-live="polite">${G.msg||'&nbsp;'}</div>
    <p class="note">ช่วงทำกิจกรรมจะเด้งขึ้นมาเองในเวลาสุ่ม เวลาจะหยุดให้คุณคิดก่อนเลือก ข้ามช่วงที่ไม่ต้องการได้ แต่จะเสียโอกาสนั้นไป</p>
    <div class="row-end"><span class="note">${left>0?'ยังมีช่วงกิจกรรมรออยู่ ข้ามไปปลายวันได้ แต่จะเสียโอกาสไป':'ช่วงกิจกรรมของวันนี้หมดแล้ว รอเวลาเดินจนถึง 22:00 หรือกดข้ามไปปลายวัน'}</span><button class="btn ghost" data-act="endday">ข้ามไปปลายวัน</button></div>
  </section>${renderLog()}${renderSources()}`;
}
function renderActivity(){
  const acts=actions().map((a,i)=>`<button class="act" style="--i:${i}" data-act="pop" data-v="${a.id}" ${a.disabled?'disabled':''}>
    <span class="nm">${ic(a.icon)}${a.name}</span><span class="ds">${a.desc}</span><span class="chips">${chips(a.fx)}</span>${a.note?`<span class="nt">${a.note}</span>`:''}</button>`).join('');
  const say=G.popSay||POP_SAY[0];
  return `${head()}
  <section class="panel popup" style="display:grid;gap:10px">
    <div class="alarm pop">ช่วงทำกิจกรรม ${G.popShown} / ${G.popTotal} ของวันนี้</div>
    ${bubble(say[0],say[1],G.clock,true)}
    <p class="note">เวลาหยุดอยู่ เลือกได้ 1 อย่าง ราคาบนปุ่มคือราคามาตรฐาน บางกิจกรรมมีมินิเกมที่ทำให้ผลดีขึ้นหรือแย่ลงได้ หรือข้ามช่วงนี้ก็ได้</p>
    <div class="acts">${acts}</div>
    <div class="row-end"><span></span><button class="btn ghost" data-act="skip">ข้ามช่วงนี้ (ไม่ทำอะไร)</button></div>
  </section>${renderLog()}`;
}

function renderMini(){
  const m=G.mini;
  const who=m.ctx.t==='ev'?'ลดความเสียหายของตัวเลือก "'+G.ev.opts[m.ctx.i].label+'"':'เพิ่มผลของ "'+actions().find(a=>a.id===m.ctx.id).name+'"';
  return `${head()}
  <section class="panel mini" style="display:grid;gap:10px">
    <div class="tt">มินิเกม: ${m.title}</div>
    <p class="note">เวลาหยุดอยู่ เล่นให้ดีเพื่อ${who} เล่นพลาดจะได้ผลแย่ลง ข้ามได้ (ผลปกติ)</p>
    <p>${m.def.how}</p>
    <div class="mgcount" id="mgcount"></div>
    <div class="mgarea" id="mgarea"></div>
    <div class="mgfb" id="mgfb" aria-live="polite"></div>
    <div class="row-end"><span class="note">${m.def.hint||''}</span><button class="btn ghost" data-act="miniskip">ข้ามมินิเกม</button></div>
  </section>${renderLog()}`;
}
