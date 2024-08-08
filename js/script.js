//tab
function showTab(tabId) {
    const contents = document.querySelectorAll('.tab-content .content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    const activeTab = document.getElementById(tabId);
    activeTab.style.display = 'block';
}

//fullscreen
// document.getElementById('openImageBtn').addEventListener('click', function() {
//     document.getElementById('fullscreenImage').classList.remove('hidden');
//     document.getElementById('fullscreenImage').classList.add('visible');
// });

// document.getElementById('closeBtn').addEventListener('click', function() {
//     document.getElementById('fullscreenImage').classList.remove('visible');
//     document.getElementById('fullscreenImage').classList.add('hidden');
// });

//preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const content = document.querySelector('.site-container');
    
    preloader.style.display = 'none';
    content.style.display = 'block';
});

//game
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const leaderBtn = document.getElementById('leaderBtn');
const game = document.getElementById('game');
const leaderBoard = document.getElementById('leaderboard');

let isJumping = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = `Record: ${highScore}`;

let gameInterval;
let scoreInterval;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump();
    }
});

startBtn.addEventListener('click', function() {
    startGame();
});

leaderBtn.addEventListener('click', function() {
    checkLeaders();
});

function checkLeaders() {
    leaderBoard.classList.remove('hidden');
}

function startGame() {
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    // game.classList.remove('hidden');
    startBtn.style.display = 'none';

     // Запускаем анимацию кактуса
     cactus.style.animation = 'moveCactus 2s linear infinite';

    cactus.style.right = '-20px';
    cactus.style.animation = 'moveCactus 2s linear infinite';

    gameInterval = setInterval(() => {
        let dinoBottom = dino.offsetTop + dino.offsetHeight;
        let dinoLeft = dino.offsetLeft;
        let dinoRight = dino.offsetLeft + dino.offsetWidth;
        let cactusLeft = cactus.offsetLeft;
        let cactusRight = cactus.offsetLeft + cactus.offsetWidth;

        // Проверка столкновения с кактусом
        if (cactusLeft < dinoRight && cactusRight > dinoLeft && dinoBottom >= 150) {
            endGame();
        }
    }, 50);

    // Увеличиваем счет каждые 10 секунд
    scoreInterval = setInterval(() => {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
    }, 10000); // 10000 миллисекунд = 10 секунд
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(scoreInterval);

    cactus.style.animation = 'none';
    cactus.offsetWidth;
    cactus.style.animation = '';

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = `Record: ${highScore}`;
    }
    startBtn.style.display = 'inline-block';
    // game.classList.add('hidden');

    alert('Игра окончена!');
}

function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpHeight = 150; // Высота прыжка
    let jumpDuration = 300; // Длительность прыжка (в миллисекундах)
    let upInterval = setInterval(() => {
        if (dino.offsetTop <= (150 - jumpHeight)) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (dino.offsetTop >= 150) {
                    clearInterval(downInterval);
                    isJumping = false;
                }
                dino.style.top = `${dino.offsetTop + 5}px`;
            }, jumpDuration / (jumpHeight / 5));
        }
        dino.style.top = `${dino.offsetTop - 5}px`;
    }, jumpDuration / (jumpHeight / 5));
}