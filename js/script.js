import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const db = window.firestoreDB;

let music = new Audio('../audio/1.mp3');
music.play();
music.loop = true;

//hoverImg
window.onload = function() {
    var hoverButton = document.getElementById("sp1");
    var hoverButton2 = document.getElementById("sp2");
    var hoverImage = document.getElementById("hoverImage");
    var hoverImage2 = document.getElementById("hoverImage2");

    hoverButton.addEventListener("mouseenter", function(event) {
        hoverImage.classList.remove("hiddenImg");
        hoverImage.style.top = event.clientY + "px";
        hoverImage.style.left = event.clientX + "px";
    });

    hoverButton.addEventListener("mouseleave", function() {
        hoverImage.classList.add("hiddenImg");
    });

    hoverButton2.addEventListener("mouseenter", function(event) {
        hoverImage2.classList.remove("hiddenImg");
        hoverImage2.style.top = event.clientY + "px";
        hoverImage2.style.left = event.clientX + "px";
    });

    hoverButton2.addEventListener("mouseleave", function() {
        hoverImage2.classList.add("hiddenImg");
    });
};

//fullscreen
document.getElementById("fullscreenBtn").addEventListener("click", function() {
    document.getElementById("fullScreenImage").classList.remove("imgHidden");
});

document.getElementById("closeBtn").addEventListener("click", function() {
    document.getElementById("fullScreenImage").classList.add("imgHidden");
});

// Close the image if user clicks outside of it
document.getElementById("fullScreenImage").addEventListener("click", function(event) {
    if (event.target === this) {
        this.classList.add("imgHidden");
    }
});

//preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const content = document.querySelector('.site-container');
    
    preloader.style.display = 'none';
    content.style.display = 'block';
});

//game
const modal = document.getElementById("modal");
const walletConnectBtn = document.getElementById("walletConnectBtn");
const closeModal = document.getElementsByClassName("close")[0];
const gameMenu = document.getElementById('game-menu');
const gameBtn = document.getElementById('gameBtn');
const walletSpan = document.getElementById('myWallet');

const gameInterface = document.getElementById('gameInterface');
const menuInterface = document.getElementById('menuInterface');

async function checkConnect() {
    let accounts = await window.unisat.requestAccounts();

    if (typeof window.unisat !== "undefined") {
        walletSpan.textContent = accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4);
        loadHighScore(accounts[0]);
    } else {
        alert('Please install Unisat Wallet extension.');
    }
}

gameBtn.onclick = function() {
    checkConnect();
    loadLeaderboard();
}

walletConnectBtn.onclick = function() {
    modal.style.display = "block";
}

closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Unisat
document.getElementById("unisatBtn").onclick = function() {
    connectWallet();
}

// Xverse
document.getElementById("xverseBtn").onclick = function() {
    alert('Пока нету')
}

async function connectWallet() {
    if (typeof window.unisat !== "undefined") {
        try {
            let accounts = await window.unisat.requestAccounts();
            modal.style.display = "none";
            
            walletSpan.textContent = accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4); 
            loadHighScore(accounts[0]);
        } catch (e) {
            console.log('connect failed', e);
            alert('Failed to connect to Unisat wallet. Please try again.');
        }
    } else {
        alert('Please install Unisat Wallet extension.');
    }
}
//----
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const leaderBtn = document.getElementById('leaderBtn');
const game = document.getElementById('game');
const leaderBoard = document.getElementById('leaderboard');
const pausedText = document.getElementById('pausedText');

let isJumping = false;
let isPaused = false;

let score = 0;
let highScore = 0;
let jumpHeight = 150;
let cactusSpeed = 2;  // Initial speed of the cactus
let scoreIncrement = 10;  // Initial score increment
let cactusCount = 0;  // Track the number of cacti on screen

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        jump();
    }

    if (event.key === 'p' || event.key === 'P') {
        togglePause();
    } 

    if (event.key === 'п' || event.key === 'П') {
        togglePause();
    } 
});

startBtn.addEventListener('click', function() {
    startGame();
});

let gameInterval;
let scoreInterval;

let gamePlay = new Audio('../audio/game.mp3');
let gameOver = new Audio('../audio/gameOver.mp3');

function startGame() {
    music.pause();

    gamePlay.play();
    gamePlay.loop = true;

    menuInterface.style.display = 'none';
    gameInterface.style.display = 'block';

    score = 0;
    jumpHeight = 150;
    cactusSpeed = 2;
    scoreIncrement = 10;
    cactusCount = 0;
    scoreElement.textContent = `Score: ${score}`;
    startBtn.style.display = 'none';
    pausedText.textContent = '[P] - paused';
    pausedText.style.color = "#fff";

    document.querySelectorAll('.cactus').forEach(cactus => cactus.remove());
    
    for (let i = 0; i < 3; i++) {
        addCactus();
    }

    gameInterval = setInterval(() => {
        if (isPaused) return;

        const dinoBottom = dino.offsetTop + dino.offsetHeight;
        const dinoLeft = dino.offsetLeft;
        const dinoRight = dino.offsetLeft + dino.offsetWidth;

        document.querySelectorAll('.cactus').forEach(cactus => {
            const cactusLeft = cactus.offsetLeft;
            const cactusRight = cactus.offsetLeft + cactus.offsetWidth;

            if (cactusLeft < dinoRight && cactusRight > dinoLeft && dinoBottom >= 150) {
                endGame();
            }

            if (cactusLeft + cactus.offsetWidth < 0) {
                cactus.remove();
                cactusCount--;
            }
        });

        if (Math.random() < 0.02) { 
            addCactus();
        }
    }, 50);

    scoreInterval = setInterval(() => {
        if (isPaused) return;

        score += scoreIncrement;
        scoreElement.textContent = `Score: ${score}`;

        if (score < 50) {
            jumpHeight = Math.max(100, jumpHeight - 5); 
            cactusSpeed = Math.max(1, cactusSpeed - 0.1);
            scoreIncrement = Math.min(50, scoreIncrement + 10); 
        }
    }, 10000);
}

function addCactus() {
    if (cactusCount >= 4) return; 
    const cactus = document.createElement('div');
    cactus.classList.add('cactus');
    cactus.style.right = '-30px'; 
    cactus.style.animation = `moveCactus ${cactusSpeed}s linear infinite`;
    game.appendChild(cactus);
    cactusCount++;
}

function jump() {
    if (isJumping || isPaused) return;
    isJumping = true;
    const jumpDuration = 250;
    const jumpStep = 5;
    const upInterval = setInterval(() => {
        if (dino.offsetTop <= (150 - jumpHeight)) {
            clearInterval(upInterval);
            const downInterval = setInterval(() => {
                if (dino.offsetTop >= 150) {
                    clearInterval(downInterval);
                    isJumping = false;
                }
                dino.style.top = `${dino.offsetTop + jumpStep}px`;
            }, jumpDuration / (jumpHeight / jumpStep));
        }
        dino.style.top = `${dino.offsetTop - jumpStep}px`;
    }, jumpDuration / (jumpHeight / jumpStep));
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
        clearInterval(scoreInterval);
        gamePlay.pause();
        document.querySelectorAll('.cactus').forEach(cactus => {
            cactus.style.animationPlayState = 'paused';
        });
        pausedText.textContent = '[P] - continue';
        pausedText.style.color = "red";
    } else {
        gameInterval = setInterval(() => {
            if (isPaused) return;

            const dinoBottom = dino.offsetTop + dino.offsetHeight;
            const dinoLeft = dino.offsetLeft;
            const dinoRight = dino.offsetLeft + dino.offsetWidth;

            document.querySelectorAll('.cactus').forEach(cactus => {
                const cactusLeft = cactus.offsetLeft;
                const cactusRight = cactus.offsetLeft + cactus.offsetWidth;

                if (cactusLeft < dinoRight && cactusRight > dinoLeft && dinoBottom >= 150) {
                    endGame();
                }
            });

            document.querySelectorAll('.cactus').forEach(cactus => {
                if (cactus.offsetLeft + cactus.offsetWidth < 0) {
                    cactus.remove();
                    cactusCount--;
                }
            });

            if (Math.random() < 0.1) {  
                addCactus();
            }
        }, 50);

        scoreInterval = setInterval(() => {
            score += scoreIncrement;
            scoreElement.textContent = `Score: ${score}`;
        }, 10000);

        document.querySelectorAll('.cactus').forEach(cactus => {
            cactus.style.animationPlayState = 'running';
        });
        gamePlay.play();
        pausedText.textContent = '[P] - paused';
        pausedText.style.color = "#fff";
    }
}

async function endGame() {
    clearInterval(gameInterval);
    clearInterval(scoreInterval);

    document.querySelectorAll('.cactus').forEach(cactus => cactus.remove());

    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = `Record: ${highScore}`;
    }
    let accounts = await window.unisat.requestAccounts();
    saveScoreToFirebase(accounts[0], score);
    startBtn.style.display = 'inline-block';

    // music.play();

    gameOver.play();
    gamePlay.pause();

    menuInterface.style.display = 'flex';
    gameInterface.style.display = 'none';
}

async function saveScoreToFirebase(walletSpan, score) {
    try {
        const docRef = doc(db, "scores", walletSpan);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const existingScore = docSnap.data().score;
            
            if (score >= existingScore) {
                await setDoc(docRef, {
                    address: walletSpan,
                    score: score
                });
                console.log("Points saved successfully!");
            } else {
                console.log("New score is less than the existing score. No update made.");
            }
        } else {
            await setDoc(docRef, {
                address: walletSpan,
                score: score
            });
            console.log("Points saved successfully!");
        }
    } catch (error) {
        console.error("Error saving points: ", error);
    }
}

async function loadHighScore(walletSpan) {
    try {
        const docRef = doc(db, "scores", walletSpan);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            highScore = docSnap.data().score;
            highScoreElement.textContent = `Record: ${highScore}`;
        } else {
            console.log("No data for user");
        }
    } catch (error) {
        console.error("Error loading high score: ", error);
    }
}

async function loadLeaderboard(userWalletAddress) {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';

    try {
        const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        let rank = 1;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const isCurrentUser = data.address === userWalletAddress;
            const displayName = isCurrentUser ? `${data.address.slice(0, 6) + "..." + data.address.slice(-4)} (You)` : data.address;
            const listItem = document.createElement('li');
            listItem.textContent = `${rank}. ${displayName.slice(0, 6) + "..." + displayName.slice(-4)}, Score: ${data.score}`;
            leaderboardElement.appendChild(listItem);
            rank++;
        });
    } catch (error) {
        console.error("Error loading leaderboard: ", error);
    }
}
