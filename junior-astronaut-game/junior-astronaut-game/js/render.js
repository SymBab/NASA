'use strict';
let lastScreen='';
function render(){
  const s=G?G.screen:'start';
  const html={start:renderStart,play:renderPlay,activity:renderActivity,mini:renderMini,event:renderEvent,eventResult:renderEventResult,summary:renderSummary,result:renderResult}[s]();
  const openLog=[...document.querySelectorAll('#app details')].map(d=>d.open);
  $('#app').className='wrap s-'+s+((s!==lastScreen&&['start','result','summary','eventResult'].includes(s))?' enter':'');
  $('#app').innerHTML=html;
  [...document.querySelectorAll('#app details')].forEach((d,i)=>{if(openLog[i])d.open=true;});
  if(s!==lastScreen){if(s==='activity'||s==='mini'){const pu=document.querySelector('.popup,.mini');if(pu)pu.scrollIntoView({block:'start'});}else window.scrollTo(0,0);lastScreen=s;}
  if(s==='mini')startMini();
  animateMeters();
  if(s==='result'&&!document.querySelector('.confetti')&&!G._fx){G._fx=1;celebrate();countUp();}
}
