  /* makeHSLA takes a obj with properties obj.h, obj.s,
  obj.l, obj.a and makes a HSLA string that can be used 
  by canvas to render a color*/

function makeHSLA (hsla) {
    return `hsla(${hsla.h},${hsla.s}%,${hsla.l}%,${hsla.a})`;
  }

function randomHSLA (hsla) {
    hsla.h = Math.floor(360 * Math.random());
    return hsla;
}
  
export { makeHSLA, randomHSLA}