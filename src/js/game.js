"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const gameCta = document.getElementById('game-cta');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const canvas = document.getElementById("breakoutCanvas");
    const ctx = canvas.getContext("2d");
    const ballRadius = 10;
    const initialBallSpeed = 4;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = initialBallSpeed;
    let dy = -initialBallSpeed;
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    const brickRowCount = 3;
    let brickColumnCount;
    let brickWidth;
    const brickHeight = 40;
    const brickPadding = 20;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    let bricks = [];
    function calculateBrickLayout() {
        const screenWidth = canvas.width;
        if (screenWidth <= 480) {
            brickWidth = 80;
        }
        else {
            brickWidth = 150;
        }
        brickColumnCount = Math.floor((screenWidth - brickOffsetLeft * 2 + brickPadding) / (brickWidth + brickPadding));
        brickWidth = (screenWidth - brickOffsetLeft * 2 - brickPadding * (brickColumnCount - 1)) / brickColumnCount;
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }
    let score = 0;
    let lives = 3;
    let gamePaused = false;
    let gameInterval;
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    canvas.addEventListener("touchstart", touchStartHandler, { passive: false });
    canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });
    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }
    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }
    function touchStartHandler(e) {
        e.preventDefault();
        const touchX = e.touches[0].clientX - canvas.offsetLeft;
        paddleX = touchX - paddleWidth / 2;
        if (paddleX < 0) {
            paddleX = 0;
        }
        else if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    function touchMoveHandler(e) {
        e.preventDefault();
        const touchX = e.touches[0].clientX - canvas.offsetLeft;
        paddleX = touchX - paddleWidth / 2;
        if (paddleX < 0) {
            paddleX = 0;
        }
        else if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            setTimeout(() => endGame("You won! Play Again?"), 100);
                        }
                    }
                }
            }
        }
    }
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "#6ddbf2";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.strokeStyle = "#6ddbf2";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.strokeStyle = "#6ddbf2";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "18px Asty-Thin";
        ctx.fillStyle = "#6ddbf2";
        ctx.fillText("Score: " + score, 8, 20);
    }
    function drawLives() {
        ctx.font = "18px Asty-Thin";
        ctx.fillStyle = "#6ddbf2";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    lives = 0;
                    setTimeout(() => endGame("You lost! Play Again?"), 100);
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = initialBallSpeed * (Math.random() < 0.5 ? -1 : 1);
                    dy = -initialBallSpeed;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
        x += dx;
        y += dy;
    }
    function startGame() {
        resetGame();
        gamePaused = false;
        gameInterval = setInterval(draw, 10);
    }
    function pauseGame() {
        gamePaused = true;
        clearInterval(gameInterval);
    }
    function resumeGame() {
        if (gamePaused) {
            gamePaused = false;
            gameInterval = setInterval(draw, 10);
        }
    }
    function resetGame() {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = initialBallSpeed * (Math.random() < 0.5 ? -1 : 1);
        dy = -initialBallSpeed;
        paddleX = (canvas.width - paddleWidth) / 2;
        rightPressed = false;
        leftPressed = false;
        calculateBrickLayout();
        score = 0;
        lives = 3;
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "";
    }
    function endGame(message) {
        pauseGame();
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = `<h3>${message}</h3> <a id="game-cta-inner" class="game-cta text-decoration-none px-4 py-2" href="javascript:void(0)">Play Again?</a>`;
        const gameCtaInner = document.getElementById("game-cta-inner");
        gameCtaInner.onclick = function () {
            messageElement.innerHTML = "";
            startGame();
        };
    }
    function resetGameState() {
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "";
    }
    gameCta.onclick = function () {
        modal.classList.remove('d-none');
        modal.classList.add('d-flex');
        startGame();
    };
    closeButton.onclick = function () {
        modal.classList.add('d-none');
        modal.classList.remove('d-flex');
        pauseGame();
        resetGameState();
    };
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.classList.add('d-none');
            modal.classList.remove('d-flex');
            pauseGame();
            resetGameState();
        }
    };
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            modal.classList.add('d-none');
            modal.classList.remove('d-flex');
            pauseGame();
            resetGameState();
        }
    });
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        calculateBrickLayout();
        resetGame();
    }
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
});
