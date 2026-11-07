'use strict';
let timer=null;
function startTimer(){
  if(timer)clearInterval(timer);
  timer=setInterval(()=>{
    if(!G||G.screen!=='play'||G.paused||document.hidden)return;
    if(G.hold&&performance.now()<G.hold)return;
    const bf=G.feed.length;
    advance(SPEEDS[G.speed].m);
    if(G.screen!=='play'){render();return;}
    updateClock();
    if(G.feed.length!==bf)renderFeed();
  },TICK_MS);
}
startTimer();
