'use strict';
function actions(){
  const night=G.phase==='night',lowP=G.power<30,lowH=G.health<40,hm=lowH?0.7:1;
  const sm=G.solarDirty>0?0.5:1;
  const rep=id=>[1,0.75,0.55][Math.min(G.cnt[id]||0,2)];
  const repNote=id=>(G.cnt[id]||0)>0?'ทำซ้ำวันนี้ ได้แต้มน้อยลง':'';
  const crisis=Math.min(G.power,G.food,G.health)<25;
  return [
   {id:'solar',icon:night?'moon':'sun',name:'ปรับแผงโซลาร์',desc:night?'กลางคืน แผงได้ไฟน้อยกว่ากลางวัน':'กลางวัน แผงผลิตไฟได้เต็มที่',fx:{power:Math.round((night?10:16)*sm)},note:G.solarDirty>0?'ฝุ่นเกาะแผง ได้ไฟครึ่งเดียว':''},
   {id:'plant',icon:'leaf',name:'ดูแลห้องปลูกพืช',desc:'ปลูกและรดน้ำพืชเพื่อเป็นอาหาร',fx:{power:-6,food:G.power<=0?0:(lowP?7:14)},note:lowP?'ไฟต่ำ พืชโตช้า ได้อาหารน้อยลง':''},
   {id:'rplant',icon:'flask',name:'วิจัยพืช',desc:'ใช้พืชเป็นตัวอย่างทดลอง กินไม่ได้',fx:{power:-6,food:-4,research:Math.round(11*G.plan.mP*hm*rep('rplant'))},note:lowH?'สุขภาพลูกเรือต่ำ งานวิจัยช้าลง':repNote('rplant')},
   {id:'rrad',icon:'trefoil',name:'วิจัยรังสี',desc:'ออกไปติดตั้งเครื่องวัดรังสีนอกฐาน',fx:eff({power:-9,health:-3,research:Math.round(12*G.plan.mR*hm*rep('rrad')*(G.stormBonus?1.5:1))},true),note:G.stormBonus?'วันนี้มีพายุสุริยะ ได้ข้อมูลเพิ่ม ×1.5':(lowH?'สุขภาพลูกเรือต่ำ งานวิจัยช้าลง':repNote('rrad'))},
   {id:'shield',icon:'shield',name:'เสริมเกราะกันรังสี',desc:'วันนี้ รังสีทำร้ายสุขภาพลดลงครึ่งหนึ่ง',fx:{power:-8},note:G.shield?'เปิดเกราะอยู่แล้ว':'',disabled:G.shield},
   {id:'rest',icon:'heart',name:'ดูแลสุขภาพลูกเรือ',desc:'พักผ่อน ตรวจร่างกาย',fx:{power:-3,health:12}},
   {id:'sos',icon:'box',name:'ขอเสบียงฉุกเฉินจากโลก',desc:'ใช้ได้ครั้งเดียวต่อรอบ ตอนวิกฤตเท่านั้น',fx:{power:25,food:25,research:-10},note:G.sosUsed?'ใช้ไปแล้ว':(!crisis?'ใช้ได้เมื่อมีทรัพยากรต่ำกว่า 25':''),disabled:G.sosUsed||!crisis}
  ];
}
function doAction(id,score,note){
  if(score==null)score=1;
  const a=actions().find(x=>x.id===id);
  if(!a||a.disabled)return false;
  if(score!==1){const f={};RES.forEach(k=>{if(a.fx[k]>0)f[k]=Math.round(a.fx[k]*ACT_POS[score]);else if(a.fx[k]<0)f[k]=Math.round(a.fx[k]*ACT_NEG[score]);});a.fx=f;}
  apply(a.fx);
  if(id==='shield')G.shield=true;
  if(id==='sos')G.sosUsed=true;
  G.cause=G.cause||{};RES.forEach(k=>{if(a.fx[k]<0&&k!=='power'||a.fx[k]<-8&&k==='power')G.cause[k]={src:'กิจกรรม "'+a.name+'"',v:a.fx[k],day:G.day};});
  G.cnt[id]=(G.cnt[id]||0)+1;
  G.msg='ล่าสุด: '+a.name+' → '+plain(a.fx)+(note?' ('+note+')':'');
  logAdd(a.name+' → '+plain(a.fx)+(note?' ('+note+')':''));
  checkEnd();
  return true;
}
function choosePop(id){
  if(G.screen!=='activity')return;
  const a=actions().find(x=>x.id===id);if(!a||a.disabled)return;
  if(MINI_ACT[id]){beginMini(MINI_ACT[id],{t:'act',id});return;}
  if(!doAction(id))return;
  if(G.screen==='result')return;
  const L=ACT_SAY[id];const l=L[Math.floor(rnd()*L.length)];addFeed(l[0],l[1]);
  G.screen='play';
}
function skipPop(){
  if(G.screen!=='activity')return;
  G.msg='ล่าสุด: ข้ามช่วงทำกิจกรรม';logAdd('ข้ามช่วงทำกิจกรรม (ไม่ได้ทำอะไร)');
  addFeed('mintra','ไม่เป็นไร เราพักสักครู่ แล้วค่อยทำงานต่อ');
  G.screen='play';
}
function baseline(){
  const L=[{t:'ระบบช่วยชีวิตใช้ไฟ',fx:{power:-8}}];
  if(G.phase==='night')L.push({t:'คืนจันทร์: เครื่องทำความร้อนใช้ไฟเพิ่ม',fx:{power:-3}});
  L.push({t:'ลูกเรือกินอาหาร',fx:{food:-9}});
  L.push({t:G.shield?'รังสีพื้นผิวดวงจันทร์ (เกราะช่วยลดครึ่งหนึ่ง)':'รังสีพื้นผิวดวงจันทร์',fx:eff({health:-3},true)});
  return L;
}
function dayEnd(){
  const lines=baseline(),t={power:0,food:0,health:0,research:0};
  const sum=()=>lines.forEach(l=>RES.forEach(k=>{if(l.fx[k])t[k]+=l.fx[k];}));
  sum();
  if(G.power+t.power<=0){const l={t:'ไฟหมด → ระบบช่วยชีวิตทำงานต่ำ → สุขภาพลูกเรือตก',fx:{health:-10}};lines.push(l);t.health-=10;}
  if(G.food+t.food<=0){const l={t:'อาหารหมด → ลูกเรือหิว → สุขภาพตก',fx:{health:-8}};lines.push(l);t.health-=8;}
  return {lines,t};
}
function endDay(){
  const d=dayEnd();
  d.lines.forEach(l=>apply(l.fx));
  logAdd('สิ้นวัน → '+plain(d.t));
  if(G.solarDirty>0)G.solarDirty--;
  G.clock=DAY_END;
  const dl=diary();addFeed('mintra',dl);
  G.summary={lines:d.lines,t:d.t,diary:dl};
  G.screen='summary';
}
function nextDay(){
  if(G.health<=0){finish('evac');return;}
  G.day++;
  if(G.day>G.days){finish('done');return;}
  startDay();
}
function checkEnd(){if(G.health<=0&&G.screen!=='result')finish('evac');}
function finish(kind){
  const ok=G.research>=G.target;
  G.end=kind==='evac'?'evac':(ok?'success':'partial');
  G.screen='result';
}
