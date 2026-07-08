let isTextClicked = false;
let isTimeClicked = false;
let startTime = false;
let testCompleted = false;
let currentIndex = 0;
let correct = 0;
let typedCount = 0;
let mistakes = new Map();
let textSymbols;

const levelLinks = document.querySelectorAll(".level-info__item a");
const modeLinks = document.querySelectorAll(".mode-info__item a");
const timeBtns = document.querySelectorAll(".time-btn");
const content = document.getElementById("content");
const startDiv = document.getElementById("start-info");
const accuracySpan = document.getElementById("accuracy");
const timeSpan = document.getElementById("time");
const wpmSpan = document.getElementById("wpm");
const record = document.getElementById("record-info");
const logo = document.getElementById("logo");
const restartBtn = document.getElementById("restart-btn");
const mobileInput = document.getElementById("mobile-input");

const firstDropdown = document.getElementById("dropdown-1");
const secDropdown = document.getElementById("dropdown-2");
const firstMenu = document.getElementById("menu-1");
const secMenu = document.getElementById("menu-2");
const firstDropBtn = document.getElementById("drop-btn-1");
const secDropBtn = document.getElementById("drop-btn-2");
const firstDropHead = document.getElementById("drop-head-1");
const secDropHead = document.getElementById("drop-head-2");
const firstRadios = document.querySelectorAll('input[name="level"]');
const secRadios = document.querySelectorAll('input[name="difficulty"]');

(function updateBest() {
  const highscore = localStorage.getItem("highscore");
  if (highscore === null) {
    localStorage.setItem("highscore", 0);
  }
  record.innerHTML = highscore + " WPM";
})();

document.addEventListener("keydown", (event) => {
  if (event.key.length > 1) return;

  if (testCompleted) return;

  const expectedLetter = textSymbols[currentIndex];
  const pressedKey = event.key;
  typedCount++;

  if (expectedLetter !== pressedKey) {
    mistakes.set(currentIndex, pressedKey);
  } else {
    correct++;
  }

  currentIndex++;
  updateDisplay();

  if (currentIndex === textSymbols.length) {
    event.preventDefault();

    if (localStorage.getItem("highscore") == 0) {
      saveStats();
      testCompleted = true;
      window.location.href = "/pages/baseline.html";
    } else if (Number(wpmSpan.innerHTML) < localStorage.getItem("highscore")) {
      saveStats();
      testCompleted = true;
      window.location.href = "/pages/completed.html";
    } else {
      saveStats();
      testCompleted = true;
      window.location.href = "/pages/highscore.html";
    }

    return;
  }
});

mobileInput.addEventListener("input", (e) => {
  if (testCompleted) return;

  const expectedLetter = textSymbols[currentIndex];
  const pressedKey = e.target.value.slice(-1); // Получаем последний введенный символ

  typedCount++;

  if (expectedLetter !== pressedKey) {
    mistakes.set(currentIndex, pressedKey);
  } else {
    correct++;
  }

  currentIndex++;
  updateDisplay();

  if (currentIndex === textSymbols.length) {
    event.preventDefault();

    if (localStorage.getItem("highscore") == 0) {
      saveStats();
      testCompleted = true;
      window.location.href = "/pages/baseline.html";
    } else if (Number(wpmSpan.innerHTML) < localStorage.getItem("highscore")) {
      saveStats();
      testCompleted = true;
      window.location.href = "/pages/completed.html";
    } else {
      saveStats();
      testCompleted = true;
      window.location.href = "/pages/highscore.html";
    }

    e.target.value = "";

    return;
  }
});

firstDropBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  firstMenu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!firstDropdown.contains(e.target)) {
    firstMenu.classList.remove("active");
  }
});

secDropBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  secMenu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!secDropdown.contains(e.target)) {
    secMenu.classList.remove("active");
  }
});

timeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    isTimeClicked = true;
    timeSpan.innerHTML = "00:60";
  });
});

levelLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    let pressedLink = e.target;
    e.preventDefault();
    let level = pressedLink.textContent.toLowerCase();
    localStorage.setItem("level", level);
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

firstRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const selectedLabel = radio
      .closest(".dropdown-item")
      .querySelector("span").textContent;
    firstDropHead.textContent = selectedLabel;
  });
});

secRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const selectedLabel = radio
      .closest(".dropdown-item")
      .querySelector("span").textContent;
    secDropHead.textContent = selectedLabel;
  });
});

/**
 * Selects a random text object from the specified difficulty level.
 *
 * @param {string} level - The difficulty level key (e.g., "easy", "medium", "hard")
 * @param {Object} data - The data object containing arrays of text objects for each level
 * @param {Array<{text: string}>} data[level] - Array of objects, each containing a `text` property
 * @returns {string} A randomly selected text string from the specified level
 */
const getRandomText = (level, data) => {
  const arr = data[level];
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex].text;
};

/**
 * Fetches text data from a JSON file based on the specified level,
 * displays it in the "content" element, and stores it as a character array.
 *
 * @param {string} level - The difficulty or category level to filter texts
 * @returns {Promise<void>} A promise that resolves when the operation completes
 * @throws {Error} Shows an alert if fetching or parsing JSON fails
 */
async function renderLevel(level) {
  try {
    const container = document.getElementById("content");

    const res = await fetch("/assets/data.json");
    const data = await res.json();

    const text = getRandomText(level, data);
    container.innerHTML = text;
    textSymbols = text.split("");
  } catch (error) {
    alert("Reading data error occured: " + error);
  }
}

/**
 * Checks if the level and mode buttons are clicked, then starts the test.
 * Also it checks whether text is finished or not and updates statistics
 * during the test.
 * @returns {void}
 */
const startTest = () => {
  const isLevel =
    document.querySelector(".level-info__item a.active") ||
    document.querySelector("input[name='level']:checked");
  const isMode =
    document.querySelector(".mode-info__item a.active") ||
    document.querySelector("input[name='difficulty']:checked");

  if (!isLevel) {
    alert("Choose level difficulty first!");
  } else if (!isMode) {
    alert("Choose typing mode first!");
  } else if (!isTextClicked) {
    onStartChange();
    if (isTimeClicked) {
      updateTimer();
    }
    addRestartBtn();
    updateDisplay();
  }

  if (window.innerWidth >= 320 && getDeviceType() == "mobile") {
    mobileInput.focus();
  }

  setInterval(() => {
    if (currentIndex === textSymbols.length) {
      clearInterval();
    } else {
      updateStats();
    }
  }, 1000);
};

/**
 * Starts a 60-second countdown timer and updates the display every second.
 * @returns {void}
 */
const updateTimer = () => {
  let seconds = 59;
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
};

/**
 * Renders the text with CSS classes for correct, incorrect, upcoming,
 * and current characters.
 * @returns {void}
 */
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
};

/**
 * Sets up the test environment on first click: records start time,
 * hides overlay, removes blur.
 * @returns {void}
 */
const onStartChange = () => {
  isTextClicked = true;

  if (!startTime) {
    startTime = Temporal.Now.plainTimeISO();
  }

  content.style.filter = "blur(0)";
  startDiv.style.display = "none";
  accuracySpan.classList.add("active");
  timeSpan.classList.add("active");
};

/**
 * Calculates and updates WPM and accuracy based on elapsed time
 * and typed characters.
 * @returns {void}
 */
const updateStats = () => {
  const now = Temporal.Now.zonedDateTimeISO();
  const wastedTime = startTime.until(now);

  const totalMilliseconds = wastedTime.total({ unit: "milliseconds" });
  const seconds = totalMilliseconds / 1000;

  if (seconds < 0.5 || typedCount === 0) {
    wpmSpan.innerHTML = "0";
    accuracySpan.innerHTML = "0%";
    return;
  }

  const wpm = (typedCount / 5) * (60 / seconds);
  const accuracy = ((typedCount - mistakes.size) / typedCount) * 100;

  wpmSpan.innerHTML = Math.round(wpm);
  accuracySpan.innerHTML = Math.round(accuracy) + "%";
};

/**
 * Saves statistics after finishing a test.
 * @returns {void}
 */
const saveStats = () => {
  if (testCompleted) return;

  if (Number(wpmSpan.innerHTML) > localStorage.getItem("highscore")) {
    localStorage.setItem("highscore", wpmSpan.innerHTML);
  }

  localStorage.setItem("wpm", wpmSpan.innerHTML);
  localStorage.setItem("accuracy", accuracySpan.innerHTML);
  localStorage.setItem("correct", correct);
  localStorage.setItem("incorrect", mistakes.size);
};

/**
 * Adds restart button after starting the test.
 * @return {void}
 */
const addRestartBtn = () => {
  content.classList.add("border");
  restartBtn.style.visibility = "visible";
};

/**
 * Restarts the test.
 * @return {void}
 */
const restartTest = () => {
  currentIndex = 0;
  typedCount = 0;
  mistakes.clear();
  startTime = Temporal.Now.plainTimeISO();
  renderLevel(localStorage.getItem("level"));
};

const getDeviceType = () => {
  const ua = navigator.userAgent;

  // Проверка на планшет
  if (/Tablet|iPad/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
    return "tablet";
  }

  // Проверка на мобильное устройство
  if (/Mobi|Android|iPhone|iPod|BlackBerry|Windows Phone/i.test(ua)) {
    return "mobile";
  }

  return "desktop";
}
