let board = document.getElementById("board"); 
let context = board.getContext("2d");

// Set canvas size (Match your CSS)
board.width = 360;
board.height = 640;

// Bird variables
let birdX = 50;
let birdY = 250;
let birdWidth = 34;
let birdHeight = 24;
let gravity = 0.28;
let velocity = 0;

// Pipe variables
let pipes = [];
let pipeWidth = 64;
let pipeGap = 150;
let basePipeSpeed = -2;
let pipeSpeed = basePipeSpeed;
let maxPipeSpeed = -6;
let score = 0;
let gameOver = false;
let pipeDistance = 200;

function spawnPipe() {
    if (gameOver) return;
    // Random height for the top pipe
    let randomPipeY = -150 - Math.random() * 200; 
    pipes.push({
        x: board.width,
        y: randomPipeY,
        width: pipeWidth,
        height: 400,
        passed: false
    });
}


function update() {
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "40px sans-serif";
        context.fillText("GAME OVER", 50, 300);
        return; 
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
   
    if (pipes.length === 0 || pipes[pipes.length - 1].x < board.width - pipeDistance) {
        spawnPipe();
    }

    // 1. Bird Physics
    velocity += gravity;
    birdY += velocity;
    
    // Draw Bird
    context.fillStyle = "yellow";
   context.fillStyle = "yellow"; 
context.fillRect(birdX, birdY, birdWidth, birdHeight); // The Body

// Add an Eye (Small black square)
context.fillStyle = "black";
context.fillRect(birdX + 22, birdY + 5, 4, 4);

// Add a Beak (Orange rectangle)
context.fillStyle = "orange";
context.fillRect(birdX + 30, birdY + 12, 8, 6);

    // 2. Pipe Logic
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x += pipeSpeed;

        // Draw Top Pipe
        context.fillStyle = "green";
       let pipeGradient = context.createLinearGradient(p.x, 0, p.x + p.width, 0);
pipeGradient.addColorStop(0, "#228B22");  // Dark green edge
pipeGradient.addColorStop(0.5, "#55dd55"); // Light center highlight
pipeGradient.addColorStop(1, "#228B22");  // Dark green edge

context.fillStyle = pipeGradient;

// Top Pipe
context.fillRect(p.x, p.y, p.width, p.height);
context.strokeStyle = "black"; // Add a crisp border
context.strokeRect(p.x, p.y, p.width, p.height);

// Bottom Pipe
context.fillRect(p.x, p.y + p.height + pipeGap, p.width, board.height);
context.strokeRect(p.x, p.y + p.height + pipeGap, p.width, board.height);

       

        // Score Check
        if (!p.passed && birdX > p.x + p.width) {
            score++;
            p.passed = true;

            // Increase difficulty as score increases
            let speedStep = Math.floor(score / 5) * 0.3;
            pipeSpeed = Math.max(maxPipeSpeed, basePipeSpeed - speedStep);
        }

        // Collision Detection
        if (birdX < p.x + p.width && 
            birdX + birdWidth > p.x &&
            (birdY < p.y + p.height || birdY + birdHeight > p.y + p.height + pipeGap)) {
            gameOver = true;
        }
    }

    // Ground/Ceiling Collision
    if (birdY > board.height || birdY < 0) {
        gameOver = true;
    }

    // Clean up off-screen pipes
    pipes = pipes.filter(p => p.x + p.width > 0);

    // 3. Draw Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
}

// Controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        velocity = -6;
        if (gameOver) location.reload(); // Restart on click if dead
    }
});

update();