document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const appTitle = document.getElementById('app-title');
  const settingsBtn = document.getElementById('settings-btn');
  const glassGlobe = document.getElementById('glass-globe');
  const ballTray = document.getElementById('ball-tray');
  const startBtn = document.getElementById('start-btn');
  
  // Modal Elements
  const secretModal = document.getElementById('secret-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  
  // Inputs
  const totalStudentsInput = document.getElementById('total-students');
  const secretSequenceInput = document.getElementById('secret-sequence');

  // Student Name Inputs
  const newStudentNumInput = document.getElementById('new-student-num');
  const newStudentNameInput = document.getElementById('new-student-name');
  const addStudentBtn = document.getElementById('add-student-btn');
  const studentListEl = document.getElementById('student-list');

  // State
  let totalStudents = 20;
  let numPicks = 3;
  let secretSequence = [];
  let studentMap = {}; // { "1": "홍길동", "2": "김철수" }
  let isSpinning = false;
  let balls = [];
  let shakeInterval = null;

  // Helpers
  function numberToKorean(str) {
    const num = parseInt(str, 10);
    if (isNaN(num)) return str; // return original if it's a name
    
    const units = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
    const tens = ["", "십", "이십", "삼십", "사십", "오십", "육십", "칠십", "팔십", "구십"];
    if (num === 100) return "백";
    
    const t = Math.floor(num / 10);
    const u = num % 10;
    return (t === 1 ? "십" : tens[t]) + units[u];
  }

  function speak(text, rate = 0.8, pitch = 1.0) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech to avoid overlapping
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = rate; // Slower for clear pronunciation
      utterance.pitch = pitch;
      window.speechSynthesis.speak(utterance);
    }
  }

  function playTensionBGM(durationMs) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const duration = durationMs / 1000;
    
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + duration);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.4, ctx.currentTime + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  function playFanfare() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTone = (freq, startTime, duration, type='triangle') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + startTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };
    
    // C4, E4, G4, C5 fanfare
    playTone(261.63, 0, 0.15, 'square'); 
    playTone(329.63, 0.15, 0.15, 'square');
    playTone(392.00, 0.3, 0.15, 'square');
    playTone(523.25, 0.45, 0.6, 'square');
    
    // Visual fanfare
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // Initialize balls on load
  initBalls();

  // 1. Settings Modal Logic
  settingsBtn.addEventListener('click', () => {
    openModal();
  });

  function openModal() {
    secretModal.classList.remove('hidden');
    // Load current state into inputs
    totalStudentsInput.value = totalStudents;
    secretSequenceInput.value = secretSequence.join(',');
    renderStudentList();
  }

  function renderStudentList() {
    studentListEl.innerHTML = '';
    const entries = Object.entries(studentMap).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    
    if (entries.length === 0) {
      studentListEl.innerHTML = '<li style="color: #888; font-size: 0.9rem; justify-content: center;">등록된 학생 이름이 없습니다.</li>';
      return;
    }

    entries.forEach(([num, name]) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${num}번 - ${name}</span> <button class="remove-student-btn" data-num="${num}">&times;</button>`;
      studentListEl.appendChild(li);
    });

    // Add remove listeners
    document.querySelectorAll('.remove-student-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const numToRemove = e.target.getAttribute('data-num');
        delete studentMap[numToRemove];
        renderStudentList();
      });
    });
  }

  addStudentBtn.addEventListener('click', () => {
    const num = parseInt(newStudentNumInput.value, 10);
    const name = newStudentNameInput.value.trim();

    if (isNaN(num) || num < 1) {
      alert('올바른 학생 번호를 입력해주세요.');
      return;
    }
    if (!name) {
      alert('학생 이름을 입력해주세요.');
      return;
    }

    studentMap[num] = name;
    newStudentNumInput.value = '';
    newStudentNameInput.value = '';
    newStudentNumInput.focus();
    renderStudentList();
  });

  function closeModal() {
    secretModal.classList.add('hidden');
  }

  closeModalBtn.addEventListener('click', closeModal);

  // 1.5 Pick Count Buttons Logic
  const pickBtns = document.querySelectorAll('.pick-btn');
  pickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pickBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      numPicks = parseInt(btn.dataset.val, 10);
    });
  });

  saveSettingsBtn.addEventListener('click', () => {
    const newTotal = parseInt(totalStudentsInput.value, 10);
    
    if (isNaN(newTotal) || newTotal < 1) {
      alert("총 학생 수를 올바르게 입력해주세요.");
      return;
    }
    
    // Check if current numPicks is valid against new total
    if (numPicks > newTotal) {
      alert("현재 선택된 뽑을 인원 수가 총 학생 수보다 많습니다. 다시 선택해주세요.");
      // Optional: auto-adjust numPicks
      // numPicks = newTotal;
      // pickBtns.forEach(b => {
      //   if (parseInt(b.dataset.val, 10) === numPicks) b.classList.add('active');
      //   else b.classList.remove('active');
      // });
    }

    totalStudents = newTotal;

    const seqStr = secretSequenceInput.value.trim();
    if (seqStr) {
      const parsedSeq = seqStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parsedSeq.length !== numPicks) {
        alert("비밀 순서의 개수와 뽑을 인원 수가 일치하지 않습니다. 다시 확인해주세요.");
        return;
      }
      // Check if any number in sequence exceeds total students
      if (parsedSeq.some(n => n > totalStudents || n < 1)) {
        alert("비밀 순서에 학생 수 범위를 벗어난 번호가 있습니다.");
        return;
      }
      secretSequence = parsedSeq;
    } else {
      secretSequence = [];
    }

    initBalls();
    closeModal();
  });

  // 2. Lottery Machine Logic
  function initBalls() {
    glassGlobe.innerHTML = '';
    ballTray.innerHTML = '';
    balls = [];
    const colors = ['#FF1493', '#FF9500', '#FFD60A', '#34C759', '#32ADE6', '#007AFF', '#AF52DE', '#FF2D55'];

    for (let i = 1; i <= totalStudents; i++) {
      const ball = document.createElement('div');
      ball.className = 'ball';
      
      const displayName = studentMap[i];
      if (displayName) {
        ball.textContent = displayName;
        ball.style.fontSize = displayName.length > 3 ? '0.7rem' : '0.9rem';
      } else {
        ball.textContent = i;
      }
      
      ball.dataset.number = i; // Save number for drawing logic
      ball.style.backgroundColor = colors[(i - 1) % colors.length];
      
      // Random position inside the circle
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 110; 
      const centerX = 150 - 22.5; 
      const centerY = 150 - 22.5;
      
      ball.style.left = `${centerX + Math.cos(angle) * radius}px`;
      ball.style.top = `${centerY + Math.sin(angle) * radius}px`;
      
      glassGlobe.appendChild(ball);
      balls.push(ball);
    }
  }

  function generateRandomNumber() {
    return Math.floor(Math.random() * totalStudents) + 1;
  }

  function getWinners() {
    if (secretSequence && secretSequence.length === numPicks) {
      return [...secretSequence]; 
    }

    const winners = new Set();
    while (winners.size < numPicks) {
      winners.add(generateRandomNumber());
    }
    return Array.from(winners);
  }

  startBtn.addEventListener('click', async () => {
    if (isSpinning) return;
    isSpinning = true;
    startBtn.disabled = true;

    speak("두근두근! 뽑기 시작!");

    initBalls(); // Reset for new draw
    const winners = getWinners();

    // Shaking animation
    shakeInterval = setInterval(() => {
      balls.forEach(ball => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 110;
        const centerX = 150 - 22.5;
        const centerY = 150 - 22.5;
        ball.style.left = `${centerX + Math.cos(angle) * radius}px`;
        ball.style.top = `${centerY + Math.sin(angle) * radius}px`;
      });
    }, 150);

    // Tension BGM for 5 seconds
    playTensionBGM(5000);
    
    // Wait 5 seconds before drawing
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Animate drawing balls
    for (let i = 0; i < winners.length; i++) {
      const targetNumber = winners[i];
      
      await new Promise(resolve => setTimeout(resolve, 1200)); 
      
      const targetBall = balls.find(b => b.dataset.number == targetNumber);
      if (targetBall) {
        balls = balls.filter(b => b !== targetBall);
        ballTray.appendChild(targetBall);
        const spokenName = numberToKorean(targetBall.textContent);
        speak(spokenName + "번!"); // Read the text (number or name)
      }
    }

    clearInterval(shakeInterval);
    isSpinning = false;
    startBtn.disabled = false;
    
    // Give a small delay before fanfare so the last name is spoken
    setTimeout(() => {
      playFanfare();
      // Wait for fanfare to finish before speaking "축하합니다!"
      setTimeout(() => {
        speak("축하합니다!");
      }, 1200);
    }, 1000);
  });
});
