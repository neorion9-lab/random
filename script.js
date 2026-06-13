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
  const numPicksInput = document.getElementById('num-picks');
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
    numPicksInput.value = numPicks;
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

  saveSettingsBtn.addEventListener('click', () => {
    const newTotal = parseInt(totalStudentsInput.value, 10);
    const newPicks = parseInt(numPicksInput.value, 10);
    
    if (isNaN(newTotal) || newTotal < 1) {
      alert("총 학생 수를 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(newPicks) || newPicks < 1 || newPicks > newTotal) {
      alert("뽑을 인원 수를 올바르게 입력해주세요 (총 학생 수보다 작거나 같아야 합니다).");
      return;
    }

    totalStudents = newTotal;
    numPicks = newPicks;

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

    // Animate drawing balls
    for (let i = 0; i < winners.length; i++) {
      const targetNumber = winners[i];
      
      await new Promise(resolve => setTimeout(resolve, 1200)); 
      
      const targetBall = balls.find(b => b.dataset.number == targetNumber);
      if (targetBall) {
        balls = balls.filter(b => b !== targetBall);
        ballTray.appendChild(targetBall);
      }
    }

    clearInterval(shakeInterval);
    isSpinning = false;
    startBtn.disabled = false;
  });
});
