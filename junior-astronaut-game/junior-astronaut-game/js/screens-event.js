'use strict';
function renderEvent(){
  const e=G.ev;
  const opts=e.opts.map((o,i)=>{const v=optView(o);return `<button class="opt" style="--i:${i}" data-act="opt" data-v="${i}"><span class="n">${i+1}</span><span class="lb">${o.label}</span><span class="chips">${chips(v.fx,o.extra,v.risk)}</span></button>`;}).join('');
  return `${head()}
  <section class="panel event" style="display:grid;gap:4px">
    <div class="alarm">!! เกิดปัญหาฉุกเฉินขึ้น !!</div>
    ${EV_SAY[e.id]?bubble(EV_SAY[e.id][0],EV_SAY[e.id][1],G.clock,true):''}
    <div class="row-end" style="justify-content:flex-start"><h2>${ic(e.icon)} ${e.title}</h2>${G.evSev>1?'<span class="tag">รุนแรงมาก</span>':''}${e.tag==='donki'?'<span class="tag" style="background:#142a44;color:#9fd7ff;border-color:var(--research)">เหตุการณ์สมมติ (เวอร์ชันจริงดึงจาก DONKI)</span>':''}</div>
    <p class="problem"><b>ปัญหา:</b> ${e.problem}</p>
    <p class="note" style="margin-bottom:8px">เลือกวิธีแก้ ราคาของแต่ละตัวเลือกแสดงอยู่บนปุ่ม ราคาบนปุ่มคือราคามาตรฐาน หลังเลือกจะมีมินิเกมที่ช่วยลดหรือเพิ่มความเสียหายได้ (ข้ามได้) เวลาหยุดอยู่จนกว่าคุณจะเลือก</p>
    <div class="opts">${opts}</div>
  </section>${renderLog()}`;
}
function renderEventResult(){
  const r=G.evResult;const oc=r.hit||r.score===0?' res-bad':(r.score===2?' res-good':'');
  const cont=G.health<=0?'':`<button class="btn" data-act="evnext">ไปต่อ เดินเวลาต่อ</button>`;
  return `${head()}
  <section class="panel${oc}" style="display:grid;gap:12px">
    <h2>${ic('alert')} ผลของการเลือก: ${r.label}</h2>
    <div class="chips">${chips(r.applied,r.extra)}</div>
    ${r.mini?`<p class="note"><b>${r.mini}</b>${r.score===2?' ความเสียหายลดลง ×0.7':r.score===0?' ความเสียหายเพิ่ม ×1.3':''}</p>`:''}
    ${bubble(r.react[0],r.react[1],G.clock)}
    <div class="why"><h3>ทำไมถึงเป็นแบบนี้</h3><p>${r.why}</p>${r.riskNote?`<p><b>${r.hit?'ความเสี่ยงเกิดขึ้นจริง:':'ความเสี่ยงไม่เกิด:'}</b> ${r.riskNote}</p>`:''}
    <p class="note"><b>รู้ไหม:</b> ${r.learn}</p></div>
    <div class="row-end"><span></span>${cont||'<button class="btn" data-act="evnext">ดูผลภารกิจ</button>'}</div>
  </section>${renderLog()}`;
}
