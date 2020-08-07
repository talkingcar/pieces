const canvas = document.getElementById('toy');
const ctx = canvas.getContext('2d');

let raf;

const settings = {
  field: {
    width: window.innerWidth,
    height: window.innerHeight,
    color: 'grey',
    hsla: {
      h: 250,
      s: 100,
      l: 50,
      a: 1,
      
    }
  }
}

function setup() {
  ctx.canvas.width = settings.field.width;
  ctx.canvas.height = settings.field.height;
}

const field = {
  draw: function (
    width = settings.field.width,
    height = settings.field.height,
    color = settings.field.color
  ) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  },
};


function render() {
  field.draw();
  raf = requestAnimationFrame(render)
}

setup();
raf = requestAnimationFrame(render)