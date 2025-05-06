(() => {
    const c = document.getElementById('birdCanvas'),
          ctx = c.getContext('2d'),
          cw = c.width, ch = c.height,
          R = 40;
  
    let birds, order, idx, score, highScore, mode, state, currentAudio;
    let modeBtns, backBtn, optionBtns;
  
    function shuffle(a) { return a.sort(() => Math.random() - 0.5); }
    function hitRect(x,y,b) { return x>=b.x && x<=b.x+b.w && y>=b.y && y<=b.y+b.h; }
    function hitCircle(x,y, cx,cy,r) { return Math.hypot(x-cx,y-cy)<=r; }
  
    async function init() {
      birds = (await fetch('birds.json').then(r=>r.json())).birds;
      highScore = +localStorage.getItem('highScore') || 0;
      state = 'mode';
  
      modeBtns = [
        { x:cw/2-120, y:200, w:240, h:60, label:'Guess by Song', m:'song' },
        { x:cw/2-120, y:300, w:240, h:60, label:'Guess by Image', m:'image' }
      ];
      backBtn = { x:20, y:20, w:80, h:30, label:'← Back' };
  
      c.addEventListener('click', onClick);
      showMode();
    }
  
    function showMode() {
      ctx.clearRect(0,0,cw,ch);
      ctx.font='28px sans-serif'; ctx.textAlign='center'; ctx.fillText('Choose Mode',cw/2,100);
      modeBtns.forEach(b=>{
        ctx.fillStyle='#007bff'; ctx.fillRect(b.x,b.y,b.w,b.h);
        ctx.fillStyle='#fff'; ctx.fillText(b.label, b.x+b.w/2, b.y+b.h/2+2);
      });
    }
  
    function start(m) {
      mode=m; score=0; idx=0; order=shuffle(birds.slice());
      state='game'; nextQ();
    }
  
    function nextQ() {
      stopAudio();
      ctx.clearRect(0,0,cw,ch);
      drawBack(); drawHeader();
      const b = order[idx];
      mode==='song' ? drawAudio() : drawImage(b);
      drawOptions(b);
    }
  
    function drawBack() {
      const b = backBtn;
      ctx.fillStyle='#555'; ctx.fillRect(b.x,b.y,b.w,b.h);
      ctx.fillStyle='#fff'; ctx.font='18px sans-serif'; ctx.textAlign='left';
      ctx.fillText(b.label, b.x+8, b.y+20);
    }
  
    function drawHeader() {
      ctx.font='20px sans-serif'; ctx.textAlign='left'; ctx.fillStyle='#333';
      ctx.fillText('High: '+highScore, 20, 70);
      ctx.textAlign='right'; ctx.fillText('Score: '+score, cw-20, 60);
      ctx.textAlign='center'; ctx.fillText('Guess this bird:',cw/2,100);
    }
  
    function drawAudio() {
      const x=cw/2, y=ch*0.45;
      ctx.beginPath(); ctx.arc(x,y,R,0,2*Math.PI); ctx.fillStyle='#eee'; ctx.fill();
      ctx.font='48px serif'; ctx.fillStyle='#333'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('🔊', x,y);
    }
  
    function drawImage(b) {
      const img=new Image();
      img.onload = () => {
        let maxW=cw*0.6, maxH=ch*0.5;
        let r=Math.min(maxW/img.width, maxH/img.height);
        let w=img.width*r, h=img.height*r;
        ctx.drawImage(img, (cw-w)/2,120, w,h);
      };
      img.src = b.image;
    }
  
    function drawOptions(correct) {
      optionBtns = [];
      let others = birds.filter(x=>x.id!==correct.id);
      shuffle(others);
      let choices = shuffle([correct, ...others.slice(0,3)]);
      let btnW=200, btnH=50, gap=20;
      let startX=(cw - (btnW*2+gap))/2, startY=ch*0.75;
  
      choices.forEach((b,i)=>{
        let col=i%2, row=(i/2|0);
        let x=startX + col*(btnW+gap), y=startY + row*(btnH+gap);
        optionBtns.push({x,y,w:btnW,h:btnH,id:b.id});
        ctx.fillStyle='#6c757d'; ctx.fillRect(x,y,btnW,btnH);
        ctx.fillStyle='#fff'; ctx.font='18px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(b.title, x+btnW/2, y+btnH/2);
      });
    }
  
    function onClick(e) {
      let r=c.getBoundingClientRect();
      let x=e.clientX-r.left, y=e.clientY-r.top;
  
      if(state==='mode') {
        modeBtns.forEach(b=>{ if(hitRect(x,y,b)) start(b.m); });
      } else {
        if(hitRect(x,y,backBtn)) { state='mode'; showMode(); return; }
        const cur = order[idx];
        if(mode==='song' && hitCircle(x,y,cw/2,ch*0.45,R)) { toggleAudio(cur.audio); return; }
        optionBtns.forEach(b=>{
          if(hitRect(x,y,b)){
            if(b.id===cur.id){
              score++;
              if(score>highScore){
                highScore=score; localStorage.setItem('highScore',highScore);
              }
            }
            idx++;
            if(idx<order.length) nextQ();
            else { stopAudio(); alert(`Game over! Score: ${score}`); state='mode'; showMode(); }
          }
        });
      }
    }
  
    function toggleAudio(src) {
      if(currentAudio && currentAudio.src.includes(src)){
        currentAudio.pause(); currentAudio=null;
        return;
      }
      if(currentAudio){ currentAudio.pause(); }
      currentAudio = new Audio(src);
      currentAudio.play();
    }
  
    function stopAudio(){
      if(currentAudio){ currentAudio.pause(); currentAudio=null; }
    }
  
    window.addEventListener('load', init);
  })();
  