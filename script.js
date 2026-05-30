let isTextClicked = false;
let isTimeClicked = false;
let currentIndex = 0;
let textSymbols;
let mistakes = new Map();

const levelLinks = document.querySelectorAll(".level-info__item a");
const modeLinks = document.querySelectorAll(".mode-info__item a");
const timeBtn = document.getElementById("time-btn");
const content = document.getElementById("content");

document.addEventListener("keydown", function(event) {
  if (event.key.length > 1) return;

  if (currentIndex >= textSymbols.length) return;
  
  const expectedLetter = textSymbols[currentIndex];
  const pressedKey = event.key;
  
  if (expectedLetter === pressedKey) {
    currentIndex++;
    updateDisplay(true);
  } else {
    mistakes.set(currentIndex, pressedKey);
    currentIndex++;
    updateDisplay(false, pressedKey);
  }
  
})

timeBtn.addEventListener("click", () => {
  isTimeClicked = true;
});

levelLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    levelLinks.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  });
});

modeLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    modeLinks.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  });
});

function getRandomText(level, data) {
  const arr = data[level];
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex].text;
}

async function renderLevel(level) {
  try {
    const container = document.getElementById("content");

    const res = await fetch("data.json");
    const data = await res.json();

    const text = getRandomText(level, data);
    container.innerHTML = text;
    textSymbols = text.split('');

  } catch (error) {
    alert("Reading data error occured: " + error);
  }
}

function startTest() {
  const isLevel = document.querySelector(".level-info__item a.active");
  const isMode = document.querySelector(".mode-info__item a.active");

  if (!isLevel) {
    alert("Choose level difficulty first!");
  } else if (!isMode) {
    alert("Choose typing mode first!");
  } else if (!isTextClicked) {
    isTextClicked = true;
    const content = document.getElementById("content");
    const startDiv = document.getElementById("start-info");
    content.style.filter = "blur(0)";
    startDiv.style.display = "none";
    if (isTimeClicked) {
      updateTimer();
    }
    updateDisplay(true);
  }
}

function updateTimer() {
  let seconds = 60;
  const timeSpan = document.getElementById("time");

  setInterval(() => {
    if (seconds >= 0) {
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      timeSpan.innerHTML = `00:${formattedSeconds}`;
      seconds--;
    } else {
      clearInterval();
    }
  }, 1000);
}

function updateDisplay(isCorrect, wrongKey = null) {
  content.innerHTML = '';
  
  textSymbols.forEach((symbol, idx) => {
    const span = document.createElement('span');
    
    if (idx < currentIndex) {
      if (mistakes.has(idx)) {
        span.classList.add("incorrect");
      } else {
        span.classList.add("correct");
      }
    } else {
      span.classList.add("feature");
    }
    
    if (idx === currentIndex) {
      span.classList.add("current");  
    }
    
    span.textContent = symbol;
    content.appendChild(span);
  })
};