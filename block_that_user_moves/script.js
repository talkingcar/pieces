const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let raf;

const settings = {
  field: {
    width: 500,
    height: 500,
    color: "grey"
  }
}

function makeBlock() {

}


const field = {
  draw: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = settings.field.color;
    ctx.fillRect(0, 0, settings.field.width, settings.field.height);
  },
};



function render() {
  field.draw()
  raf = requestAnimationFrame(render);
}


raf = requestAnimationFrame(render);