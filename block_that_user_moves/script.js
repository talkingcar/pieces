const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let raf;

function setup() {
  ctx.canvas.width = settings.field.width;
  ctx.canvas.height = settings.field.height;
}

const settings = {
  field: {
    width: window.innerWidth,
    height: window.innerHeight,
    color: "grey"
  },
  blockSize: window.innerWidth / 7,
  physics: {
    gravity: false
  }
}

const blockOne = makeBlock(
  settings.field.width * .5,
  settings.field.height * .75,
  'lightgrey',
  true);



const blockTwo = makeBlock(
  1, 2
);

const blocks = [blockOne];

const ballOne = makeBall()

const currentInput = {
  up: false,
  down: false,
  left: false,
  right: false,
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

function keyDownHandler(event) {
  if (
    event.key == "ArrowUp" || 
    event.key == "w") {
      event.preventDefault();
      currentInput.up = true;
  }
  
  if (
    event.key == "ArrowDown" ||
    event.key == "s") {
      event.preventDefault();
      currentInput.down = true;
  }
  
  if (
    event.key == "ArrowLeft" ||
    event.key == "a") {
      event.preventDefault();
      currentInput.left = true;
  }
  
  if (
    event.key == "ArrowRight" ||
    event.key == "d") {
      event.preventDefault();
      currentInput.right = true;
  }
}

function keyUpHandler(event) {
  if (
    event.key == "ArrowUp" || 
    event.key == "w") { 
    currentInput.up = false;
  }
  
  if (
    event.key == "ArrowDown" ||
    event.key == "s") {
    currentInput.down = false;
  }

  if (
    event.key == "ArrowLeft" ||
    event.key == "a") {
    currentInput.left = false;
  }
  
  if (
    event.key == "ArrowRight" ||
    event.key == "d") {
    currentInput.right = false;
  }
}

const field = {
  draw: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = settings.field.color;
    ctx.fillRect(0, 0, settings.field.width, settings.field.height);
  },
};


//brought ball in from ball that bounces
function makeBall() {
  const ball = {
    x: window.innerWidth/2,
    y: window.innerHeight/9,
    edge: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    path: [],
    size: 15,
    width: 15,
    height: 15,
    colorHSLA: {
      h: 200,
      s: 100,
      l: 50,
      a: 1,
    },
    color: "pink", //default, overwritten if color functions working
    velocity: {
      x: 3,
      y: 3,
    },
    imperfectBounce: false,

    calculateEdges: function () {
      this.edge.top = this.y;
      this.edge.bottom = this.y + this.size;
      this.edge.left = this.x;
      this.edge.right = this.x + this.size;
    },

    updateColor: function () {
      this.color = colorFunctions.makeHSLA(this.colorHSLA);
    },

    move: function () {
      //saves this move to path
      this.path.push([this.x, this.y]);

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      //alterations to velocity happen before calculating edges
      if (settings.physics.gravity) {
        this.gravity();
      }

      if (this.imperfectBounce) {
        this.velocity.x += this.imperfection();
        this.velocity.y += this.imperfection();
        this.imperfectBounce = false;
      }

      //find edges of ball then check for collision
      this.calculateEdges();

      if (this.collideSideVertical()) {
        this.bounceOffVertical();
      }
      if (this.collideSideHorizontal()) {
        this.bounceOffHorizontal();
      }

      this.checkCollisions(blocks);
    },

    /*checks for collisions with blocks
    if collision, checks for direction (which side of the ball hit)
    */
    checkCollisions: function (blocks) {
      blocks.forEach((block) => {
        if (this.collideBlock(block)) {
          block.hit = true;
          const sideHit = this.hitDirection(block);
          if (sideHit === "left" || sideHit === "right") {
            this.bounceOffVertical();
          } else if (sideHit === "top" || sideHit === "bottom") {
            this.bounceOffHorizontal();
          } else {
            //stops if glitch, for troubleshooting
            paused = true;
            console.log("bad location" + ball.edge);
          }
        }
      });
    },

    //checks for collisions with walls top and bottom
    collideSideHorizontal: function () {
      if (ball.edge.top <= 0 || ball.edge.bottom >= settings.field.height) {
        return true;
      }
    },

    //check for collisions with walls left and right
    collideSideVertical: function () {
      if (ball.edge.left <= 0 || ball.edge.right >= settings.field.width) {
        return true;
      }
    },

    //trying another hit direction
    /* calculating the edge of the ball that hits a block 
    by finding the difference between the side of the ball 
    and the corresponding side of the block 
    so if the top of the ball hits the bottom of the block,
    the top of the block will be the side farthest away.
    */

  // THIS ONLY WORKS IF BLOCKS ARE SQUARE
    //DOESN'T WORK RIGHT IF BOTH BLOCKS ARE MOVING!!

    // returns which side of the ball hit
    hitDirection: function (block) {
      const top = this.edge.top - block.edge.top;
      const bottom = block.edge.bottom - this.edge.bottom;
      const right = block.edge.right - this.edge.right;
      const left = this.edge.left - block.edge.left;
      const direction = Math.max(top,bottom,right,left);
      if (direction === top) {
        return "top";
      } else if (direction===bottom) {
        return "bottom";
      } else if (direction===left) {
        return "left";
      } else if (direction===right) {
        return "right";
      }
    },

    collideBlock: function (block) {
      if (
        this.edge.bottom >= block.edge.top &&
        this.edge.top <= block.edge.bottom &&
        this.edge.left <= block.edge.right &&
        this.edge.right >= block.edge.left
      ) {
        return true;
      }
    },

    bounceOffVertical: function () {
      this.velocity.x = -this.velocity.x;
      this.imperfectBounce = true;
    },

    bounceOffHorizontal: function () {
      this.velocity.y = -this.velocity.y;
      this.imperfectBounce = true;
    },

    //adds a bit of randomness to bounce
    imperfection: function () {
      return Math.random() * 0.1;
    },

    //reduces velocity of ball, need to make it work with imperfection
    gravity: function () {
      this.velocity.y *= 0.99;
      this.velocity.y += 0.25;
    },

    //path the ball has traveled
    drawPath: function () {
      this.path.forEach((xy) => {
        ctx.fillStyle = this.color;
        ctx.fillRect(xy[0], xy[1], this.size, this.size);
      });
    },

    draw: function () {
      this.move();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
      //this.drawPath();
    },
  };
  return ball;
}
function makeBlock(x,y,color = 'pink', isActive = false) {
  const block = {
    isActive: isActive,
    x: x,
    y: y,
    width: settings.blockSize,
    height: settings.blockSize,
    color: color,
    speed: 3,
    edge: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },

    calculateEdges: function () {
      this.edge.top = this.y;
      this.edge.bottom = this.y + this.height;
      this.edge.left = this.x;
      this.edge.right = this.x + this.width;
    },


    inputMove: function () {
      if (currentInput.up) {
        this.y = Math.abs(this.y - this.speed);
      }
      if (currentInput.down) {
        this.y += this.speed;
      }
      if (currentInput.left) {
        this.x = (this.x - this.speed);
      }
      if (currentInput.right) {
        this.x = (this.x + this.speed);
      }
    },

    draw: function () {
      this.calculateEdges();
      if (this.isActive) {
        this.inputMove()
      };
      ctx.shadowColor = "black";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  return block
}


//copied  dpad from older work on glitch 
dpad.addEventListener("touchstart", dpadDownHandler);
dpad.addEventListener("touchend", dpadUpHandler);

function dpadDownHandler(event) {
  event.preventDefault();
  if (event.target.id == "up") {
   currentInput.up = true;
  }
  else if (event.target.id == "down") {
   currentInput.down = true;
  }
  else if (event.target.id == "right") {
    currentInput.right = true;
  }
  else if (event.target.id == "left") {
    currentInput.left = true;
  }
}

function dpadUpHandler(event) {
  if (event.target.id == "up") {
   currentInput.up = false;
  }
  else if (event.target.id == "down") {
   currentInput.down = false;
  }
  else if (event.target.id == "right") {
    currentInput.right = false;
  }
  else if (event.target.id == "left") {
   currentInput.left = false;
  }
}


function render() {
  field.draw();
  //blockTwo.draw();
  blockOne.draw();
  ballOne.draw();
  raf = requestAnimationFrame(render);
}

setup();
raf = requestAnimationFrame(render);