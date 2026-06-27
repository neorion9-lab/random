// ============================
// 🔐 ETHICS GATE LOGIC
// ============================
(function () {
  const STORAGE_KEY = 'ethics_agreed_v1';
  const gate = document.getElementById('ethics-gate');
  const agreeBtn = document.getElementById('ethics-agree-btn');
  const scrollArea = document.getElementById('ethics-scroll-area');
  const scrollHint = document.getElementById('scroll-hint');

  // 이미 동의한 경우 → 바로 게이트 숨김
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    gate.classList.add('hidden');
    return;
  }

  // 스크롤 감지 → 끝까지 내려야 버튼 활성화
  function checkScroll() {
    const threshold = 30; // px 여유
    const isAtBottom = scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - threshold;
    if (isAtBottom) {
      agreeBtn.disabled = false;
      scrollHint.classList.add('hidden');
      scrollArea.removeEventListener('scroll', checkScroll);
    }
  }

  scrollArea.addEventListener('scroll', checkScroll);
  // 혹시 내용이 짧아서 스크롤이 필요 없을 때 즉시 체크
  setTimeout(checkScroll, 300);

  // 동의 버튼 클릭 → localStorage 저장 + 페이드아웃
  agreeBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    gate.classList.add('fade-out');
    setTimeout(() => {
      gate.classList.add('hidden');
    }, 650);
  });
})();

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

  // Policy Modal Elements
  const policyModal = document.getElementById('policy-modal');
  const policyModalTitle = document.getElementById('policy-modal-title');
  const policyModalBody = document.getElementById('policy-modal-body');
  const closePolicyBtn = document.getElementById('close-policy-btn');
  const confirmPolicyBtn = document.getElementById('confirm-policy-btn');
  
  const footerTermsBtn = document.getElementById('footer-terms-btn');
  const footerPrivacyBtn = document.getElementById('footer-privacy-btn');

  // 📝 HTML content for terms and privacy policy (based on MD file)
  const termsHTML = `
    <h1>두근두근 발표뽑기 서비스 이용약관</h1>
    <p>본 이용약관은 '두근두근 발표뽑기'가 제공하는 교육용 웹 애플리케이션 서비스의 이용에 관한 사항을 규정합니다.</p>
    
    <h2>제1조 (목적)</h2>
    <p>이 약관은 본 서비스가 제공하는 무료 교육용 웹 애플리케이션 서비스(이하 '서비스')를 이용함에 있어 서비스 제공자와 이용자의 권리의무 및 책임사항을 규정함을 목적으로 합니다.</p>
    
    <h2>제2조 (정의)</h2>
    <ol>
      <li>'서비스'란 '두근두근 발표뽑기' 플랫폼에서 제공하는 교육용 발표 학생 추첨 웹 애플리케이션을 말합니다.</li>
      <li>'이용자'란 본 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 교사, 학생 및 비회원을 말합니다.</li>
    </ol>
    
    <h2>제3조 (약관의 명시와 개정)</h2>
    <ol>
      <li>본 서비스는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
      <li>관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
    </ol>
    
    <h2>제4조 (서비스의 제공)</h2>
    <ol>
      <li>본 서비스는 교육 목적의 무료 웹 애플리케이션을 제공합니다.</li>
      <li>서비스의 이용은 완전 무료이며, 별도의 가입이나 유료 결제가 필요하지 않습니다.</li>
    </ol>
    
    <h2>제5조 (서비스의 중단)</h2>
    <p>본 서비스는 시스템 점검, 소스 코드 패치, 호스팅 서버 점검 및 고장 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다. 무료 서비스이므로 별도의 보상은 제공되지 않습니다.</p>
    
    <h2>제6조 (이용자의 의무 및 AI 윤리 의무)</h2>
    <ol>
      <li>이용자는 서비스를 이용할 때 본 서비스가 안내하는 <strong>'AI 윤리 핵심가이드'</strong>를 준수하고 실천해야 합니다.</li>
      <li>이용자는 본 서비스 내에 타인의 명예를 훼손하거나 유해한 정보, 혹은 공서양속에 반하는 데이터를 입력하여서는 안 됩니다.</li>
    </ol>
    
    <h2>제7조 (저작권)</h2>
    <p>본 서비스가 작성한 저작물에 대한 저작권 및 기타 지식재산권은 원 서비스 개발자에게 귀속합니다.</p>
    
    <h2>제8조 (면책조항)</h2>
    <p>본 서비스는 무료 교육용 도구로서 기기 환경에 따라 동작에 차이가 있을 수 있으며, 이로 발생하는 오류 및 기술적 문제에 대해 책임지지 않습니다.</p>
  `;

  const privacyHTML = `
    <h1>두근두근 발표뽑기 개인정보처리방침</h1>
    <p>본 서비스는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
    
    <h2>제1조 (개인정보의 처리 목적)</h2>
    <p>본 서비스는 회원가입 제도가 없으며, <strong>서버로 개인정보를 절대 전송하거나 수집하지 않습니다.</strong> 입력되는 정보는 로컬 렌더링 목적으로만 사용됩니다.</p>
    
    <h2>제2조 (개인정보의 처리 및 보유기간)</h2>
    <p>이용자가 입력한 학생 목록 등 모든 데이터는 이용자의 로컬 웹 브라우저 내부 저장소(<code>localStorage</code>)에만 안전하게 저장됩니다.</p>
    <ul>
      <li>보유 기간: 웹 브라우저의 캐시/사이트 데이터를 삭제할 때까지 보관됩니다.</li>
    </ul>
    
    <h2>제3조 (처리하는 개인정보 항목)</h2>
    <ul>
      <li>로컬 저장 및 처리 항목: 설정된 총 학생 수, 학생 이름 목록, 입력된 번호, 뽑기 진행 기록</li>
      <li>수집하지 않는 항목: 이름, 주소, 전화번호, 이메일 등 일체의 민감 개인정보</li>
    </ul>
    
    <h2>제4조 (만 14세 미만 아동의 개인정보 처리)</h2>
    <p>본 서비스는 아동의 개인정보를 수집 및 보유하지 않으며 학급 활동 시 사용되는 학생 명단은 기기 내에서 로컬로 임시 저장되므로, 법정대리인의 별도 가입 동의를 거치지 않습니다.</p>
    
    <h2>제5조 (개인정보의 파기 절차 및 방법)</h2>
    <p>이용자가 입력한 데이터는 브라우저 설정에서 쿠키 및 사이트 데이터를 초기화하거나, '선생님 설정 모드' 내에서 수동으로 목록을 삭제하면 즉시 브라우저에서 영구 파기됩니다.</p>
    
    <h2>제6조 (개인정보의 안전성 확보조치)</h2>
    <ol>
      <li><strong>서버 없는 설계(Zero-Server)</strong>: 외부 데이터베이스에 회원 데이터를 저장하지 않으므로 해킹 및 외부 유출 위험이 원천 차단됩니다.</li>
      <li><strong>보안 전송(HTTPS)</strong>: 데이터 전송 구간 암호화를 통해 안전하게 소스 코드를 로딩합니다.</li>
    </ol>
    
    <h2>제7조 (정보주체와 법정대리인의 권리)</h2>
    <p>교사는 언제든지 '선생님 설정 모드'를 통해 해당 학생의 정보를 수정하거나 삭제해 줄 수 있습니다.</p>
    
    <h2>제8조 (개인정보 보호책임자)</h2>
    <ul>
      <li><strong>개발 및 책임자</strong>: 이o실</li>
      <li><strong>소속</strong>: 서울개원초등학교</li>
      <li><strong>직위</strong>: 교사</li>
      <li><strong>문의 연락처</strong>: 02-2138-1940 (교무실)</li>
    </ul>
    
    <h2>제9조 (변경 안내)</h2>
    <p>본 개인정보 처리방침은 <strong>2026년 6월 27일</strong>부터 적용됩니다.</p>
  `;

  // Open Policy Popup Modal
  function openPolicyModal(title, htmlContent) {
    policyModalTitle.textContent = title;
    policyModalBody.innerHTML = htmlContent;
    policyModal.classList.remove('hidden');
  }

  function closePolicyModal() {
    policyModal.classList.add('hidden');
  }

  // Event Listeners for Footer Buttons
  footerTermsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openPolicyModal('서비스 이용약관 📜', termsHTML);
  });

  footerPrivacyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openPolicyModal('개인정보처리방침 🛡️', privacyHTML);
  });

  // Close Event Listeners
  closePolicyBtn.addEventListener('click', closePolicyModal);
  confirmPolicyBtn.addEventListener('click', closePolicyModal);

  // Close modal when clicking outside content
  policyModal.addEventListener('click', (e) => {
    if (e.target === policyModal) {
      closePolicyModal();
    }
  });


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
