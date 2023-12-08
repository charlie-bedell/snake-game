function randNum(x) {
  // returns a number between 0 and x
  return Math.floor(Math.random() * x);
}

function randColor() {
  // use only with css styling the multiplayer snakes
  let colors = ['Aqua', 'Aquamarine', 'AliceBlue', 'BlueViolet', 'Coral', 'Chocolate', 'chartreuse', 'deeppink', 'maroon', 'red', 'black', 'Gold'];
  return colors[randNum(colors.length-1)];
}

function getRootStyle(colorPropertyName) {
  const rootStyles = getComputedStyle(document.documentElement);
  const color = rootStyles.getPropertyValue(colorPropertyName);
  return color;
}

function randomFruit() {
  let fruits = ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🫐','🥝','🍅','🫒','🥥'];
  return fruits[randNum(fruits.length)];
}

function getFruit(n) {
  let fruits = ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🫐','🥝','🍅','🫒','🥥'];
  return fruits[n];
}

function draw(cellId, color, isFruit=false) {
  // let cell = document.getElementById(cellId);
  // cell.style.backgroundColor = color;
  let cell = document.getElementById(cellId);
  if (isFruit) {
    cell.textContent = color;
    cell.style.zIndex = 9999;
    
  } else {
    cell.style.backgroundColor = color;
  }
}

function drawCellArray(cellArray, color) {
  cellArray.forEach((cell) => draw(cell, color));
}

export { randNum, draw, drawCellArray, getRootStyle, randomFruit, randColor, getFruit };

