import { createBoard, boardCenterId } from "./board.js";
import { gameLoop, multiplayerGameLoop } from "./game_logic.js";
import { getRootStyle } from "./util.js";

let HEIGHT = 21; // x or row
let WIDTH = 21;  // y or column
let TICKSPEED = 200;


function setBoardSize(event) {
  HEIGHT = Number(event.target.value);
  WIDTH = Number(event.target.value);
  createBoard(HEIGHT, WIDTH);
}

function setTickSpeed(event) {
  TICKSPEED = Number(event.target.value);
}

function colorButton(button, color) {
  button.style.backgroundColor = color;
}

// colors a group of buttons by class
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

function toggleOptionsMenu(event) {
  let menu = document.getElementsByClassName('settings-menu')[0];
  menu.classList.toggle("fade-hide");
}

// lock player out of buttons to prevent game interruption
// and start main game loop, also hides the GAME OVER text if a game over
// was triggered
function startGame(event) {
  let buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
  event.target.innerText = "Start Game";
  document.getElementById("game-over-text").classList.add('hidden');
  // gameLoop(TICKSPEED, HEIGHT, WIDTH, boardCenterId(HEIGHT, WIDTH));
  multiplayerGameLoop(TICKSPEED, HEIGHT, WIDTH, boardCenterId(HEIGHT, WIDTH));
}

// handles the click event when selecting an option
function handleOptions(event) {
  let parentClassList = Array.from(event.target.parentNode.classList);
  if (parentClassList.includes("size-buttons")) {
    handleSizeChange(event);
  } else if (parentClassList.includes("speed-buttons")) {
    handleTickSpeedChange(event);
  }
}

function main() {
  //  get buttons to change settings
let startButton = document.getElementById("start-button");
let settingsMenu = document.getElementById("settings-menu");
let optionsbtn = document.getElementById("options");

// add listeners, pulls values from buttons to change the size of
// the board and how fast the snake moves
optionsbtn.addEventListener("click", toggleOptionsMenu);
settingsMenu.addEventListener("click", handleOptions);
startButton.addEventListener("click", startGame);
// colors the buttons associated with the default values when the player
// first loads the page
createBoard(HEIGHT, WIDTH);
colorButton(document.getElementById('turtle'), getRootStyle("--button-highlight"));
colorButton(document.getElementById('medium'), getRootStyle("--button-highlight"));
}

main();
