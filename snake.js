const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const grid = 20;
let count = 0;
let snake = [{ x: 160, y: 160 }];
let dx = grid;
let dy = 0;
let food = { x: 320, y: 320 };
let score = 0;
let gameOver = false;

// Restart 버튼 생성
const restartBtn = document.createElement('button');
restartBtn.textContent = 'Restart';
restartBtn.style.display = 'none';
restartBtn.style.marginTop = '20px';
document.body.appendChild(restartBtn);
restartBtn.onclick = function() {
    resetGame();
    this.style.display = 'none';
    requestAnimationFrame(gameLoop);
};

function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
        y: Math.floor(Math.random() * (canvas.height / grid)) * grid
    };
}

function gameLoop() {
    if (gameOver) return;
    requestAnimationFrame(gameLoop);

    if (++count < 8) return; // 속도 느리게
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Snake 이동
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 먹이 먹기
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    // 벽 충돌
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height
    ) {
        endGame();
        return;
    }

    // 자기 몸 충돌
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    // Snake 그리기
    ctx.fillStyle = '#0f0';
    snake.forEach(part => ctx.fillRect(part.x, part.y, grid-2, grid-2));

    // Food 그리기
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, grid-2, grid-2);

    // 점수 표시
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function resetGame() {
    snake = [{ x: 160, y: 160 }];
    dx = grid;
    dy = 0;
    food = getRandomFoodPosition();
    score = 0;
    gameOver = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function endGame() {
    gameOver = true;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width/2, canvas.height/2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 20);
    restartBtn.style.display = 'inline-block';
    ctx.textAlign = 'start';
}

document.addEventListener('keydown', function(e) {
    if (gameOver) return;
    if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -grid; dy = 0;
    } else if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0; dy = -grid;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = grid; dy = 0;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0; dy = grid;
    }
});

requestAnimationFrame(gameLoop);
