'use strict';
let miniH=[],miniGen=0;
function miniClear(){miniGen++;miniH.forEach(h=>{clearTimeout(h);clearInterval(h);});miniH=[];}
const MECH={};
function startMini(){
  const m=G&&G.mini;if(!m)return;
  const area=document.getElementById('mgarea');if(!area)return;
  miniClear();
  const g=miniGen;let ended=false;
  const X={m,area,def:m.def,
    alive:()=>g===miniGen&&G&&G.screen==='mini'&&G.mini===m,
    cnt:h=>{const e=document.getElementById('mgcount');if(e)e.innerHTML=h;},
    fb:(t,c)=>{const e=document.getElementById('mgfb');if(e){e.className='mgfb '+(c||'');e.textContent=t;}},
    after:(ms,f)=>{miniH.push(setTimeout(()=>{if(X.alive())f();},ms));},
    every:(ms,f)=>{miniH.push(setInterval(()=>{if(X.alive())f();},ms));},
    frame:f=>{let last=performance.now();const loop=t=>{if(!X.alive())return;const dt=Math.min(0.1,(t-last)/1000);last=t;f(dt,t);requestAnimationFrame(loop);};requestAnimationFrame(loop);},
    end:sc=>{if(ended)return;ended=true;X.fb('ผลมินิเกม: '+SCORE_TXT[sc],sc?'ok':'no');X.after(800,()=>{finishMini(sc);render();});},
    shuffle:a=>a.sort(()=>rnd()-0.5),
    ic:(n,c)=>`<svg class="ic" aria-hidden="true"${c?` style="color:${c}"`:''}><use href="#i-${n}"/></svg>`
  };
  MECH[m.def.kind](X);
}
/* แตะเป้า: ฝุ่น/จุดรั่ว ที่ผุดขึ้นแล้วหายไป */
MECH.tap=X=>{
  const th=THEME[X.def.theme],N=8,W=X.area.clientWidth||300,H=X.area.clientHeight||230,cols=4,rows=2;
  const cells=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)cells.push([r,c]);X.shuffle(cells);
  let hits=0,done=0;
  const upd=()=>X.cnt('<span>แตะได้ <b>'+hits+'</b> / '+N+'</span><span>'+th.name+'</span>');upd();
  cells.slice(0,N).forEach((cell,i)=>{
    const cw=W/cols,ch=H/rows;
    const x=Math.max(2,Math.min(W-54,cell[1]*cw+rnd()*(cw-52))),y=Math.max(2,Math.min(H-54,cell[0]*ch+rnd()*(ch-52)));
    X.after(i*650,()=>{
      const b=document.createElement('button');b.className='tgt';b.style.left=x+'px';b.style.top=y+'px';b.style.setProperty('--tc',th.color);
      b.setAttribute('aria-label','แตะ '+th.name);b.innerHTML=X.ic(th.icon);
      let over=false;
      const gone=ok=>{if(over)return;over=true;if(ok)hits++;done++;b.classList.add('gone');setTimeout(()=>b.remove(),300);upd();if(done>=N)X.end(hits>=7?2:hits>=4?1:0);};
      b.addEventListener('click',()=>gone(true));
      X.after(2300,()=>gone(false));
      X.area.appendChild(b);
    });
  });
};
/* ถูฝุ่น: ลากผ่านฝุ่นให้สะอาด */
MECH.wipe=X=>{
  const a=X.area,W=a.clientWidth||300,H=a.clientHeight||230,cols=8,rows=4,cw=W/cols,ch=H/rows;
  a.style.touchAction='none';a.style.background=X.def.bg||'';a.style.cursor='crosshair';
  const cells=[];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const d=document.createElement('div');d.className='dust';d.style.cssText=`left:${c*cw}px;top:${r*ch}px;width:${cw}px;height:${ch}px`;a.appendChild(d);cells.push({d,x:c*cw+cw/2,y:r*ch+ch/2,on:true});}
  let left=cells.length;const total=left;let t=9,over=false;
  const upd=()=>X.cnt(`<span>ฝุ่นที่เหลือ <b>${Math.round(left/total*100)}%</b></span><span>เวลา <b>${t}</b> วิ</span>`);
  const finish=()=>{if(over)return;over=true;const f=1-left/total;X.end(f>=.85?2:f>=.5?1:0);};
  const clear=(px,py)=>{if(over)return;cells.forEach(c=>{if(c.on&&Math.hypot(c.x-px,c.y-py)<46){c.on=false;c.d.classList.add('clean');left--;}});upd();if(left<=0)finish();};
  const h=e=>{const r=a.getBoundingClientRect();clear(e.clientX-r.left,e.clientY-r.top);};
  a.addEventListener('pointerdown',h);a.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')h(e);});
  upd();X.every(1000,()=>{t--;upd();if(t<=0)finish();});
};
/* เติม: กดค้างเพื่อเติมน้ำ/ความร้อน ปล่อยให้อยู่ในแถบ */
MECH.fill=X=>{
  const a=X.area;a.style.display='flex';a.style.flexDirection='column';a.style.alignItems='center';a.style.gap='8px';a.style.padding='8px';
  a.innerHTML=`<div class="tank"><div class="band" id="bd"><span>พอดี</span></div><div class="lvl" id="lv" style="background:${X.def.col}"></div></div><button class="btn big" id="hold" style="width:100%">กดค้างเพื่อ${X.def.verb}</button>`;
  const bd=a.querySelector('#bd'),lv=a.querySelector('#lv'),btn=a.querySelector('#hold');
  let round=0,hits=0,level=0,down=false,locked=false,lo=0;const BH=22;
  const setBand=()=>{lo=30+rnd()*(100-BH-34);bd.style.bottom=lo+'%';bd.style.height=BH+'%';level=0;lv.style.height='0%';};
  const upd=()=>X.cnt(`<span>ถังที่ <b>${Math.min(round+1,2)}</b> / 2</span><span>พอดี <b>${hits}</b></span>`);
  const settle=hit=>{
    locked=true;down=false;if(hit)hits++;round++;
    X.fb(hit?'พอดี!':(level>=100?'ล้น!':'ยังไม่พอดี'),hit?'ok':'no');upd();
    if(round>=2){X.end(hits>=2?2:hits>=1?1:0);return;}
    X.after(800,()=>{locked=false;X.fb('');setBand();});
  };
  const press=()=>{if(!locked)down=true;};
  const release=()=>{if(!down||locked)return;down=false;if(level<4)return;settle(level>=lo&&level<=lo+BH);};
  btn.addEventListener('pointerdown',e=>{e.preventDefault();press();});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,release));
  btn.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();press();}});
  btn.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();release();}});
  setBand();upd();
  X.frame(dt=>{if(down&&!locked){level=Math.min(100,level+dt*48);lv.style.height=level+'%';if(level>=100)settle(false);}});
};
/* เรียงต้นกล้าจากเตี้ยไปสูง */
MECH.order=X=>{
  const a=X.area;a.style.display='flex';a.style.alignItems='flex-end';a.style.justifyContent='space-around';a.style.padding='10px 6px';
  const hs=X.shuffle([32,58,84,110,136]);let next=0,mist=0,over=false;
  const sorted=[...hs].sort((p,q)=>p-q);
  const upd=()=>X.cnt(`<span>เรียงถูก <b>${next}</b> / 5</span><span>ผิด <b>${mist}</b></span>`);
  const finish=()=>{if(over)return;over=true;const full=next>=5;X.end(full?(mist===0?2:mist<=2?1:0):(next>=3&&mist<=2?1:0));};
  hs.forEach(h=>{
    const b=document.createElement('button');b.className='oit';b.setAttribute('aria-label','ต้นกล้า');
    b.innerHTML=`${X.ic('leaf','#7bd88f')}<span class="stem" style="height:${h}px"></span>`;
    b.addEventListener('click',()=>{
      if(over||b.disabled)return;
      if(h===sorted[next]){b.disabled=true;b.classList.add('ok');next++;}
      else{mist++;b.classList.remove('bad');void b.offsetWidth;b.classList.add('bad');}
      upd();if(next>=5)finish();
    });
    a.appendChild(b);
  });
  upd();X.after(14000,finish);
};
/* ค้นหาแหล่งรังสี: ร้อน/อุ่น/เย็น */
MECH.hunt=X=>{
  const a=X.area,cols=6,rows=4,MAX=6;a.style.display='grid';a.style.gridTemplateColumns=`repeat(${cols},1fr)`;a.style.gridTemplateRows=`repeat(${rows},1fr)`;a.style.gap='4px';a.style.padding='6px';
  const sr=Math.floor(rnd()*rows),sc=Math.floor(rnd()*cols);let used=0,over=false;
  const upd=()=>X.cnt(`<span>ตรวจแล้ว <b>${used}</b> / ${MAX}</span><span>ร้อน = ใกล้แหล่งรังสี</span>`);
  const cell=[];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const b=document.createElement('button');b.className='hcell';b.setAttribute('aria-label','ตรวจช่อง');
    b.addEventListener('click',()=>{
      if(over||b.disabled)return;b.disabled=true;used++;
      const d=Math.max(Math.abs(r-sr),Math.abs(c-sc));
      if(d===0){b.classList.add('src');b.innerHTML=X.ic('trefoil');over=true;upd();X.end(used<=3?2:1);return;}
      b.classList.add(d===1?'hot':d===2?'warm':'cold');b.textContent=d===1?'ร้อน':d===2?'อุ่น':'เย็น';
      upd();
      if(used>=MAX){over=true;cell[sr*cols+sc].classList.add('src');cell[sr*cols+sc].innerHTML=X.ic('trefoil');X.end(0);}
    });
    a.appendChild(b);cell.push(b);
  }
  upd();
};
/* คัดแยก: แตะเฉพาะชิ้นที่ถูกต้อง */
MECH.triage=X=>{
  const a=X.area,cols=X.def.cols||4,items=X.shuffle(X.def.items());
  a.style.display='grid';a.style.gridTemplateColumns=`repeat(${cols},1fr)`;a.style.gap='6px';a.style.padding='6px';a.style.height='auto';a.style.minHeight='230px';
  const G_=items.filter(i=>i.good).length;let ok=0,mist=0,over=false,t=12;
  const upd=()=>X.cnt(`<span>ถูก <b>${ok}</b> / ${G_}</span><span>ผิด <b>${mist}</b> · เวลา <b>${t}</b> วิ</span>`);
  const finish=full=>{if(over)return;over=true;X.end(full?(mist===0?2:mist<=2?1:0):(ok>=Math.ceil(G_*0.6)&&mist<=2?1:0));};
  items.forEach(it=>{
    const b=document.createElement('button');b.className='tri';b.setAttribute('aria-label',it.t||it.al||'ชิ้นนี้');
    b.innerHTML=`<span class="tg" style="color:${it.col||'#fff'}">${X.ic(it.ic)}${it.m?`<i>${it.m}</i>`:''}</span>${it.t?`<span class="tl">${it.t}</span>`:''}`;
    b.addEventListener('click',()=>{
      if(over||b.disabled)return;b.disabled=true;
      if(it.good){ok++;b.classList.add('ok');}else{mist++;b.classList.add('bad');}
      upd();if(ok>=G_)finish(true);
    });
    a.appendChild(b);
  });
  upd();X.every(1000,()=>{t--;upd();if(t<=0)finish(false);});
};
/* รับอนุภาครังสีด้วยเกราะ */
MECH.catch=X=>{
  const a=X.area,W=a.clientWidth||300,H=a.clientHeight||230,SW=76;a.style.touchAction='none';a.style.cursor='ew-resize';
  const sh=document.createElement('div');sh.className='shd';sh.style.width=SW+'px';a.appendChild(sh);
  let sx=W/2;const place=()=>{sx=Math.max(SW/2,Math.min(W-SW/2,sx));sh.style.left=(sx-SW/2)+'px';};place();
  const mv=e=>{const r=a.getBoundingClientRect();sx=e.clientX-r.left;place();};
  a.addEventListener('pointerdown',mv);a.addEventListener('pointermove',mv);
  const kd=e=>{if(!X.alive()){document.removeEventListener('keydown',kd);return;}if(e.key==='ArrowLeft'){sx-=34;place();e.preventDefault();}if(e.key==='ArrowRight'){sx+=34;place();e.preventDefault();}};
  document.addEventListener('keydown',kd);
  const TOTAL=18;let spawned=0,blocked=0,missed=0;const ps=[];
  const upd=()=>X.cnt(`<span>กันได้ <b>${blocked}</b> / ${TOTAL}</span><span>หลุด <b>${missed}</b></span>`);upd();
  X.every(480,()=>{if(spawned>=TOTAL)return;spawned++;const el=document.createElement('div');el.className='prt';el.innerHTML=X.ic('trefoil');const x=14+rnd()*(W-28);el.style.left=(x-9)+'px';a.appendChild(el);ps.push({el,x,y:-14,v:120+rnd()*50});});
  X.frame(dt=>{
    for(let i=ps.length-1;i>=0;i--){
      const p=ps[i];p.y+=p.v*dt;p.el.style.top=p.y+'px';
      if(p.y>=H-28&&Math.abs(p.x-sx)<=SW/2+6){blocked++;p.el.remove();ps.splice(i,1);upd();}
      else if(p.y>=H-6){missed++;p.el.remove();ps.splice(i,1);upd();}
    }
    if(spawned>=TOTAL&&!ps.length){const f=blocked/TOTAL;X.end(f>=.8?2:f>=.5?1:0);}
  });
};
/* ตามเป้าหมายที่เคลื่อนที่ด้วยแถบเลื่อน: หันแผงตามดวงอาทิตย์ / จูนสัญญาณ */
MECH.track=X=>{
  const a=X.area,W=a.clientWidth||300;
  const tgIcon=X.def.tg==='sun'?'<span class="tgsun"></span>':X.ic('signal');
  a.innerHTML=`<div class="trk"><div class="tgt2" id="tg">${tgIcon}</div><div class="beam" id="bm"></div><div class="dv" id="dv">${X.def.dv==='panel'?SW_PANEL:SW_DISH}</div></div><input type="range" id="sl" min="0" max="100" value="50" aria-label="เลื่อนเพื่อตามเป้าหมาย" class="slr">`;
  const tg=a.querySelector('#tg'),dv=a.querySelector('#dv'),bm=a.querySelector('#bm'),sl=a.querySelector('#sl');
  const ph=rnd()*6;let t=0,good=0;const DUR=9;
  X.frame(dt=>{
    t+=dt;const pos=Math.max(0.08,Math.min(0.92,0.5+0.36*Math.sin(t*0.8+ph)+0.1*Math.sin(t*1.9+ph*2)));
    const s=sl.value/100*0.84+0.08;const ok=Math.abs(s-pos)<0.09;if(ok)good+=dt;
    tg.style.left=(pos*100)+'%';dv.style.left=(s*100)+'%';bm.style.left=(s*100)+'%';bm.classList.toggle('on',ok);
    X.cnt(`<span>ตรงเป้า <b>${Math.round(good/Math.max(t,0.1)*100)}%</b></span><span>เหลือ <b>${Math.max(0,Math.ceil(DUR-t))}</b> วิ</span>`);
    if(t>=DUR){const f=good/DUR;X.end(f>=.65?2:f>=.35?1:0);}
  });
};
/* จำลำดับไฟแล้วกดตาม */
MECH.memory=X=>{
  const a=X.area;a.style.display='grid';a.style.gridTemplateColumns='1fr 1fr';a.style.gap='8px';a.style.padding='8px';
  const P=[['bolt','#f4b942'],['leaf','#7bd88f'],['heart','#ff8f80'],['flask','#62c8ff']];
  const seq=[0,0,0,0].map(()=>Math.floor(rnd()*4));let phase='show',idx=0,reached=0;const pads=[];
  P.forEach((p,i)=>{const b=document.createElement('button');b.className='pad';b.style.setProperty('--pc',p[1]);b.setAttribute('aria-label','ปุ่ม '+(i+1));b.innerHTML=X.ic(p[0]);
    b.addEventListener('click',()=>{
      if(phase!=='in')return;flash(i,250);
      if(i===seq[idx]){idx++;reached=idx;upd();if(idx>=seq.length){phase='done';X.end(2);}}
      else{phase='done';X.end(reached>=2?1:0);}
    });a.appendChild(b);pads.push(b);});
  const flash=(i,ms)=>{pads[i].classList.add('lit');setTimeout(()=>pads[i].classList.remove('lit'),ms);};
  const upd=()=>X.cnt(phase==='show'?'<span>ดูลำดับไฟให้ดี</span>':`<span>กดตามลำดับ <b>${idx}</b> / ${seq.length}</span>`);
  upd();
  seq.forEach((v,k)=>X.after(900+k*800,()=>flash(v,520)));
  X.after(900+seq.length*800+300,()=>{phase='in';upd();X.fb('ถึงตาคุณ');});
};
