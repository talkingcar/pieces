const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let raf;

function setup() {
  ctx.canvas.width = settings.field.width;
  ctx.canvas.height = settings.field.height;
}

const settings = {
  field: {
    width: 500,
    height: 500,
    color: "grey"
  }
}
const blockOne = makeBlock(
  settings.field.width * .5,
  settings.field.height * .75,
  'lightgrey',
  true);

const blockTwo = makeBlock(
  1,2
)

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

function makeBlock(x,y,color = 'pink', isActive = false) {
  const block = {
    isActive: isActive,
    x: x,
    y: y,
    width: 50,
    height: 10,
    color: color,
    speed: 2,

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
      if (currentInput.right)
        this.x = (this.x + this.speed);
      console.log(this.x,this.y)
    },

    draw: function () {
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

function render() {
  field.draw();
  blockTwo.draw();
  blockOne.draw();
  raf = requestAnimationFrame(render);
}

setup();
raf = requestAnimationFrame(render);