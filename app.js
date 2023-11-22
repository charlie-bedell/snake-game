import { createBoard, boardCenterId } from "./board.js";
import { gameLoop } from "./game_logic.js";


let HEIGHT = 20; // x or row
let WIDTH = 20;  // y or column
let TICKSPEED = 120;


function colorButton(button, color) {
  button.style.backgroundColor = color;
}

function colorButtonClass(classString, color) {
  let buttons = document.getElementsByClassName(classString);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.backgroundColor = color;
  }
}

function handleSizeChange(event) {
  console.log(event.target.className);
  colorButtonClass(event.target.className, "");
  colorButton(event.target, "#47aa46");
  setBoardSize(event);
}

function setBoardSize(event) {
  HEIGHT = Number(event.target.value);
  WIDTH = Number(event.target.value);
  createBoard(HEIGHT, WIDTH);
}

function startGame(event) {
  gameLoop(TICKSPEED, HEIGHT, WIDTH, boardCenterId(HEIGHT, WIDTH));
}

createBoard(HEIGHT, WIDTH);

let startButton = document.getElementById("start-button");
let smallbtn = document.getElementById("small");
let medbtn = document.getElementById("medium");
let largebtn = document.getElementById("large");


smallbtn.addEventListener("click", handleSizeChange);
medbtn.addEventListener("click", handleSizeChange);
largebtn.addEventListener("click", handleSizeChange);

startButton.addEventListener("click", startGame);

