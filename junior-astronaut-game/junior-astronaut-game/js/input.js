'use strict';
document.addEventListener('click',e=>{
  if(G&&G.tip&&!e.target.closest('.crewc')){G.tip=null;document.querySelectorAll('.crewc.open').forEach(x=>x.classList.remove('open'));}
  const b=e.target.closest('[data-act]');if(!b||b.disabled)return;
  const a=b.dataset.act,v=b.dataset.v;
  if(G&&a!=='crewtip')G.tip=null;
  const fxNew=(a==='start'||a==='again'||a==='nextday');
  if(a==='mode')SEL.mode=+v;
  else if(a==='plan')SEL.plan=v;
  else if(a==='start'||a==='again')newGame(SEL.mode,SEL.plan);
  else if(a==='menu')G=null;
  else if(a==='pop')choosePop(v);
  else if(a==='skip')skipPop();
  else if(a==='endday')endDay();
  else if(a==='opt')pickOption(+v);
  else if(a==='miniskip')finishMini(1,true);
  else if(a==='pause')G.paused=!G.paused;
  else if(a==='speed'){SEL.speed=v;G.speed=v;}
  else if(a==='evnext'){ if(G.health<=0)finish('evac'); else resume(); }
  else if(a==='nextday')nextDay();
  else if(a==='crewtip')G.tip=(G.tip===v?null:v);
  render();
  if(fxNew&&G&&G.screen==='play')showDayBanner();
});
