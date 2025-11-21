// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//Getting the location of the canvas
const canvasRect = canvas.getBoundingClientRect();

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

//Variable for game status
var isGameActive = false;

//Creating button
createCenteredButton("Start Game");

//Creating the start button
function createCenteredButton(text) {
  //Math for center of the canvas
  var top = canvasRect.top + ((canvasRect.bottom - canvasRect.top) / 2);
  var left =  canvasRect.left + ((canvasRect.right - canvasRect.left) / 2);

  var startGameButton = document.createElement("BUTTON");
  startGameButton.innerHTML = text;
  startGameButton.id = "btn-startGame";
  startGameButton.onclick = startGame;
  startGameButton.style.position = "absolute";
  startGameButton.style.left = left + "px";
  startGameButton.style.top = top + "px";

  document.body.appendChild(startGameButton);
}

//Function to start the Game
function startGame() {
  var startGameButton = document.getElementById("btn-startGame");
  
  // 1. Check if the button exists before trying to remove it
  if (startGameButton) {
      startGameButton.remove();
  }
  
  // 2. Set the game status to active
  isGameActive = true;

  resetGame();
  
  // 3. Start the game loop by calling it for the first time
  loop();
}


//Creation of the variable to interact with the paragraph
const ballCountParagraph = document.querySelector("p");

//Global variable for the total ball count
let ballTotal = 0;

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class EvilCircle extends Shape{
  constructor(x,y) {
    super(x, y, 20, 20);
    this.size = 10;
    this.color = `rgb(255, 255, 255)`;

    //Code Segment taken from Lab Materials
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= width) {
      this.x = width - this.size;
    }

    if (this.x - this.size <= 0) {
      this.x = width + this.size;
    }

    if (this.y + this.size >= height) {
      this.y = height - this.size;
    }

    if (this.y - this.size <= 0) {
      this.y = height + this.size;
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists == true) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          //Whenever a ball no longer exists subtract one from total ball count
          ballTotal--;
        }
      }
    }
  }
}

class Ball extends Shape{
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;

    //Whenever a ball is created add 1 to ballTotal
    ballTotal++;
  }
  

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists == true) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

const balls = [];

function resetGame() {
    // Reset the count and clear the array
    ballTotal = 0;
    balls.length = 0; // Efficiently clears the array

    // Repopulate the balls array
    while (balls.length < 5) {
      const size = random(10, 20);
      const ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size
      );

      balls.push(ball);
    }
    
    // Reset the Evil Circle's position
    evilCircle.x = width / 2;
    evilCircle.y = height / 2;
}

//Creating the Evil Circle at the center of the screen
const evilCircle = new EvilCircle(width/2, height/2);

resetGame();

function loop() {
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if(ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();


  ballCountParagraph.textContent = "Ball Count: " + ballTotal;

  if(ballTotal == 0) {
    isGameActive = false;
  }

  if(isGameActive) {
    requestAnimationFrame(loop);
  } else {
    createCenteredButton("Try Again?");
    return;
  }

}