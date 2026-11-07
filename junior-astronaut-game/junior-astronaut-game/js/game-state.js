'use strict';
/* ---------- state ---------- */
let SEL={mode:7,plan:'mixed',speed:'normal'};
let G=null;

function newGame(mode,plan){
  const m=MODES[mode];
  G={mode,days:m.light+m.night,light:m.light,planId:plan,plan:PLANS[plan],
    day:1,phase:'day',power:70,food:70,health:80,research:0,popTotal:0,popShown:0,said:{},
    shield:false,stormBonus:false,solarDirty:0,sosUsed:false,cnt:{},
    usedEvents:[],lastGroup:null,sched:[],clock:DAY_START,paused:false,speed:SEL.speed,feed:[],ev:null,evSev:1,evResult:null,summary:null,
    screen:'play',msg:'',log:[],seen:[],end:null,target:TARGETS[mode]};
  startDay();
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function eff(fx,rad){
  const o=Object.assign({},fx);
  if(rad&&G.shield&&o.health<0)o.health=Math.round(o.health*0.5);
  return o;
}
function apply(fx){
  RES.forEach(k=>{
    if(!fx[k])return;
    G[k]=k==='research'?Math.max(0,G[k]+fx[k]):clamp(G[k]+fx[k],0,100);
  });
}
function plain(fx){return RES.filter(k=>fx[k]).map(k=>RL[k]+' '+(fx[k]>0?'+':'−')+Math.abs(fx[k])).join(', ')||'ไม่มีผลทันที';}
function logAdd(t){G.log[G.log.length-1].items.push(t);}

function startDay(){
  G.phase=G.day<=G.light?'day':'night';
  G.cnt={};G.shield=false;G.stormBonus=false;G.msg='';
  G.log.push({day:G.day,phase:G.phase,items:[]});
  G.clock=DAY_START;G.paused=false;G.ev=null;G.screen='play';
  G.sched=buildSchedule();
  runDue();
}
