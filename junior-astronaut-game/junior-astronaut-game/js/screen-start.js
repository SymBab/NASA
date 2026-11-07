'use strict';
function renderStart(){
  const modes=[4,7,14].map(n=>{const m=MODES[n];return `<button class="pick" data-act="mode" data-v="${n}" aria-pressed="${SEL.mode===n}"><span class="t">${n} วัน</span><span class="s">กลางวัน ${m.light} วัน แล้วกลางคืน ${m.night} วัน (ย่อเวลา)</span></button>`;}).join('');
  const plans=Object.keys(PLANS).map(k=>{const p=PLANS[k];return `<button class="pick" data-act="plan" data-v="${k}" aria-pressed="${SEL.plan===k}"><span class="t">${p.name}</span><span class="s">${p.pro}<br>${p.con}</span></button>`;}).join('');
  return `
  <header class="panel" style="display:grid;gap:10px">
    <span class="brand">JUNIOR ASTRONAUT MISSION TRAINER · PROTOTYPE</span>
    <h1>ฐานบนดวงจันทร์: ภารกิจวิจัย</h1>
    <p>คุณดูแลฐานบนขั้วใต้ของดวงจันทร์ เป้าหมายคือทำงานวิจัยให้ถึงเป้า โดยที่ไฟ อาหาร และสุขภาพลูกเรือต้องไม่หมด ทุกการเลือกมีราคา ไม่มีตัวเลือกไหนฟรี</p>
    <ul class="plain">
      <li>แต่ละวันมี <b>${POP_MIN}-${POP_MAX} ช่วงทำกิจกรรม</b> ที่เด้งขึ้นมาเองตอนเวลาเดิน เลือกได้ 1 อย่างจาก 7 อย่าง หรือข้ามก็ได้ คิดให้ดีก่อนเลือก</li>
      <li><b>เวลาในวันเดินเอง</b> ตั้งแต่ 06:00 ถึง 22:00 (ความเร็วปกติราว 2 นาทีต่อวัน) ทุก 30 นาทีเกมจะมีเรื่องเล่าจากลูกเรือ คุณหยุดเวลาหรือปรับความเร็วได้</li>
      <li>แต่ละวันมี <b>เหตุการณ์ฉุกเฉิน ${EV_MIN}-${EV_MAX} ครั้ง</b> สุ่มเวลาเกิด เวลาจะหยุด คุณเลือกวิธีแก้ (3 ตัวเลือก เห็นราคาก่อนเลือก) แล้วเวลาจึงเดินต่อ</li>
      <li>บางกิจกรรมและทุกปัญหาฉุกเฉินมี <b>มินิเกมสั้น ๆ</b> เล่นดีได้ผลดีขึ้น เล่นพลาดได้ผลแย่ลง ข้ามได้ (ผลปกติ)</li>
      <li>ดู <b>แนวโน้มปลายวัน</b> ใต้แถบทรัพยากร เพื่อรู้ว่าคืนนี้อะไรจะหมดก่อน</li>
    </ul>
  </header>
  <section class="panel" style="display:grid;gap:12px"><h2>ทีมของคุณ</h2><div class="crew">${Object.keys(CREW).map(c=>`<div class="crewc">${av(c)}<div><div class="nm">${CREW[c].name} · ${CREW[c].role}</div><div class="tr">${CREW[c].trait}</div></div></div>`).join('')}</div>
    <p class="note">อารมณ์ของแต่ละคนเปลี่ยนตามทรัพยากรที่เกี่ยวข้อง เช่น ไฟต่ำทำให้ต้นกังวล และพลอยห่วงเรื่องอาหาร</p></section>
  <section class="panel" style="display:grid;gap:12px"><h2>1. เลือกความยาวภารกิจ</h2><div class="choices">${modes}</div>
    <p class="note">กลางคืนบนดวงจันทร์จริงยาวราว 14 วันตามเวลาโลก ในเกมย่อเวลาให้สั้นลงเพื่อให้เล่นจบได้</p></section>
  <section class="panel" style="display:grid;gap:12px"><h2>2. เลือกแผนวิจัย</h2><div class="choices">${plans}</div>
    <p class="note">แผนวิจัยนี้เป็นข้อเสนอ ยังไม่ได้ยืนยันกับทีม ค่าตัวคูณทั้งหมดเป็นค่าสมมติ</p></section>
  <div class="row-end"><button class="btn" data-act="start">เริ่มภารกิจ</button><span class="note">เป้างานวิจัยโหมดนี้: ${TARGETS[SEL.mode]} แต้ม</span></div>
  ${renderSources()}`;
}
function renderSources(){
  return `<details><summary>ข้อมูลจริงของ NASA ที่วางแผนจะใช้ (ต้นแบบนี้ยังไม่ได้ดึงข้อมูลสด)</summary>
  <p class="note" style="margin-top:8px">ตัวเลขทั้งหมดในเกมตอนนี้ (ไฟ อาหาร สุขภาพ แต้มวิจัย และต้นทุนของแต่ละปุ่ม) เป็นค่าสมมติของเกม ไม่ใช่ข้อมูล NASA เหตุการณ์ "พายุสุริยะ" เป็นเหตุการณ์สมมติ เวอร์ชันจริงจะดึงเหตุการณ์ย้อนหลังจริงจาก DONKI คำอธิบายหลังเลือกเป็นร่าง ยังไม่ได้ตรวจกับแหล่ง NASA ทีละข้อ</p>
  <div class="tbl"><table><thead><tr><th>ข้อมูล</th><th>ที่มา</th><th>สถานะในต้นแบบ</th></tr></thead><tbody>
  <tr><td>พายุสุริยะ</td><td><a href="https://api.nasa.gov/" target="_blank" rel="noopener">DONKI (api.nasa.gov)</a></td><td>ยังไม่เชื่อม</td></tr>
  <tr><td>รังสีที่นักบินได้รับ</td><td><a href="https://visualization.osdr.nasa.gov/" target="_blank" rel="noopener">OSDR RadLab</a></td><td>ยังไม่เชื่อม</td></tr>
  <tr><td>รังสีบริเวณดวงจันทร์</td><td><a href="https://scholars.unh.edu/physics_facpub/189" target="_blank" rel="noopener">CRaTER บนยาน LRO</a></td><td>ยังไม่เชื่อม</td></tr>
  <tr><td>การปลูกพืชในอวกาศ</td><td><a href="https://ntrs.nasa.gov/citations/20205011615" target="_blank" rel="noopener">Veggie (NASA NTRS)</a></td><td>ใช้เป็นแนวคิดของเหตุการณ์น้ำและเชื้อรา</td></tr>
  <tr><td>แผนฐานถาวรบนดวงจันทร์</td><td><a href="https://www.nasa.gov/moonbase-systems/" target="_blank" rel="noopener">NASA Moon Base Systems</a></td><td>ใช้เป็นฉากของเกม</td></tr>
  </tbody></table></div></details>`;
}
