'use strict';
function feedHtml(){
  const f=G.feed.slice(-5).reverse();
  return f.map((x,i)=>bubble(x.who,x.text,x.t).replace('class="bubble','class="bubble'+(i===0?' in':''))).join('')||'<p class="muted">ยังไม่มีข้อความ</p>';
}
function clockHtml(ctrl){
  const frac=clamp((G.clock-DAY_START)/(DAY_END-DAY_START),0,1);
  const stop=G.screen==='event'||G.screen==='eventResult'||G.screen==='activity'||G.screen==='mini';
  const st=stop?(G.screen==='activity'?'หยุดเวลา: ถึงช่วงเลือกกิจกรรม':G.screen==='mini'?'หยุดเวลา: มินิเกม':'หยุดเวลา: มีเหตุการณ์ฉุกเฉิน'):(G.screen==='summary'?'สิ้นวันแล้ว':(G.paused?'หยุดเวลาชั่วคราว':'เวลากำลังเดิน'));
  const ctl=ctrl?`<div class="ctrl"><button class="btn ghost" data-act="pause" aria-pressed="${G.paused}">${G.paused?'เดินเวลาต่อ':'หยุดเวลา'}</button>
    <span class="seg" role="group" aria-label="ความเร็วเวลา">${Object.keys(SPEEDS).map(k=>`<button data-act="speed" data-v="${k}" aria-pressed="${G.speed===k}">${SPEEDS[k].n}</button>`).join('')}</span></div>`:'';
  return `<div class="clock${stop?' stop':''}"><div class="ct"><span class="time" id="ctime">${fmt(G.clock)}</span><span class="cs" id="cstate">${st}</span></div>
    <div class="bar" aria-hidden="true"><i id="cbar" style="width:${frac*100}%"></i></div><div class="cm"><span>06:00</span><span>22:00 สิ้นวัน</span></div>${ctl}</div>`;
}
function updateClock(){
  const t=$('#ctime');if(!t)return;
  t.textContent=fmt(G.clock);
  const ff=clamp((G.clock-DAY_START)/(DAY_END-DAY_START),0,1);
  $('#cbar').style.width=ff*100+'%';
  const su=$('#sun');if(su){const p=sunXY(ff);su.setAttribute('transform','translate('+p[0].toFixed(1)+','+p[1].toFixed(1)+')');}
}
function renderFeed(){const f=$('#feed');if(f)f.innerHTML=feedHtml();}
