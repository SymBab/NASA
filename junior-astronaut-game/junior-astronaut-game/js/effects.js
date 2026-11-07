'use strict';
function showDayBanner(){
  if(!G)return;
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  G.hold=performance.now()+(reduce?0:1600);
  if(reduce)return;
  const old=document.getElementById('daybn');if(old)old.remove();
  const night=G.phase==='night';
  const el=document.createElement('div');el.id='daybn';el.className='daybn '+(night?'night':'day');el.setAttribute('role','status');
  el.innerHTML=`<div class="dbi">${ic(night?'moon':'sun')}</div><div class="dbt">วันที่ ${G.day} / ${G.days}</div><div class="dbs">${night?'คืนจันทร์ แผงโซลาร์ได้ไฟน้อยลง':'กลางวัน แสงอาทิตย์ส่องถึงฐาน'}</div>`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1700);
}
function celebrate(){
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!G||G.end!=='success')return;
  const box=document.createElement('div');box.className='confetti';box.setAttribute('aria-hidden','true');
  const cols=['#f4b942','#7bd88f','#ff8f80','#62c8ff','#d8a8ff'];
  for(let i=0;i<36;i++){const c=document.createElement('i');c.style.left=(Math.random()*100)+'%';c.style.background=cols[i%5];c.style.animationDelay=(Math.random()*1.2)+'s';c.style.animationDuration=(2.2+Math.random()*1.6)+'s';box.appendChild(c);}
  document.body.appendChild(box);setTimeout(()=>box.remove(),5200);
}
function countUp(){
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  document.querySelectorAll('[data-n]').forEach(el=>{
    const to=+el.dataset.n,suf=el.dataset.s||'',t0=performance.now();
    (function step(t){const f=Math.min(1,(t-t0)/900);el.textContent=Math.round(to*f)+suf;if(f<1)requestAnimationFrame(step);})(t0);
  });
}
let lastVals=null;
function animateMeters(){
  if(!G||!document.querySelector('.meter')){if(!G)lastVals=null;return;}
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const now={_g:G};RES.forEach(k=>now[k]=G[k]);
  if(lastVals&&lastVals._g===G&&!reduce){
    RES.forEach(k=>{
      const d=now[k]-lastVals[k];if(!d)return;
      const m=document.querySelector('.m-'+k);if(!m)return;
      const bar=m.querySelector('.bar>i'),n=m.querySelector('.n');
      const pct=v=>k==='research'?clamp(v/G.target*100,0,100):v;
      const fin=bar.style.width;
      bar.style.transition='none';bar.style.width=pct(lastVals[k])+'%';void bar.offsetWidth;bar.style.transition='';bar.style.width=fin;
      const from=lastVals[k],to=now[k],t0=performance.now();
      (function step(t){const f=Math.min(1,Math.max(0,(t-t0)/700));n.textContent=Math.round(from+(to-from)*f);if(f<1)requestAnimationFrame(step);})(t0);
      m.classList.add(d>0?'up':'down');setTimeout(()=>m.classList.remove('up','down'),1000);
      const fl=document.createElement('span');fl.className='fl '+(d>0?'up':'down');fl.textContent=(d>0?'+':'−')+Math.abs(d);m.appendChild(fl);setTimeout(()=>fl.remove(),1200);
    });
  }
  lastVals=now;
}
