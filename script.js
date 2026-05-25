let isTextClicked = false;
let isTimeClicked = false;
let index = 0;
let textSymbols;
let receivedText;

const levelLinks = document.querySelectorAll(".level-info__item a");
const modeLinks = document.querySelectorAll(".mode-info__item a");
const timeBtn = document.getElementById("time-btn");

document.addEventListener("keydown", function(event) {
  if (event.key.length > 1) return;

  if (textSymbols && index < textSymbols.length) {
    const letter = textSymbols[index];

    if (letter == event.key) {
      console.log(event.key);
    } else {
      console.log("NO");
    }
    updateDisplay(letter);
    index++;
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
    receivedText = text;

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

function updateDisplay(letter){
  const content = document.getElementById("content");

  const html = textSymbols.map((letter, i) => {
    const className = i < index ? "correct" : "incorrect";
    return `<span class="${className}">${letter}</span>`;
  }).join('');
  
  content.innerHTML = html;
}