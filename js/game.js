//Defining Key strokes for non stutter movement on Evil Sphere
const keys = {
  left: false,
  right: false
};

const MaxBalls = 15;

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

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Bullet extends Shape{
  constructor(x) {
    super(x, height - 40, 0, 10);
    this.size = 5;
    this.color = `rgb(255, 0, 0)`;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.y - this.size <= 0) {
      const indexBullets = bullets.indexOf(this);
      if(indexBullets > -1) {
        bullets.splice(indexBullets, 1);
      }
    }
    this.y -= this.velY;
  }
  
  collisionDetect() {
    for (const ball of balls) {
      const dx = this.x - ball.x;
      const dy = this.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + ball.size) {
        //Removing the Ball and Bullet 

        const indexBalls = balls.indexOf(ball);
        if(indexBalls > -1) {
           balls.splice(indexBalls, 1);
        }

        const indexBullets = bullets.indexOf(this);
        if(indexBullets > -1) {
           bullets.splice(indexBullets, 1);
        }

        score += 1;
      }
    }
  }
}

class EvilCircle extends Shape{
  constructor(x,y) {
    super(x, y, 10, 10);
    this.size = 15;
    this.color = `rgb(255, 255, 255)`;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          keys.left = true;
          break;
        case "d":
          keys.right = true;
          break;
        case "w":
          summonBullet(this.x);
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "a":
          keys.left = false;
          break;
        case "d":
          keys.right = false;
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
    if (this.x + this.size >= (width - this.size)) {
      this.x = width - 3 * this.size;
    }

    if (this.x - this.size <= this.size) {
      this.x = 3 * this.size;
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      const dx = this.x - ball.x;
      const dy = this.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + ball.size) {
        isGameActive = false;
      }
    }
  }
}


class Ball extends Shape{
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
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
      if (!(this === ball)) {
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

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

const bullets = [];

function summonBullet(x) {
  const bullet = new Bullet(x);
  bullets.push(bullet);
}

//Creation of the variable to interact with the paragraph
const ballCountParagraph = document.querySelector("p");

//Global variable for the total ball count
let score = 0;

const balls = [];

function resetGame() {
    // Reset the count and clear the array
    score = 0;
    balls.length = 0; // Efficiently clears the array
    bullets.length = 0;

    // Repopulate the balls array
    while (balls.length < MaxBalls) {
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
}

//Creating the Evil Circle at the center of the screen
const evilCircle = new EvilCircle(width/2, height - 30);

resetGame();

function loop() {
  //Movement for evilCircle
  if(keys.left) { 
    evilCircle.x -= evilCircle.velX;
  }
  if(keys.right) { 
    evilCircle.x += evilCircle.velX;
  }
  
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  while(balls.length < MaxBalls) {
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

  for (const ball of balls) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
  }

  for (const bullet of bullets) {
    bullet.draw();
    bullet.collisionDetect();
    bullet.update();
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();


  ballCountParagraph.textContent = "Score: " + score;

  if(isGameActive) {
    requestAnimationFrame(loop);
  } else {
    let nick = prompt("What nickname would you like stored for the score: " + score);
    sendData(nick);
    createCenteredButton("Try Again?");
    return;
  }

}


let tableData = [];

function sendData(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://cfsl49smnb.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        "id": String(tableData.length),
        "score": String(score),
        "name": name
    }));

    xhr.addEventListener("load", loadData);
}

loadData();

function loadData() {
    //Clear Existing Table
    const table = document.getElementById('db_table');
    while(table.rows[1]) {
        table.rows[1].remove();
    }


    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.addEventListener("load", function () {
        addToTable(xhr.response);
        tableData = xhr.response;
    });
    xhr.open("GET", "https://cfsl49smnb.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

function addToTable(response) {
    response = response.sort((a,b) => b.score - a.score);
    let table = document.getElementById("db_table");
    let min = Math.min(response.length, 5);
    for(let i = min; i > 0; i--) {
        var row = table.insertRow(1);

        var rowName = row.insertCell(0);
        var rowScore = row.insertCell(1);

        // Add some text to the new cells:
        rowName.innerHTML = response[i - 1].name;
        rowScore.innerHTML = response[i - 1].score;  
    }
}