'use strict';
function fmt(m){m=Math.floor(m);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
function addFeed(who,text){G.feed.push({t:G.clock,day:G.day,who,text});if(G.feed.length>40)G.feed.shift();}
function buildSchedule(){
  const q=[];
  for(let t=DAY_START;t<DAY_END;t+=BEAT_STEP)q.push({t,type:'beat'});
  const nPop=POP_MIN+Math.floor(rnd()*(POP_MAX-POP_MIN+1));
  const nEv=EV_MIN+Math.floor(rnd()*(EV_MAX-EV_MIN+1));
  G.popTotal=nPop;G.popShown=0;
  const kinds=[];for(let i=0;i<nEv;i++)kinds.push('event');for(let i=0;i<nPop;i++)kinds.push('pop');
  /* สุ่มเวลา 07:30-21:00 ห่างกันอย่างน้อย 60 นาที (ลองลดช่องว่างถ้าไม่พอ) */
  let gap=60,times;
  for(let attempt=0;attempt<400;attempt++){
    times=[];let ok=true;
    for(let i=0;i<kinds.length&&ok;i++){let t,tries=0;do{t=Math.round((450+rnd()*780)/5)*5;tries++;}while(times.some(x=>Math.abs(x-t)<gap)&&tries<60);if(tries>=60)ok=false;else times.push(t);}
    if(ok)break;if(attempt===200)gap=45;
  }
  /* สุ่มสลับว่าเวลาไหนเป็นปัญหา เวลาไหนเป็นช่วงกิจกรรม */
  const order=kinds.map((k,i)=>({k,r:rnd()})).sort((a,b)=>a.r-b.r).map(o=>o.k);
  times.sort((a,b)=>a-b).forEach((t,i)=>q.push({t:t+0.5,type:order[i]}));
  q.sort((a,b)=>a.t-b.t);
  return q;
}
function morningLine(){
  if(G.day===1)return ['mintra','ตื่นได้แล้วทุกคน! นี่คือวันแรกของเราที่ฐานขั้วใต้ดวงจันทร์ เป้าหมายคืองานวิจัย แต่เราต้องดูแลไฟ อาหาร และสุขภาพของทุกคนก่อนนะ'];
  if(G.phase==='night'&&G.day===G.light+1)return ['mintra','คืนจันทร์มาถึงแล้ว แผงโซลาร์ผลิตไฟได้น้อยลงและข้างนอกหนาวมาก ทุกคนช่วยกันประหยัดไฟนะ'];
  if(G.power<40)return ['ton','กัปตันครับ ไฟเหลือน้อยแล้ว ผมว่าเราควรจัดการเรื่องไฟก่อนเลย'];
  if(G.food<40)return ['ploy','ผักในห้องปลูกยังไม่พอกินเลยค่ะ เราต้องดูแลมันให้มากขึ้นนะคะ'];
  if(G.health<50)return ['phum','ทุกคนดูเหนื่อยมากครับ ผมอยากให้เราพักกันบ้าง'];
  return ['mintra','อรุณสวัสดิ์ทุกคน เช้านี้ทุกอย่างดูปกติดี เริ่มงานกันเลย'];
}
function beat(t){
  let l;
  if(t<=DAY_START)l=morningLine();
  else if(t>=DAY_END-BEAT_STEP){
    const left=Math.max(0,G.popTotal-G.popShown);
    l=left>0?['mintra','ใกล้สิ้นวันแล้ว ทุกคนเตรียมตัวพักผ่อนกันนะ']:['phum','วันนี้ทุกคนทำงานหนักกันมาก อีกไม่นานก็ได้พักแล้วครับ'];
  }else l=storyLine(t);
  addFeed(l[0],l[1]);
}
function runDue(){
  while(G.sched.length&&G.sched[0].t<=G.clock){
    const it=G.sched.shift();
    if(it.type==='beat')beat(it.t);
    else if(it.type==='pop'){G.popShown++;G.screen='activity';G.popSay=POP_SAY[Math.floor(rnd()*POP_SAY.length)];return true;}
    else{const q=pickEvent();G.ev=q.e;G.evSev=q.sev;G.evResult=null;G.screen='event';return true;}
  }
  return false;
}
function advance(min){
  let left=min;
  while(left>0&&G&&G.screen==='play'){
    const step=Math.min(left,1);
    G.clock+=step;left-=step;
    if(runDue())break;
    if(G.clock>=DAY_END){endDay();break;}
  }
}
function resume(){G.ev=null;if(G.screen!=='result')G.screen='play';}
