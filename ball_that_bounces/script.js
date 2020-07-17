const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');

const settings = {
    quantityOfBalls: 100
}

let raf;

function imperfection() {
    return Math.random() * .1;
    
}

function setup() {
    ctx.canvas.width = 400;
    ctx.canvas.height = 400;
}

let balls = [];

function arrayOfBalls() {
    while (settings.quantityOfBalls > 0) {
        balls.push(makeBall());
        settings.quantityOfBalls -= 1;
    }
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
        color: 'red',
        velocity: {
            x:1,
            y:1,
        },
        imperfectBounce: false,

        calculateEdges: function() {
            this.edges.top = this.y;
            this.edges.bottom = this.y + this.size;
            this.edges.left = this.x;
            this.edges.right = this.x + this.size;
        },

        move: function() {
          this.x += this.velocity.x;
          this.y += this.velocity.y;
          this.calculateEdges();
        if (this.imperfectBounce) {
            this.velocity.x += imperfection();
            this.velocity.y += imperfection();
            this.imperfectBounce = false;
        }
          if (this.collideVertical()) {
              this.bounceVertical();
          } 
        
          if 
              (this.collideHorizontal()){
              this.bounceHorizontal()
          }
        },

        collideVertical: function() {
            if (ball.edges.left <= 0 ||
                ball.edges.right >= 400 ) {
                    return true
                } else {
                    return false
                }
        },


        collideHorizontal: function() {
            if (ball.edges.top <= 0 ||
                ball.edges.bottom >= 400 ) {
                    return true
                } else {
                    return false
                }
        },

        bounceVertical: function() {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = this.velocity.y;
            this.imperfectBounce = true;
            console.log('v ' + this.velocity.x + this.velocity.y)
        },


        bounceHorizontal: function() {
            this.velocity.x = this.velocity.x;
            this.velocity.y = -this.velocity.y;
            this.imperfectBounce = true;
            console.log('h ' + this.velocity.x + this.velocity.y )
        },

        draw: function() {
            this.move();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    return ball;
}

const field = {
    draw: function() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0,0,400,400);
    }
}

function render() {
    field.draw();
    balls.forEach(ball => {
        ball.draw();
    })
    

    raf = requestAnimationFrame(render);
}

arrayOfBalls();

setup();

render();