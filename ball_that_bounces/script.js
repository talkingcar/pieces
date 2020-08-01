const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const settings = {
  quantityOfBalls: 1,
  quantityOfBlocks: 30,
  field: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    gravity: false,
  },
};

let paused = false;

let raf;

let balls = [];
let blocks = [];

//this is done in a mixed up way, see at field.draw(), fix
function setup() {
  ctx.canvas.width = settings.field.width;
  ctx.canvas.height = settings.field.height;
}

function arrayOfBalls() {
  while (settings.quantityOfBalls > 0) {
    balls.push(makeBall());
    settings.quantityOfBalls -= 1;
  }
}

function arrayOfBlocks() {
  while (settings.quantityOfBlocks > 0) {
    const x = Math.random() * settings.field.width;
    const y = Math.random() * settings.field.height;

    blocks.push(makeBlock(x, y));
    settings.quantityOfBlocks -= 1;
  }
};

/*make a block that is controlled by user
using touch controls, wasd, arrow keys.
can be driven around through field of blocks. 
maybe can shoot balls??? has a different reaction to ball hitting it.
*/
function userBlock() {
  
};



function makeBlock(x, y) {
  const block = {
    x: x,
    y: y,
    width: 100,
    height: 100,
    solidity: 100,
    hit: false,
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
    color: "blue",

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
      if (this.hit) {
        this.hitAction();
        this.hit = false;
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    hitAction: function () {
      this.solidity -= 10;
      //this.colorHSLA.a -= .1;
      this.colorHSLA = colorFunctions.randomHSLA(this.colorHSLA);

      this.updateColor();
      if (this.solidity <= 0) {
        const position = blocks.indexOf(this);
        blocks.splice(position, 1);
      }
    },
  };
  return block;
}


//ball to bounce around field 
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

    /* there must be a better way to sort the values,
    feel like I'm missing something obvious
    i suppose I could set as an objects,
    sort the values then return the obj key.
    like: {top:100, bottom:25, left:10, right: 30}...
    I don't know, not my favorite, I'll mull it over
    */

    // returns which side of the ball hit
    hitDirection: function (block) {
      const top = this.edge.top - block.edge.top;
      const bottom = block.edge.bottom - this.edge.bottom;
      const right = block.edge.right - this.edge.right;
      const left = this.edge.left - block.edge.left;
      const direction = [top,bottom,left,right];
      if (Math.max(top,bottom,right,left)===top) {
        return "top";
      } else if (Math.max(top,bottom,right,left)===bottom) {
        return "bottom";
      } else if (Math.max(top,bottom,right,left)===left) {
        return "left";
      } else if (Math.max(top,bottom,right,left)===right) {
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

const field = {
  draw: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, settings.field.width, settings.field.height);
  },
};

const colorFunctions = {
  /* makeHSLA takes a obj with properties obj.h, obj.s,
  obj.l, obj.a and makes a HSLA string that can be used 
  by canvas to render a color*/
  makeHSLA: function (hsla) {
    return `hsla(${hsla.h},${hsla.s}%,${hsla.l}%,${hsla.a})`;
  },

  randomHSLA: function (hsla) {
    hsla.h = Math.floor(360 * Math.random());
    return hsla;
  },
};

function render() {
  field.draw();
  balls.forEach((ball) => ball.draw());
  blocks.forEach((block) => block.draw());
  if (!paused) {
    raf = requestAnimationFrame(render);
  } else {
    cancelAnimationFrame(raf);
  }
}

function initialize() {
  setup();
  arrayOfBalls();
  arrayOfBlocks();

  balls.forEach((ball) => ball.updateColor());
  blocks.forEach((block) => block.updateColor());
}

canvas.addEventListener("click", function () {
  paused = !paused;
  render();
});

initialize();
raf = requestAnimationFrame(render);
