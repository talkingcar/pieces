import { makeHSLA } from "/modules/HSLAcolor.js";
import { randomHSLA } from "../modules/HSLAcolor.js";

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


function makeStripes(quantity) {
  let stripes = [];
  const lengthToDivide = settings.field.width;
  const evenDivision = lengthToDivide / quantity;
  
  let currentLength = lengthToDivide;

  while (quantity > 0) {
    const stripe = {
      width: evenDivision,
      height: settings.field.height,
      x: currentLength,
      y: 0,
      color: makeHSLA(randomHSLA(settings.field.hsla)),
    }
    stripes.push(stripe)
    currentLength -= stripe.width;
    quantity -= 1;
    console.log(stripe)
  }
  return stripes;
}


function drawStripes(stripes) {
  stripes.forEach(stripe =>
  {
    ctx.fillStyle = stripe.color;
    ctx.fillRect(
      stripe.x,
      stripe.y,
      stripe.width,
      stripe.height
    )
    })

}



const newStripes = makeStripes(10);
const shipOne = makeShip();
console.log(newStripes)


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
  drawStripes(newStripes);
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