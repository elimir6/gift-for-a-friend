/* --- FLOATING HEARTS & STARS CANVAS BACKGROUND --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = height + 20;
    this.size = Math.random() * 14 + 8;
    this.speedY = Math.random() * 1.5 + 0.8;
    this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.type = Math.random() > 0.3 ? 'heart' : 'star';
    this.color = `hsl(${Math.random() * 20 + 340}, 100%, 75%)`;
  }
  update() {
    this.y -= this.speedY;
    this.x += Math.sin(this.y * 0.02) * 0.5;
    if (this.y < -30) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    if (this.type === 'heart') {
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(this.x, this.y + topCurveHeight);
      ctx.bezierCurveTo(
        this.x, this.y, 
        this.x - this.size / 2, this.y, 
        this.x - this.size / 2, this.y + topCurveHeight
      );
      ctx.bezierCurveTo(
        this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
        this.x, this.y + this.size, 
        this.x, this.y + this.size
      );
      ctx.bezierCurveTo(
        this.x, this.y + this.size, 
        this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
        this.x + this.size / 2, this.y + topCurveHeight
      );
      ctx.bezierCurveTo(
        this.x + this.size / 2, this.y, 
        this.x, this.y, 
        this.x, this.y + topCurveHeight
      );
      ctx.closePath();
      ctx.fill();
    } else {
      // Draw Star
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos((18 + i * 72) * Math.PI / 180) * (this.size / 2) + this.x,
          -Math.sin((18 + i * 72) * Math.PI / 180) * (this.size / 2) + this.y
        );
        ctx.lineTo(
          Math.cos((54 + i * 72) * Math.PI / 180) * (this.size / 4) + this.x,
          -Math.sin((54 + i * 72) * Math.PI / 180) * (this.size / 4) + this.y
        );
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

for (let i = 0; i < 30; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* --- ЭКРАН 1: ЛОГИКА УМЕНЬШЕНИЯ "НЕТ" И УВЕЛИЧЕНИЯ "ДА" --- */
const noPrompts = [
  "Подумай хорошенько... 🥺",
  "Точно-точно нет? 😭",
  "Давай без глупостей...",
  "Попробуй ещё раз!",
  "Ну ладно, последний шанс..."
];

let noCount = 0;
let yesScale = 1;
let noScale = 1;

function handleNoClick() {
  const subtitle = document.getElementById('question-subtitle');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');

  // Текст подсказки на русском языке
  const promptText = noPrompts[Math.min(noCount, noPrompts.length - 1)];
  subtitle.innerText = promptText;

  noCount++;

  // Кнопка ДА растет, кнопка НЕТ уменьшается
  yesScale += 0.45;
  noScale = Math.max(0.2, noScale - 0.15);

  btnYes.style.transform = `scale(${yesScale})`;
  btnYes.style.fontSize = `${1.3 + noCount * 0.25}rem`;
  btnYes.style.padding = `${14 + noCount * 4}px ${36 + noCount * 10}px`;

  btnNo.style.transform = `scale(${noScale})`;
  btnNo.style.opacity = Math.max(0.3, 1 - noCount * 0.12);

  // Если нажато много раз, ДА закрывает почти весь экран
  if (noCount >= 5) {
    btnYes.style.position = 'fixed';
    btnYes.style.top = '0';
    btnYes.style.left = '0';
    btnYes.style.width = '100vw';
    btnYes.style.height = '100vh';
    btnYes.style.borderRadius = '0';
    btnYes.style.zIndex = '999';
    btnYes.style.fontSize = '3rem';
    btnYes.innerText = 'ДА! Я ЛЮБЛЮ ТЕБЯ! 💕 (Нажми сюда!)';
  }
}

/* --- ЭКРАН 2: ХОМЯЧОК С ФОТОАППАРАТОМ И ФОТО ВСПЫШКА --- */
function handleYesClick() {
  // Запуск салюта из конфетти
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff758f', '#ff4d6d', '#ffb3c1', '#ffffff', '#51cf66']
    });
  }

  // Скрываем Экран 1, показываем Экран 2 (Сцена с хомячком)
  document.getElementById('screen1').style.display = 'none';
  const scene2 = document.getElementById('scene2');
  scene2.style.display = 'flex';

  const countdownText = document.getElementById('countdown-text');
  const speechBubble = document.getElementById('speech-bubble');
  const cameraFlash = document.getElementById('camera-flash');
  const singlePhotoStage = document.getElementById('single-photo-stage');

  speechBubble.innerText = 'Улыбнись! 📸';
  countdownText.innerText = '';
  singlePhotoStage.style.display = 'none';

  // Обратный отсчет: 3... 2... 1...
  setTimeout(() => { countdownText.innerText = '3...'; }, 600);
  setTimeout(() => { countdownText.innerText = '2...'; }, 1500);
  setTimeout(() => { countdownText.innerText = '1...'; }, 2400);

  // * ЩЁЛК! * и Белая полноэкранная вспышка
  setTimeout(() => {
    countdownText.innerText = '* ЩЁЛК! 📸 *';
    cameraFlash.classList.add('active');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.5 }
      });
    }

    setTimeout(() => {
      cameraFlash.classList.remove('active');
    }, 500);
  }, 3300);

  // Сразу после вспышки появляется РОВНО 1 ФОТО с подписью "it's always you :)"
  setTimeout(() => {
    countdownText.style.display = 'none';
    speechBubble.innerText = 'Хорошего дня! ✨';
    singlePhotoStage.style.display = 'flex';
  }, 4000);
}

function goToGifts() {
  // Скрываем Экран 2, открываем Экран 3 (4 подарка)
  document.getElementById('scene2').style.display = 'none';
  const scene3 = document.getElementById('scene3');
  scene3.style.display = 'block';

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/* --- СИСТЕМА МОДАЛЬНЫХ ОКЕН --- */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    if (modalId === 'modal-quest') {
      resetQuest();
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

/* --- ПОДАРОК 4: ИНТЕРАКТИВНЫЙ КВЕСТ ИЗ 6 ЗАГАДОК --- */
const questQuestions = [
  {
    riddle: "В облаках из одеял и мягких подушек,\nГде живут сотни снов и пушистых игрушек,\nСказка ночная тихонько звёзды зажжёт...\nОтгадай, где тебя новый сюрприз ждёт?",
    options: ["Внутри детской кровати", "На подоконнике", "В портфеле"],
    correctIndex: 0
  },
  {
    riddle: "У меня есть круглое окошко и крутящийся живот,\nВ белой пене и воде там танец весело идёт!\nЯ кручусь и нарядам чистоту дарю,\nГде скрывается секрет — сейчас тебе скажу!",
    options: ["В корзине для белья", "В стиральной машине", "На сушилке"],
    correctIndex: 1
  },
  {
    riddle: "После вкусного обеда тарелки в ряд стоят,\nВ тёплом душе на кухне вымыться они хотят.\nЯ закрываюсь герметично, брызги струй горячих лью...\nЗагляни скорей внутрь! В каком же я углу?",
    options: ["В микроволновке", "В духовке", "В посудомойке на кухне"],
    correctIndex: 2
  },
  {
    riddle: "У дверей стоит отель, в нём жильцов не перечесть:\nТут кроссовки и сапожки, туфли, тапочки здесь есть!\nКаждый вечер возвращаются они с прогулки спать,\nГде же этот домик парный? Попробуй отгадать!",
    options: ["В обувнице", "Под ковриком", "В коробке с носками"],
    correctIndex: 0
  },
  {
    riddle: "Он мигает огоньками, светит ярким монитором,\nЗдесь кипит работа мамы, мысли льются разговором.\nНо не на клавиатуре скрыта тайная мечта —\nЗагляни за спину друга, где затаилась темнота!",
    options: ["В клавиатуре", "За маминым компьютером", "На системном блоке"],
    correctIndex: 1
  },
  {
    riddle: "Здесь утюг горячий парит, гладкость платьям придаёт,\nИ длинноногая доска своего часа вечно ждёт.\nЧтобы все наряды были без единой складочки,\nВ каком шкафу скрывается подарок-загадочка?",
    options: ["В шкафу с гладильной доской", "За шторами", "На чемодане"],
    correctIndex: 0
  },
  {
    riddle: "Оно яркое и шуршащее, на вид как сладость,\nНо внутри таится несъедобная радость!\nВ бумагу завёрнуто, словно фантик конфетный,\nИ манит открыть его, раскрыв секрет заветный…",
    options: ["Шоколадная плитка", "Бумажная конфета с надписью «не открывать»", "Настоящий леденец"],
    correctIndex: 1
  }
];

let currentQuestStep = 0;

function resetQuest() {
  currentQuestStep = 0;
  const activeScreen = document.getElementById('quest-active-screen');
  const finalScreen = document.getElementById('quest-final-screen');
  if (activeScreen && finalScreen) {
    activeScreen.style.display = 'block';
    finalScreen.style.display = 'none';
    renderQuestStep();
  }
}

function renderQuestStep() {
  const current = questQuestions[currentQuestStep];
  const counterEl = document.getElementById('quest-counter');
  const riddleEl = document.getElementById('quest-riddle');
  const optionsEl = document.getElementById('quest-options');
  const nextBtn = document.getElementById('btn-next-question');

  if (!current || !counterEl || !riddleEl || !optionsEl || !nextBtn) return;

  counterEl.innerText = `Вопрос ${currentQuestStep + 1} из ${questQuestions.length}`;
  riddleEl.innerText = current.riddle;

  optionsEl.innerHTML = '';
  nextBtn.style.display = 'none';

  current.options.forEach((optText, index) => {
    const btn = document.createElement('button');
    btn.className = 'quest-option-btn';
    btn.innerText = optText;
    btn.onclick = () => handleQuestAnswer(index);
    optionsEl.appendChild(btn);
  });
}

function handleQuestAnswer(selectedIndex) {
  const current = questQuestions[currentQuestStep];
  const optionsContainer = document.getElementById('quest-options');
  const buttons = optionsContainer.querySelectorAll('.quest-option-btn');
  const nextBtn = document.getElementById('btn-next-question');

  buttons.forEach((btn, index) => {
    btn.disabled = true;
    btn.classList.add('disabled');

    if (index === current.correctIndex) {
      btn.classList.add('btn-correct');
    }
    if (index === selectedIndex && selectedIndex !== current.correctIndex) {
      btn.classList.add('btn-wrong');
    }
  });

  // Показываем кнопку "Далее"
  nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
  currentQuestStep++;
  if (currentQuestStep < questQuestions.length) {
    renderQuestStep();
  } else {
    // Финальный экран
    document.getElementById('quest-active-screen').style.display = 'none';
    const finalScreen = document.getElementById('quest-final-screen');
    finalScreen.style.display = 'block';

    // Праздничный салют из конфетти
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ff758f', '#ff4d6d', '#ffb3c1', '#ffffff', '#ffd166', '#51cf66']
      });
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 120,
          origin: { y: 0.6 }
        });
      }, 400);
    }
  }
}
