const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const settings = {
  quantityOfBalls: 1,
  field: {
    width: 400,
    height: 400,
  },
};

let playing = true;

let raf;




function setup() {
  ctx.canvas.width = settings.field.width;
  ctx.canvas.height = settings.field.height;
}

let balls = [];
let blocks = [];

function arrayOfBalls() {
  while (settings.quantityOfBalls > 0) {
    balls.push(makeBall());
    settings.quantityOfBalls -= 1;
  }
}

function arrayOfBlocks() {
  blocks.push(makeBlock());
}

function makeBlock() {
  const block = {
    x: 185,
    y: 160,
    width: 100,
    height: 100,

    edges: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    color: 'blue',
    
    calculateEdges: function () {
      this.edges.top = this.y;
      this.edges.bottom = this.y + this.height;
      this.edges.left = this.x;
      this.edges.right = this.x + this.width;
    },
    draw: function () {
      this.calculateEdges();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    },
  };
  return block;
}

function makeBall() {
  const ball = {
    x: 0,
    y: 1,
    edges: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    size: 15,
    color: colorFunctions.randomHSLA(),
    velocity: {
      x: 2,
      y: 2,
    },
    imperfectBounce: false,
    physics: {
      gravity: false,
    },
    calculateEdges: function () {
      this.edges.top = this.y;
      this.edges.bottom = this.y + this.size;
      this.edges.left = this.x;
      this.edges.right = this.x + this.size;
    },

    move: function () {
  
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.calculateEdges();
      if (this.physics.gravity) {
        this.gravity();
      }
      if (this.imperfectBounce) {
        this.velocity.x += this.imperfection();
        this.velocity.y += this.imperfection();
        this.imperfectBounce = false;
      }
      if (this.collideVertical()) {
        this.bounceVertical();
      }
      if (this.collideHorizontal()) {
        this.bounceHorizontal();
      }
      if (this.collideBlock(blocks[0])) {
        this.bounceHorizontal();
      }
      if (this.collideBlockSides(blocks[0])) {
        this.bounceVertical();
      }
    },

    collideVertical: function () {
      if (ball.edges.left <= 0 || ball.edges.right >= settings.field.width) {
        return true;
      }
    },

    collideHorizontal: function () {
      if (ball.edges.top <= 0 ||
          ball.edges.bottom >= settings.field.height) {
        return true;
      }
    },

    collideBlock: function (block) {
      if (this.edges.bottom > block.edges.top
        && this.edges.bottom < block.edges.bottom
        && this.edges.right > block.edges.left
        && this.edges.left < block.edges.right) {
        console.log('top')
        return true;
      }
      if (this.edges.top < block.edges.bottom
        && this.edges.bottom > block.edges.bottom
        && this.edges.right > block.edges.left
        && this.edges.left < block.edges.right) {
        console.log('bottom')
        return true
      }
    },

    collideBlockSides: function (block) {
      //console.log('check sides')
      if (this.edges.right >= block.edges.left
        && this.edges.left <= block.edges.left
        && this.edges.top < block.edges.bottom
        && this.edges.bottom > block.edges.top
      ) {
        console.log('bounce right edge')
        return true;
      }
      if (this.edges.left >= block.edges.right
        && this.edges.right >= block.edges.right
        && this.edges.top < block.edges.bottom
        && this.edges.bottom > block.edges.top
      ) {
        console.log('bounce left edge')
        return true
      }
    },

    bounceVertical: function () {
      this.velocity.x = -this.velocity.x;
      this.imperfectBounce = true;
    },

    bounceHorizontal: function () {
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

    draw: function () {
      this.move();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
    },
  };

  return ball;
}

const field = {
  draw: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, settings.field.width, settings.field.height);
  },
};

const colorFunctions = {
  random: function () {
    return `rgb(
      ${Math.floor(255 * Math.random())},
      ${Math.floor(255 * Math.random())},
      ${Math.floor(255 * Math.random())}
    )`;
  },
  randomHSLA: function () {
    return `hsla(
      ${Math.floor(360 * Math.random())},
      100%,
      50%,
      1
    )`
  }
}

function render() {
  field.draw();
  balls.forEach((ball) => {
    ball.draw();
  });
  blocks.forEach((block) => {
    block.draw();
  });
  raf = requestAnimationFrame(render);
}

function pause() {
  cancelAnimationFrame(raf);
}

canvas.addEventListener("click", function () {
  if (playing) {
    pause();
    playing = false;
  } else {
    render();
    playing = true;
  }
});

arrayOfBalls();
arrayOfBlocks();

setup();

render();
