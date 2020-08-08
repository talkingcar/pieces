import { makeHSLA } from "/modules/HSLAcolor.js";

const canvas = document.getElementById('toy');
const ctx = canvas.getContext('2d');

let raf;

const settings = {
  field: {
    width: window.innerWidth,
    height: window.innerHeight,
    color: 'grey',
    hsla: {
      h: 100,
      s: 100,
      l: 50,
      a: 1,
      
    }
  }
}

const jumpButton = document.getElementById('jump-button');

function degToRad(degrees) {
  return degrees * Math.PI / 180;
};

function makeShip() {
  const ship = {
    color: 'purple',
    size: 10,
    
    
    draw: function (x,y,length, color) {
      let offsetX = x - length / 2;
      let height = (length / 2) * Math.tan(degToRad(70));

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + length/2 , y-height/5)
      ctx.lineTo(offsetX + length, y);
      
      ctx.lineTo(offsetX + (length / 2), y - height);
      ctx.lineTo(offsetX, y);
      ctx.fill();
 
    }
  }
  return ship
}

//I KNOW THIS IS A HORRIBLE WAY TO DO THIS.
// EATING CHIPS AND DRINKING BEER WITH THE DOG,
// TRYING TO FIGURE SOMETHINGSOUT
function makeDustRow(width = 100, density = 25) {
  let rowOfDust = new Array(settings.field.width);
  rowOfDust.fill();
  const rowRow = rowOfDust.map(point => {
    const x = Math.random();
    if (x < density / 100) {
      point = 1;
    } else {
      point = 0;
    }

    console.log(point)
    return(point)
  })
  console.log(rowOfDust.length)
  return rowRow
}

function drawDust() {
  const rowToDraw = makeDustRow();
  console.log(rowToDraw)
  rowToDraw.forEach(x => {
    if (x != 0) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x.indexOf, 10, 10, 10)
      console.log('beep')
    }
  })
}


const shipOne = makeShip();




function setup() {
  ctx.canvas.width = settings.field.width;
  ctx.canvas.height = settings.field.height;
}

const field = {
  draw: function (
    width = settings.field.width,
    height = settings.field.height,
    color = makeHSLA(settings.field.hsla)
  ) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  },
};


function render() {

  field.draw();
  shipOne.draw(
    settings.field.width / 2,
    settings.field.height * .7 ,
    settings.field.height / 12,
    'white'
  )

raf = requestAnimationFrame(render)
}


setup();
raf = requestAnimationFrame(render)