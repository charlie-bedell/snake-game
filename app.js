import { createBoard, boardCenterId } from "./board.js";
import { gameLoop } from "./game_logic.js";
import { getRootStyle } from "./util.js";

let HEIGHT = 21; // x or row
let WIDTH = 21;  // y or column
let TICKSPEED = 120;

function setBoardSize(event) {
  HEIGHT = Number(event.target.value);
  WIDTH = Number(event.target.value);
  createBoard(HEIGHT, WIDTH);
}

function setTickSpeed(event) {
  console.log(TICKSPEED);
  TICKSPEED = Number(event.target.value);
  console.log(TICKSPEED);
}

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
  colorButtonClass(event.target.className, getRootStyle("--button-color"));
  colorButton(event.target, getRootStyle("--button-highlight"));
  setBoardSize(event);
}

function handleTickSpeedChange(event) {
  colorButtonClass(event.target.className, getRootStyle("--button-color"));
  colorButton(event.target, getRootStyle("--button-highlight"));
  setTickSpeed(event);
}

function startGame(event) {
  gameLoop(TICKSPEED, HEIGHT, WIDTH, boardCenterId(HEIGHT, WIDTH));
}

createBoard(HEIGHT, WIDTH);
let startButton = document.getElementById("start-button");
let smallbtn = document.getElementById("small");
let medbtn = document.getElementById("medium");
let largebtn = document.getElementById("large");

let slowbtn = document.getElementById("slow");
let fastbtn = document.getElementById("fast");
let fasterbtn = document.getElementById("faster");

smallbtn.addEventListener("click", handleSizeChange);
medbtn.addEventListener("click", handleSizeChange);
largebtn.addEventListener("click", handleSizeChange);

slowbtn.addEventListener("click", handleTickSpeedChange);
fastbtn.addEventListener("click", handleTickSpeedChange);
fasterbtn.addEventListener("click", handleTickSpeedChange);

startButton.addEventListener("click", startGame);

