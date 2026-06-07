let isTextClicked = false;
let isTimeClicked = false;
let startTime = false;
let currentIndex = 0;
let mistakes = new Map();
let typedCount = 0;
let textSymbols;

const levelLinks = document.querySelectorAll(".level-info__item a");
const modeLinks = document.querySelectorAll(".mode-info__item a");
const timeBtn = document.getElementById("time-btn");
const content = document.getElementById("content");
const startDiv = document.getElementById("start-info");
const accuracySpan = document.getElementById("accuracy");
const timeSpan = document.getElementById("time");
const wpmSpan = document.getElementById("wpm");

document.addEventListener("keydown", function (event) {
  if (event.key.length > 1) return;

  if (currentIndex >= textSymbols.length) return;

  const expectedLetter = textSymbols[currentIndex];
  const pressedKey = event.key;
  typedCount++;

  if (expectedLetter !== pressedKey) {
    mistakes.set(currentIndex, pressedKey);
  } 
  currentIndex++;
  updateDisplay();

});

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

const getRandomText = (level, data) => {
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
    textSymbols = text.split("");
  } catch (error) {
    alert("Reading data error occured: " + error);
  }
}

const startTest = () =>  {
  const isLevel = document.querySelector(".level-info__item a.active");
  const isMode = document.querySelector(".mode-info__item a.active");

  if (!isLevel) {
    alert("Choose level difficulty first!");
  } else if (!isMode) {
    alert("Choose typing mode first!");
  } else if (!isTextClicked) {
    onStartChange();
    if (isTimeClicked) {
      updateTimer();
    }
    updateDisplay();
  }

  setInterval(() => {
    if (currentIndex >= textSymbols.length) {
      clearInterval();
    } else {
      updateStats();
    }
  }, 1000);
}

const updateTimer = () => {
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


const updateDisplay = () => {
  content.innerHTML = "";

  textSymbols.forEach((symbol, idx) => {
    const span = document.createElement("span");

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
  });
}

const onStartChange = () => {
  isTextClicked = true;

  if (!startTime) {
    startTime = Temporal.Now.plainTimeISO();
    console.log(startTime);
  }

  content.style.filter = "blur(0)";
  startDiv.style.display = "none";
  accuracySpan.style.color = "var(--red)";
  timeSpan.style.color = "var(--yellow)";
};


const updateStats = () => {
  const now = Temporal.Now.plainTimeISO();
  const wastedTime = startTime.until(now);
  const wpm = (typedCount / 5) * (60 / wastedTime.seconds);
  const accuracy = ((typedCount - mistakes.size) / typedCount) * 100;
  wpmSpan.innerHTML = Math.round(wpm);
  accuracySpan.innerHTML = Math.round(accuracy) + "%";
}