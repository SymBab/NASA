'use strict';
function crewWhy(c){
  const m=moodOf(c),P=G.power,F=G.food,H=G.health;
  const rc=k=>{const x=G.cause&&G.cause[k];return x&&G.day-x.day<=1?x.src+' ทำให้'+RL[k]+'ลด '+Math.abs(x.v):null;};
  const L=[];let head='',tp='';
  const feel=['สบายใจ','เริ่มกังวล','ตึงเครียด'][m.lv];
  if(c==='ton'){
    head='ไฟเหลือ '+P+'/100 '+(m.lv===0?'ยังเพียงพอ ต้นจึงสบายใจ':m.lv===1?'เริ่มน้อย ต้นจึงเริ่มกังวล':'น้อยมาก ต้นจึงตึงเครียด');
    if(rc('power'))L.push(rc('power'));
    if(G.solarDirty>0)L.push('แผงโซลาร์เปื้อนฝุ่น ได้ไฟแค่ครึ่งเดียวอีก '+G.solarDirty+' วัน');
    if(G.phase==='night')L.push('คืนจันทร์: แผงได้ไฟน้อยลง และฐานใช้ไฟทำความร้อนเพิ่ม');
    L.push('ทุกวันระบบช่วยชีวิตใช้ไฟ 8');
    if(P<30)L.push('ไฟต่ำกว่า 30 ห้องปลูกพืชจึงโตช้าลงครึ่งหนึ่ง');
    if(m.lv>0)tp='ลองทำ: ปรับแผงโซลาร์ หรือเลี่ยงงานที่กินไฟมาก';
  }else if(c==='ploy'){
    head='อาหารเหลือ '+F+'/100 '+(m.lv===0?'ยังพอกิน พลอยจึงสดใส':m.lv===1?'เริ่มน้อย พลอยจึงกังวล':'น้อยมาก พลอยจึงใจเสีย');
    if(rc('food'))L.push(rc('food'));
    L.push('ทุกวันลูกเรือกินอาหาร 9');
    if(P<30)L.push('ไฟต่ำ ห้องปลูกพืชโตช้า ได้อาหารน้อยลง');
    if(F<=0)L.push('อาหารหมดแล้ว สุขภาพทุกคนจะตก');
    if(m.lv>0)tp='ลองทำ: ดูแลห้องปลูกพืช และรักษาไฟไม่ให้ต่ำ';
  }else if(c==='phum'){
    head='สุขภาพเหลือ '+H+'/100 '+(m.lv===0?'ยังแข็งแรง หมอภูมิจึงสบายใจ':m.lv===1?'เริ่มลดลง หมอภูมิจึงเป็นห่วง':'ต่ำมาก หมอภูมิจึงตึงเครียด');
    if(rc('health'))L.push(rc('health'));
    L.push(G.shield?'ทุกวันมีรังสีพื้นผิว แต่เกราะเปิดอยู่ ลดผลลงครึ่งหนึ่ง':'ทุกวันมีรังสีพื้นผิวดวงจันทร์ทำร้ายสุขภาพ 3');
    if(P<=0)L.push('ไฟหมด ระบบช่วยชีวิตทำงานต่ำ สุขภาพจึงตก');
    if(F<=0)L.push('อาหารหมด ลูกเรือหิว สุขภาพจึงตก');
    if(H<40)L.push('สุขภาพต่ำกว่า 40 งานวิจัยจึงช้าลง 30%');
    if(m.lv>0)tp='ลองทำ: ดูแลสุขภาพลูกเรือ หรือเสริมเกราะกันรังสี';
  }else{
    const len=DAY_END-DAY_START,frac=((G.day-1)*len+Math.max(0,G.clock-DAY_START))/(G.days*len);
    const r=G.research/G.target;
    head=frac<0.1?'ภารกิจเพิ่งเริ่ม ยังไม่มีงานค้าง กัปตันจึงมั่นใจ':'งานวิจัยทำได้ '+Math.round(r*100)+'% ของเป้า ขณะที่เวลาผ่านไป '+Math.round(frac*100)+'% '+(m.lv===0?'จึงเป็นไปตามแผน กัปตันมั่นใจ':m.lv===1?'จึงเริ่มช้ากว่าแผน กัปตันกังวล':'จึงช้ากว่าแผนมาก กัปตันเครียด');
    if(rc('research'))L.push(rc('research'));
    if(H<40)L.push('สุขภาพลูกเรือต่ำ งานวิจัยช้าลง 30%');
    if(P<30)L.push('ไฟต่ำ ต้องเลือกว่าจะใช้ไฟกับอะไรก่อน');
    L.push('วิจัยพืชและวิจัยรังสีได้แต้มตามแผน "'+G.plan.name+'"');
    if(m.lv>0)tp='ลองทำ: ใช้ช่วงทำกิจกรรมกับงานวิจัยให้มากขึ้น แต่ดูแลไฟ อาหาร สุขภาพไม่ให้หมด';
  }
  return `<div class="tip" role="tooltip" id="tip-${c}"><b>${CREW[c].name}: ${m.text}</b><p>${head}</p><ul>${L.map(x=>`<li>${x}</li>`).join('')}</ul>${tp?`<p class="tipto">${tp}</p>`:''}</div>`;
}
function crewHtml(){
  return '<div class="crew">'+Object.keys(CREW).map(c=>{const m=moodOf(c),open=G.tip===c;return `<div class="crewc has-tip lv${m.lv}${open?' open':''}" style="--d:${(c.length%4)*.4}s"><button class="crewb" data-act="crewtip" data-v="${c}" aria-expanded="${open}" aria-describedby="tip-${c}">${av(c)}<span><span class="nm">${CREW[c].name}</span><span class="md lv${m.lv}">รู้สึก: ${m.text} <small>(แตะดูเหตุผล)</small></span></span></button>${crewWhy(c)}</div>`;}).join('')+'</div>';
}
