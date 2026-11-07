'use strict';
function sunXY(f){return [40+f*320,98-62*Math.sin(Math.PI*f)];}
function sceneHtml(){
  const night=G.phase==='night';
  const f=clamp((G.clock-DAY_START)/(DAY_END-DAY_START),0,1);
  const [sx,sy]=sunXY(f);
  const stars=[[20,18],[60,40],[95,12],[140,30],[180,16],[220,44],[260,10],[300,26],[360,12],[385,48],[120,55],[40,70]].map((p,i)=>`<circle class="star" style="animation-delay:${(i%5)*.6}s" cx="${p[0]}" cy="${p[1]}" r="${i%3?1:1.6}"/>`).join('');
  const panels=[262,292,322].map(x=>`<g><polygon class="pan" points="${x},108 ${x+24},108 ${x+28},94 ${x+4},94"/><polygon class="glint" points="${x+6},106 ${x+10},106 ${x+14},95 ${x+10},95"/><line x1="${x+14}" y1="108" x2="${x+14}" y2="114" stroke="#8a90a8" stroke-width="2"/></g>`).join('');
  const inEv=G.ev&&(G.screen==='event'||(G.screen==='mini'&&G.mini&&G.mini.ctx.t==='ev'));
  const FXM={leak:'leak',solardust:'dust',dustin:'dust',filter:'dust',storm:'storm',powerdrop:'flick',heater:'cold',comms:'rings',radmeter:'rings'};
  const fxk=inEv&&FXM[G.ev.id]?' fx-'+FXM[G.ev.id]:'';
  return `<svg class="scene ${night?'night':'day'}${inEv?' alert':''}${fxk}" id="scene" viewBox="0 0 400 150" role="img" aria-label="ฉากฐานบนขั้วใต้ของดวงจันทร์ ${night?'ตอนกลางคืน':'ตอนกลางวัน'}">
  <rect class="sky" width="400" height="150"/>${stars}
  <g><circle cx="345" cy="36" r="14" fill="#3d7bd9"/><path d="M338 30q6-4 10 1t-2 8q-6 3-9-2z" fill="#58b36a"/><circle cx="345" cy="36" r="14" fill="none" stroke="#9fd7ff" stroke-width=".8" opacity=".6"/></g>
  <g class="sun" id="sun" transform="translate(${sx.toFixed(1)},${sy.toFixed(1)})" style="opacity:${night?0:1}"><circle r="18" fill="#ffe08a" opacity=".25"/><circle r="10" fill="#ffe08a"/></g>
  <path class="gnd" d="M0 150V112Q60 104 120 110T260 108T400 112V150Z"/>
  <ellipse class="cr" cx="60" cy="132" rx="22" ry="5"/><ellipse class="cr" cx="300" cy="138" rx="30" ry="5"/><ellipse class="cr" cx="150" cy="142" rx="16" ry="3.5"/>
  ${panels}
  <path class="dome" d="M140 112a34 30 0 0 1 68 0z"/><circle class="win" cx="160" cy="100" r="4.5"/><circle class="win" cx="174" cy="95" r="4.5"/><circle class="win" cx="188" cy="100" r="4.5"/>
  <rect class="mod" x="208" y="98" width="38" height="14" rx="3"/><circle class="win" cx="220" cy="105" r="3"/><circle class="win" cx="233" cy="105" r="3"/>
  <line x1="174" y1="82" x2="174" y2="64" stroke="#d9deee" stroke-width="2"/><circle class="beacon" cx="174" cy="62" r="3"/>
  <g class="rover"><rect x="40" y="116" width="18" height="7" rx="2" fill="#f4b942"/><rect x="46" y="111" width="7" height="5" fill="#c9922c"/><circle cx="44" cy="125" r="3" fill="#222"/><circle cx="54" cy="125" r="3" fill="#222"/></g>
  <g class="fxg fx-puff">${[0,1,2,3,4,5].map(i=>`<circle cx="${204+i*2}" cy="${96-i}" r="${3+i%3}" style="animation-delay:${i*.3}s"/>`).join('')}</g>
  <g class="fxg fx-dustg">${[0,1,2,3,4,5,6,7,8,9].map(i=>`<circle cx="${255+i*10}" cy="${88+(i%3)*8}" r="${1.6+(i%2)}" style="animation-delay:${i*.2}s"/>`).join('')}</g>
  <g class="fxg fx-stormg">${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<line x1="${i*34+8}" y1="${-10-(i%4)*12}" x2="${i*34+2}" y2="${-2-(i%4)*12}" style="animation-delay:${(i%5)*.25}s"/>`).join('')}<rect class="stormov" width="400" height="150"/></g>
  <g class="fxg fx-snow"><rect class="coldov" width="400" height="150"/>${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${20+i*52}" cy="-6" r="2" style="animation-delay:${i*.35}s"/>`).join('')}</g>
  <g class="fxg fx-ring"><circle cx="174" cy="62" r="4" style="animation-delay:0s"/><circle cx="174" cy="62" r="4" style="animation-delay:.5s"/><circle cx="174" cy="62" r="4" style="animation-delay:1s"/></g>
  <rect class="redov" width="400" height="150"/></svg>`;
}
