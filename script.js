// playful interactive logic
const yes = document.getElementById('yes');
const no = document.getElementById('no');
const buttons = document.getElementById('buttons');
const confetti = document.getElementById('confetti');
const sweetAudio = new Audio('./sweet.mp3');
const loveAudio = new Audio('./love.mp3');
let moveCount = 0;

// --- Tap to Start overlay logic ---
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
let gameEnabled = false;

function enableGame() {
  startOverlay.classList.add('hide');
  setTimeout(() => startOverlay.style.display = 'none', 600);
  gameEnabled = true;
}

startBtn.addEventListener('click', enableGame);

// Block all game logic until started
function moveNoButton(e) {
  if (!gameEnabled) return;
  moveCount++;
  // Play sound on every interaction (now always inside a real event handler)
  try {
    sweetAudio.currentTime = 0;
    sweetAudio.play();
  } catch (err) {}
  // Increase movement on mobile (touch)
  let dx, dy;
  if (e && (e.type === 'touchstart' || window.innerWidth < 600)) {
    dx = (Math.random() - 0.5) * Math.min(400, 120 + moveCount * 30);
    dy = (Math.random() - 0.5) * Math.min(300, 80 + moveCount * 20);
  } else {
    dx = (Math.random() - 0.5) * Math.min(240, 60 + moveCount * 20);
    dy = (Math.random() - 0.5) * Math.min(160, 30 + moveCount * 15);
  }
  no.style.transform = `translate(${dx}px, ${dy}px)`;
  // occasionally swap positions with yes
  if (Math.random() < 0.25) {
    buttons.insertBefore(no, yes);
  }
  // prevent default event if possible
  if (e) e.preventDefault();
}

['mouseenter','focus','touchstart','mousedown'].forEach(evt => {
  no.addEventListener(evt, moveNoButton);
});

// if user manages to click No (should be impossible), nudge back to Yes flow
no.addEventListener('click', (e) => {
  if (!gameEnabled) return;
  e.preventDefault();
 
  alert("Nice try 😏 But the answer has to be YES!");
  resetNo();
});

function resetNo(){
  no.style.transform = '';
  buttons.appendChild(no);
}

// yes button celebration
yes.addEventListener('click', () => {
  if (!gameEnabled) return;
  showConfetti();
  yes.textContent = "She said YES! 💖";
  try {
    loveAudio.currentTime = 0;
    loveAudio.play();
  } catch (err) {}
  document.body.style.background = 'url("img.jpeg") center center/cover no-repeat fixed';
  yes.disabled = true;
  no.disabled = true;
});

// simple confetti
function showConfetti(){
  for(let i=0;i<40;i++){
    const el = document.createElement('div');
    el.className = 'c';
    el.style.position='absolute';
    el.style.left = (Math.random()*100)+'%';
    el.style.top = '-10%';
    el.style.width = '8px';
    el.style.height = '12px';
    el.style.background = randomColor();
    el.style.opacity = '0.95';
    el.style.borderRadius='2px';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.transition = 'transform 3s linear, top 3s linear, left 3s linear, opacity 2s linear';
    confetti.appendChild(el);
    // animate
    requestAnimationFrame(()=>{
      el.style.top = (80 + Math.random()*40) + '%';
      el.style.left = (Math.random()*100) + '%';
      el.style.transform = `translateY(0) rotate(${Math.random()*720}deg)`;
      el.style.opacity = '0';
    });
    // remove later
    setTimeout(()=>el.remove(), 3500);
  }
}

function randomColor(){
  const colors = ['#ff4d9e','#ffd166','#73e6a7','#7cc0ff','#b39cff'];
  return colors[Math.floor(Math.random()*colors.length)];
}

// small playful autoswitch to avoid keyboard focus selecting No
no.addEventListener('focus', () => {
  setTimeout(()=>yes.focus(), 60);
});

// ensure initial focus
yes.focus();

