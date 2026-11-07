'use strict';
function renderSummary(){
  const s=G.summary;
  const lines=s.lines.map((l,i)=>`<li style="--i:${i}">${l.t} → <span class="chips" style="display:inline-flex;vertical-align:middle">${chips(l.fx)}</span></li>`).join('');
  return `${head()}
  <section class="panel" style="display:grid;gap:12px">
    <h2>สรุปปลายวันที่ ${G.day}</h2>
    <ul class="plain">${lines}</ul>
    <div class="why"><h3>บันทึกของกัปตันมินตรา</h3><p>${s.diary}</p></div>
    <p class="note">ทรัพยากรเชื่อมกัน: ไฟหมดทำให้สุขภาพตก ไฟต่ำทำให้พืชโตช้า สุขภาพต่ำทำให้วิจัยช้าลง</p>
    <div class="row-end"><span></span><button class="btn" data-act="nextday">${(G.health<=0||G.day>=G.days)?'ดูผลภารกิจ':'ไปวันที่ '+(G.day+1)}</button></div>
  </section>${renderLog()}`;
}
function renderLog(){
  const items=G.log.map(d=>`<div><h3>วันที่ ${d.day} (${d.phase==='night'?'กลางคืน':'กลางวัน'})</h3><ul>${d.items.map(t=>`<li>${t}</li>`).join('')||'<li class="muted">ยังไม่มีบันทึก</li>'}</ul></div>`).join('');
  return `<details><summary>บันทึกภารกิจ</summary><div class="log" style="margin-top:10px">${items}</div></details>`;
}
function renderResult(){
  const T={
   success:['ภารกิจสำเร็จ!','งานวิจัยถึงเป้า และลูกเรือยังปลอดภัยอยู่ที่ฐาน'],
   partial:['ฐานรอด แต่งานวิจัยยังไม่ถึงเป้า','ลูกเรือปลอดภัยครบ ข้อมูลที่ได้ถูกส่งกลับโลกแล้ว ลองจัดสรรการกระทำใหม่เพื่อให้ถึงเป้า'],
   evac:['อพยพกลับโลกอย่างปลอดภัย','สุขภาพลูกเรือต่ำเกินไป ทีมจึงกลับโลกอย่างปลอดภัย ข้อมูลวิจัยที่ส่งกลับแล้วยังนับแต้ม']}[G.end];
  const learn=G.seen.map(s=>`<li><b>${s.title}:</b> ${s.learn}</li>`).join('')||'<li class="muted">ยังไม่มีเหตุการณ์ในรอบนี้</li>';
  return `
  <header class="panel" style="display:grid;gap:10px"><span class="rbadge ${G.end}">${ic(G.end==='success'?'gem':G.end==='partial'?'flask':'box')}</span><span class="brand">สรุปภารกิจ · ${G.mode} วัน · ${G.plan.name}</span><h1>${T[0]}</h1><p>${T[1]}</p>
   ${bubble(END_LINE[G.end][0],END_LINE[G.end][1],null,true)}
   <div class="stat"><div>แต้มวิจัย<b data-n="${G.research}" data-s=" / ${G.target}">${G.research} / ${G.target}</b></div><div>วันที่อยู่ถึง<b>${Math.min(G.day,G.days)} / ${G.days}</b></div>
   <div>ไฟ<b data-n="${G.power}">${G.power}</b></div><div>อาหาร<b data-n="${G.food}">${G.food}</b></div><div>สุขภาพ<b data-n="${G.health}">${G.health}</b></div></div></header>
  <section class="panel" style="display:grid;gap:10px"><h2>เหตุผลที่ควรรู้จากรอบนี้</h2><ul class="plain">${learn}</ul></section>
  <section class="panel" style="display:grid;gap:10px"><h2>ทบทวนการตัดสินใจ</h2><div class="log">${G.log.map(d=>`<div><h3>วันที่ ${d.day} (${d.phase==='night'?'กลางคืน':'กลางวัน'})</h3><ul>${d.items.map(t=>`<li>${t}</li>`).join('')}</ul></div>`).join('')}</div></section>
  <div class="row-end"><button class="btn" data-act="again">เล่นอีกครั้ง (เหตุการณ์สุ่มใหม่)</button><button class="btn ghost" data-act="menu">กลับไปเลือกโหมด</button></div>
  ${renderSources()}`;
}
