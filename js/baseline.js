const keys = ["wpm", "accuracy", "correct", "incorrect"];

document.addEventListener('DOMContentLoaded', () => {
  const wpm = document.getElementById("wpm");
  const accuracy = document.getElementById("accuracy");
  const correct = document.getElementById("correct");
  const incorrect = document.getElementById("incorrect");

  wpm.innerHTML = localStorage.getItem("wpm");
  accuracy.innerHTML = localStorage.getItem("accuracy");
  correct.innerHTML = localStorage.getItem("correct");
  incorrect.innerHTML = localStorage.getItem("incorrect");
})