// Sound Effects
let soundEnabled = true;
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    localStorage.setItem('soundEnabled', soundEnabled);
});

// Load sound preference
soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
soundIcon.textContent = soundEnabled ? '🔊' : '🔇';

// Utility: Play Sound
function playSound(frequency = 440, duration = 100) {
    if (!soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        console.log('Audio context not available');
    }
}

// Utility: Copy to Clipboard
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showCopyNotification();
    });
}

// Show copy notification
function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.add('show');
    playSound(880, 200);
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Attach copy buttons
document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetId = e.target.dataset.copy;
        copyToClipboard(targetId);
    });
});

// ==================== TAB NAVIGATION ====================
const tabButtons = document.querySelectorAll('.tab-btn');
const toolSections = document.querySelectorAll('.tool-section');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active class from all
        tabButtons.forEach(b => b.classList.remove('active'));
        toolSections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
    });
});

// ==================== 1. DICE ROLL ====================
const rollBtn = document.getElementById('rollBtn');
const diceCount = document.getElementById('diceCount');
const diceContainer = document.getElementById('diceContainer');
const diceResult = document.getElementById('diceResult');
const diceTotal = document.getElementById('diceTotal');

rollBtn.addEventListener('click', () => {
    const count = parseInt(diceCount.value);
    const rolls = [];
    diceContainer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
        rolls.push(value);
        
        setTimeout(() => {
            const diceEl = document.createElement('div');
            diceEl.className = 'dice';
            diceEl.textContent = value;
            diceContainer.appendChild(diceEl);
            playSound(400 + (i * 100), 150);
        }, i * 150);
    }
    
    const total = rolls.reduce((a, b) => a + b, 0);
    
    setTimeout(() => {
        diceTotal.textContent = total;
        diceResult.style.display = 'block';
        playSound(880, 300);
    }, count * 150 + 100);
});

// ==================== 2. COIN FLIP ====================
const flipBtn = document.getElementById('flipBtn');
const coin = document.getElementById('coin');
const coinOutcome = document.getElementById('coinOutcome');
const coinResult = document.getElementById('coinResult');

flipBtn.addEventListener('click', () => {
    coin.classList.remove('flip');
    setTimeout(() => {
        coin.classList.add('flip');
    }, 10);
    
    const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
    
    setTimeout(() => {
        coinOutcome.textContent = result;
        coinResult.style.display = 'block';
        playSound(result === 'Heads' ? 523 : 698, 300);
    }, 900);
});

// ==================== 3. YES/NO/MAYBE ====================
const decideBtn = document.getElementById('decideBtn');
const question = document.getElementById('question');
const decideOutcome = document.getElementById('decideOutcome');
const decideResult = document.getElementById('decideResult');

const decisions = [
    { text: 'YES', class: 'yes' },
    { text: 'NO', class: 'no' },
    { text: 'MAYBE', class: 'maybe' }
];

decideBtn.addEventListener('click', () => {
    const decision = decisions[Math.floor(Math.random() * decisions.length)];
    
    decideOutcome.textContent = decision.text;
    decideOutcome.className = 'result-value decision ' + decision.class;
    decideResult.style.display = 'block';
    
    const frequency = decision.class === 'yes' ? 659 : (decision.class === 'no' ? 329 : 440);
    playSound(frequency, 400);
});

// ==================== 4. RANDOM NUMBER ====================
const randomBtn = document.getElementById('randomBtn');
const minNumber = document.getElementById('minNumber');
const maxNumber = document.getElementById('maxNumber');
const randomValue = document.getElementById('randomValue');
const randomResult = document.getElementById('randomResult');

randomBtn.addEventListener('click', () => {
    const min = parseInt(minNumber.value);
    const max = parseInt(maxNumber.value);
    
    if (isNaN(min) || isNaN(max)) {
        alert('Please enter valid min and max values');
        return;
    }
    
    if (min >= max) {
        alert('Min must be less than Max');
        return;
    }
    
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    
    randomValue.textContent = random;
    randomResult.style.display = 'block';
    playSound(440 + (random % 200), 300);
});

// ==================== 5. SPIN THE WHEEL ====================
const spinBtn = document.getElementById('spinBtn');
const wheelOptions = document.getElementById('wheelOptions');
const wheelCanvas = document.getElementById('wheelCanvas');
const spinAgainBtn = document.getElementById('spinAgainBtn');
const wheelWinner = document.getElementById('wheelWinner');
const wheelResult = document.getElementById('wheelResult');
const wheelContainer = document.querySelector('.wheel-container');

let wheelSpinning = false;
let currentOptions = [];

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
];

function createWheel(options) {
    wheelCanvas.innerHTML = '';
    currentOptions = options;
    
    const segmentAngle = 360 / options.length;
    
    options.forEach((option, index) => {
        const segment = document.createElement('div');
        segment.className = 'wheel-segment';
        segment.textContent = option;
        segment.style.backgroundColor = colors[index % colors.length];
        segment.style.transform = `rotate(${index * segmentAngle}deg)`;
        wheelCanvas.appendChild(segment);
    });
}

spinBtn.addEventListener('click', () => {
    const optionsText = wheelOptions.value.trim();
    
    if (!optionsText) {
        alert('Please enter at least one option');
        return;
    }
    
    const options = optionsText
        .split(',')
        .map(o => o.trim())
        .filter(o => o.length > 0);
    
    if (options.length < 2) {
        alert('Please enter at least 2 options');
        return;
    }
    
    createWheel(options);
    wheelContainer.style.display = 'block';
    wheelResult.style.display = 'none';
    
    performSpin();
});

spinAgainBtn.addEventListener('click', performSpin);

function performSpin() {
    if (wheelSpinning || currentOptions.length === 0) return;
    
    wheelSpinning = true;
    wheelResult.style.display = 'none';
    
    const segmentAngle = 360 / currentOptions.length;
    const spins = 5 + Math.random() * 3;
    const randomSegment = Math.floor(Math.random() * currentOptions.length);
    const finalAngle = spins * 360 + (randomSegment * segmentAngle);
    
    wheelCanvas.style.setProperty('--spin-angle', finalAngle + 'deg');
    wheelCanvas.classList.remove('spinning');
    
    setTimeout(() => {
        wheelCanvas.classList.add('spinning');
        playSound(440, 100);
    }, 10);
    
    setTimeout(() => {
        wheelSpinning = false;
        wheelWinner.textContent = currentOptions[randomSegment];
        wheelResult.style.display = 'block';
        playSound(880, 400);
    }, 3100);
}

// ==================== 6. RANDOM PICKER ====================
const pickBtn = document.getElementById('pickBtn');
const pickerList = document.getElementById('pickerList');
const pickerValue = document.getElementById('pickerValue');
const pickerResult = document.getElementById('pickerResult');

pickBtn.addEventListener('click', () => {
    const listText = pickerList.value.trim();
    
    if (!listText) {
        alert('Please paste or type your list');
        return;
    }
    
    const items = listText
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    
    if (items.length === 0) {
        alert('Please enter at least one item');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * items.length);
    const picked = items[randomIndex];
    
    pickerValue.textContent = picked;
    pickerResult.style.display = 'block';
    
    playSound(523, 150);
    playSound(659, 150);
    playSound(784, 300);
});

// Initialize
console.log('🎲 DICE by NEWR Labs loaded successfully!');