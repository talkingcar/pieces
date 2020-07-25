const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const settings = {
  quantityOfBalls: 1,
  quantityOfBlocks: 30,
  field: {
    width: 400,
    height: 400,
  },
};

let playing = true;

let raf;

let paused = false;

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
  while (settings.quantityOfBlocks > 0) {
    const x = Math.random() * 400;
    const y = Math.random() * 400;

    blocks.push(makeBlock(x, y));
    settings.quantityOfBlocks -= 1;
  }
}

function makeBlock(x ,y) {
  const block = {
    x: x,
    y: y,
    width: 100,
    height: 100,
    solidity: 100,
    edge: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    colorHSLA: {
      h: 360,
      s: 100,
      l: 50,
      a: 1,
    },
    color: 'blue',
    
    updateColor: function () {
      this.color = colorFunctions.makeHSLA(this.colorHSLA);
    },


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
    hit: function () {
      this.solidity -= 10;
      this.colorHSLA.a -= .1;
      this.updateColor();
      console.log(blocks.indexOf(this))
      if (this.solidity <= 0) {
        const position = blocks.indexOf(this);
        blocks.splice(position,1)
      }
    }
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
    colorHSLA: {
      h: 200,
      s: 100,
      l: 50,
      a: 1,
    },
    color: 'pink',
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

    updateColor: function () {
      this.color = colorFunctions.makeHSLA(this.colorHSLA);
    },

    move: function () {
  
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      
      //alterations to velocity happen before calculating edges
      if (this.physics.gravity) {
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


    checkCollisions: function (blocks) {
      blocks.forEach((block) => {

        if (this.collideBlock(block)) {
          block.hit();
          const sideHit = this.hitDirection(block)
          
          console.log(sideHit)
          if (
            sideHit === 'left'
            || sideHit === 'right') {
            this.bounceOffVertical()
          } else if (
            sideHit === 'top'
            || sideHit === 'bottom') {
            this.bounceOffHorizontal()
          } else {
            paused = true;
            console.log('bad location' + ball.edge)
          }
        }
      }
      )
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

    //trying another hit direction
    /* calculating the edge of the ball that hits a block 
    by finding the difference between the side of the ball 
    and the corresponding side of the block 
    so if the top of the ball hits the bottom of the block,
    the top of the block will be the side farthest away.
    */
    
    // returns which side of the ball hit
    hitDirection: function (block) {
      const top = this.edge.top - block.edge.top;
      const bottom = block.edge.bottom - this.edge.bottom
      const right = block.edge.right - this.edge.right;
      const left = this.edge.left - block.edge.left;
      if (
        top > bottom
        && top > left
        && top > right
      ) {
        return 'top';
      } else if
        (
        bottom > top
        && bottom > left
        && bottom > right
      ) {
        return 'bottom';
      } else if (
        left > top
        && left > bottom
        && left > right
      ) {
        return 'left';
      } else if (
        right > top
        && right > bottom
        && right > left
      ) {
        return 'right'
      }
    },

    collideBlock: function (block) {
      if (this.edge.bottom >= block.edge.top
        && this.edge.top <= block.edge.bottom
        && this.edge.left <= block.edge.right
        && this.edge.right >= block.edge.left
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
  },
  makeHSLA: function (hsla) {
    return  `hsla(${hsla.h},${hsla.s}%,${hsla.l}%,${hsla.a})`
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
  if (paused === false) {
    raf = requestAnimationFrame(render)
  } else {
    cancelAnimationFrame(raf);
  };
}

function initialize() {
  setup();
  arrayOfBalls();
  arrayOfBlocks();
  balls.forEach((ball) => {
    ball.updateColor();
  });

  blocks.forEach((block) => {
    block.updateColor();
  });

}

canvas.addEventListener("click", function () {
  paused = !paused;
  render();
});


initialize();
render();
