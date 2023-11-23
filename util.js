function randNum(x) {
  // returns a number between 0 and x
  return Math.floor(Math.random() * x);
}

function getRootStyle(colorPropertyName) {
  const rootStyles = getComputedStyle(document.documentElement);
  const color = rootStyles.getPropertyValue(colorPropertyName);
  return color;
}

function draw(cellId, color) {
  // let cell = document.getElementById(cellId);
  // cell.style.backgroundColor = color;
  document.getElementById(cellId).style.backgroundColor = color;
}

export { randNum, draw, getRootStyle };

