const levelLinks = document.querySelectorAll('.level-info__item a');

levelLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Убираем активный класс со всех ссылок уровня
        levelLinks.forEach(l => l.classList.remove('active'));
        // Добавляем активный класс к кликнутой ссылке
        this.classList.add('active');
    });
});

// Обработка кликов на ссылки режима
const modeLinks = document.querySelectorAll('.mode-info__item a');
modeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Убираем активный класс со всех ссылок режима
        modeLinks.forEach(l => l.classList.remove('active'));
        // Добавляем активный класс к кликнутой ссылке
        this.classList.add('active');
    });
});

function getRandomText(level, data) {
    const arr = data[level];
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex].text;
}

async function renderLevel(level) {
    const container = document.getElementById('content');

    const res = await fetch('data.json');
    const data = await res.json();

    const text = getRandomText(level, data);
    container.innerHTML = text;
}