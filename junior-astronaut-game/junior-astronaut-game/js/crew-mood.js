'use strict';
function moodOf(c){
  let v;
  if(c==='ton')v=G.power;else if(c==='ploy')v=G.food;else if(c==='phum')v=G.health;
  else{
    const len=DAY_END-DAY_START;
    const frac=((G.day-1)*len+Math.max(0,G.clock-DAY_START))/(G.days*len);
    v=frac<0.1?100:Math.min(100,(G.research/G.target)/frac*100);
  }
  const lv=v>=60?0:v>=30?1:2;
  return {lv,text:CREW[c].moods[lv]};
}
function reaction(applied,hit){
  const who={power:'ton',food:'ploy',health:'phum',research:'mintra'};
  let worst=null,wv=0;
  RES.forEach(k=>{if(applied[k]<wv){wv=applied[k];worst=k;}});
  let c,tone;
  if(!worst){c='mintra';tone='ok';}
  else{c=who[worst];tone=(wv<=-10||hit)?'bad':'ok';}
  if((applied.research||0)>=8&&tone!=='bad'){c='mintra';tone='good';}
  const L=REACT[c][tone]||REACT[c].ok;
  return [c,L[Math.floor(rnd()*L.length)]];
}
function diary(){
  const low=[['power','ไฟ'],['food','อาหาร'],['health','สุขภาพของทุกคน']].sort((a,b)=>G[a[0]]-G[b[0]])[0];
  if(G[low[0]]<25)return 'วันนี้หนักมากเลย '+low[1]+'เหลือน้อยมาก พรุ่งนี้เราต้องแก้เรื่องนี้ให้ได้';
  if(G.research/G.target>=G.day/G.days)return 'งานวิจัยคืบหน้าดี ทุกคนเหนื่อยแต่ภูมิใจ ขอบคุณที่ช่วยกันนะ';
  return 'วันนี้ผ่านไปได้ ฐานยังปลอดภัย แต่งานวิจัยเริ่มช้ากว่าที่ตั้งใจ พรุ่งนี้ต้องเร่งหน่อย';
}
