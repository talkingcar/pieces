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

    edge: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    color: 'blue',
    
    calculateEdges: function () {
      this.edge.top = this.y;
      this.edge.bottom = this.y + this.height;
      this.edge.left = this.x;
      this.edge.right = this.x + this.width;
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
    edge: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    size: 15,
    width: 15,
    height: 15,
    color: 'red',
    velocity: {
      x: 2,
      y: 2,
    },
    imperfectBounce: false,
    physics: {
      gravity: false,
    },
    calculateEdges: function () {
      this.edge.top = this.y;
      this.edge.bottom = this.y + this.size;
      this.edge.left = this.x;
      this.edge.right = this.x + this.size;
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
     
      if (this.collideSideVertical()) {
        this.bounceOffVertical();
      }
      if (this.collideSideHorizontal()) {
        this.bounceOffHorizontal();
      }

      if (this.collideBlock(blocks[0])) {
        console.log(this.findCollisionDirection(blocks[0]))
        if (this.findCollisionDirection(blocks[0]) === 'left' || this.findCollisionDirection(blocks[0]) === 'right') {
          console.log('bounce v')
          this.bounceOffVertical()
        } else if (this.findCollisionDirection(blocks[0]) === 'top' || this.findCollisionDirection(blocks[0]) ===  'bottom')
        {
          console.log('bounce h')
          this.bounceOffHorizontal()
          }
      } 
    },

    collideSideHorizontal: function () {
      if (ball.edge.top <= 0
        || ball.edge.bottom >= settings.field.height) {
        return true;
      }
    },

    collideSideVertical: function () {
      if (ball.edge.left <= 0
        || ball.edge.right >= settings.field.width) {
        return true;
      }
    },

    findCollisionDirection: function (block) {
      if (this.y <= block.y + block.height && this.y + this.height > block.y + block.height && this.x > block.x - this.width && this.x + this.width > block.x + block.width + this.width) {
        return 'top';
      } else if (this.y + this.height >= block.y && this.y < block.y && this.x > block.x - this.width && this.x + this.width < block.x + block.width + this.width) {
        return 'bottom';
      } else if (this.x <= block.x + block.width && this.x + this.width > block.x + block.width &&  this.y > block.y - this.height && this.y + this.height < block.y + block.height + this.height) {
        return 'left';
      } else if (this.x + this.width >= block.x && this.x < block.x && this.y > block.y - this.height && this.y + this.height < block.y + block.height + this.height ) {
        return 'right';
      } else {
        console.log('collision error')
      }
    },


    collideBlock: function (block) {
      if (this.y + this.height >= block.y
        && this.y <= block.y + block.height
        && this.x <= block.x + block.width
        && this.x + this.width >= block.x
      ) {
        console.log('block');
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
