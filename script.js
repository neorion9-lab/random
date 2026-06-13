document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const appTitle = document.getElementById('app-title');
  const settingsBtn = document.getElementById('settings-btn');
  const slotContainer = document.getElementById('slot-container');
  const startBtn = document.getElementById('start-btn');
  
  // Modal Elements
  const secretModal = document.getElementById('secret-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  
  // Inputs
  const totalStudentsInput = document.getElementById('total-students');
  const numPicksInput = document.getElementById('num-picks');
  const secretSequenceInput = document.getElementById('secret-sequence');

  // State
  let totalStudents = 20;
  let numPicks = 3;
  let secretSequence = [];
  let isSpinning = false;

  // Initialize slots on load
  initSlots();

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
  }

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

    initSlots();
    closeModal();
  });

  // 2. Slot Machine Logic
  function initSlots() {
    slotContainer.innerHTML = '';
    for (let i = 0; i < numPicks; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.innerHTML = `<span class="slot-number">?</span>`;
      slotContainer.appendChild(slot);
    }
  }

  function generateRandomNumber() {
    return Math.floor(Math.random() * totalStudents) + 1;
  }

  function getWinners() {
    if (secretSequence && secretSequence.length === numPicks) {
      // Clear sequence after using it once? Let's keep it for now, or maybe clear it so it's a one-time thing.
      // Usually teachers want it to happen once. Let's not clear it so they can test, but maybe they should clear it themselves.
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

    const slots = document.querySelectorAll('.slot');
    const winners = getWinners();

    // Reset previous winner styles
    slots.forEach(slot => {
      slot.classList.remove('winner');
      slot.classList.add('spinning');
    });

    // Animate each slot stopping one by one
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const targetNumber = winners[i];
      const slotNumSpan = slot.querySelector('.slot-number');
      
      // Visual spinning effect by rapidly changing inner text
      let spinInterval = setInterval(() => {
        slotNumSpan.textContent = generateRandomNumber();
      }, 50);

      // Wait a bit before stopping this slot
      // 1st slot stops after 1s, 2nd after 2s, etc. (staggered)
      const stopTime = 1000 + (i * 1000); 
      
      await new Promise(resolve => setTimeout(resolve, stopTime));
      
      clearInterval(spinInterval);
      slot.classList.remove('spinning');
      slotNumSpan.textContent = targetNumber;
      slot.classList.add('winner');
    }

    isSpinning = false;
    startBtn.disabled = false;
  });
});
