'use strict';
function pickEvent(){
  let pool=EVENTS.filter(e=>!G.usedEvents.includes(e.id)&&(!e.nightOnly||G.phase==='night'));
  if(!pool.length){G.usedEvents=[];pool=EVENTS.filter(e=>!e.nightOnly||G.phase==='night');}
  const alt=pool.filter(e=>e.group!==G.lastGroup);
  if(alt.length)pool=alt;
  const e=pool[Math.floor(rnd()*pool.length)];
  G.usedEvents.push(e.id);G.lastGroup=e.group;
  return {e,sev:rnd()<0.3?1.4:1};
}
function scaleFx(fx,sev){const o={};for(const k in fx)o[k]=fx[k]<0?Math.round(fx[k]*sev):fx[k];return o;}
function optView(o){
  const fx=eff(scaleFx(o.fx,G.evSev),o.rad);
  const risk=o.risk?{p:o.risk.p,fx:eff(scaleFx(o.risk.fx,G.evSev),o.rad),text:o.risk.text,hit:o.risk.hit,miss:o.risk.miss}:null;
  return {fx,risk};
}
function chooseOption(i,score,note,skipped){
  if(score==null)score=1;
  const o=G.ev.opts[i],v=optView(o);
  if(score!==1)RES.forEach(k=>{if(v.fx[k]<0)v.fx[k]=Math.round(v.fx[k]*EV_NEG[score]);});
  apply(v.fx);
  let riskNote='',hit=null;
  if(v.risk){hit=rnd()<v.risk.p;if(hit)apply(v.risk.fx);riskNote=hit?v.risk.hit:v.risk.miss;}
  if(o.flag==='shield')G.shield=true;
  if(o.flag==='storm')G.stormBonus=true;
  if(o.flag==='dirty')G.solarDirty=2;
  const applied=Object.assign({},v.fx);
  if(hit)RES.forEach(k=>{if(v.risk.fx[k])applied[k]=(applied[k]||0)+v.risk.fx[k];});
  G.cause=G.cause||{};RES.forEach(k=>{if(applied[k]<0)G.cause[k]={src:'เหตุการณ์ "'+G.ev.title+'"',v:applied[k],day:G.day};});
  const rc=reaction(applied,hit);addFeed(rc[0],rc[1]);
  G.evResult={label:o.label,why:o.why,riskNote,hit,applied,learn:G.ev.learn,title:G.ev.title,extra:o.extra||[],react:rc,mini:note||'',score:score};
  if(!G.seen.find(s=>s.title===G.ev.title))G.seen.push({title:G.ev.title,learn:G.ev.learn});
  logAdd('เหตุการณ์ "'+G.ev.title+'": เลือก "'+o.label+'" → '+plain(applied)+(o.extra?' ('+o.extra.join(', ')+')':'')+(riskNote?' · '+riskNote:'')+(note?' · '+note:''));
  G.screen='eventResult';
}
