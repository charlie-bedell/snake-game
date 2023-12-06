function randNum(x) {
  // returns a number between 0 and x
  return Math.floor(Math.random() * x);
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

export { randNum, draw, getRootStyle, randomFruit };

