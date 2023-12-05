import { Player } from "./player.js";
import { newFruit } from "./board.js";
import { draw, getRootStyle, randomFruit } from "./util.js";
import { getAllSnakes, getSnake, updateSnake, getOtherSnakeLocs, addSnake, removeSnake } from './my-firebase.js';

// handles input and manages players direction
let DIRECTION_QUEUE = ['w'];
let LAST_DIRECTION = DIRECTION_QUEUE[0];

function manageControls(event) {
  if (['w', 'a', 's','d'].includes(event.key)) {
    let newDirection = event.key;
    let oppositeDirections = {
			"w": "s",
			"s": "w",
			"d": "a",
			"a": "d"
    };
    if ((((DIRECTION_QUEUE.length == 0) &&
          (oppositeDirections[LAST_DIRECTION] !== newDirection))) ||
        // ----------------------------OR----------------------------
        ((DIRECTION_QUEUE.length > 0) &&
         (oppositeDirections[DIRECTION_QUEUE[DIRECTION_QUEUE.length-1]] !== newDirection))) {
      DIRECTION_QUEUE.push(newDirection);
    }
  }
}

document.addEventListener("keydown", manageControls);

function drawPlayer(player) {
	player.playerBody.forEach((x) => document.getElementById(x).style
		                        .backgroundColor = getRootStyle("--snake-color"));
}

async function drawOtherPlayers(player) {
  let snakeLocs = await getOtherSnakeLocs(player);
  let allSnakeLocs = snakeLocs.flat(Infinity);
  allSnakeLocs.forEach((x) => document.getElementById(x).style
                       .backgroundColor = getRootStyle("--other-snake-color"));
}

function redrawBoard() {
	let gameContainer = document.getElementById("game-container");
	let cellIds = Array.from(gameContainer.children).map((x) => x.id);
	cellIds.forEach((x) => {
    let cell = document.getElementById(x);
    cell.style.backgroundColor = getRootStyle("--game-background-color");
    cell.style.zIndex = 0;
    cell.textContent = "";
  });
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// checks if the player hits a side or itself
function isOutofBounds(HEIGHT, WIDTH, player) {
	let playerHead = player.playerBody[0];
	let ids = playerHead.split("/").slice(1);
	if ((ids[0] >= HEIGHT) ||
		(ids[1] >= WIDTH) ||
		(ids[0] < 0) ||
		(ids[1] < 0) ||
		(player.playerBody.slice(1).includes(playerHead))) {
		return true;
	} else {
		return false;
	}
}

// renables buttons, sets player direction to north
function gameOver() {
	document.getElementById("game-over-text").classList.remove("hidden");
	let startButton = document.getElementById("start-button");
	let buttons = document.getElementsByTagName("button");
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].disabled = false;
	}
	startButton.innerText = "Retry?";
}

// handles the main game loop
// score, draw, apple
async function gameLoop(tickSpeed, HEIGHT, WIDTH, boardCenter) {
	let player = new Player(boardCenter);
	let fruit = newFruit(player, HEIGHT, WIDTH);
  let fruitEmoji = randomFruit();
	DIRECTION_QUEUE = ['w'];
  LAST_DIRECTION = DIRECTION_QUEUE[0];
  redrawBoard();
	drawPlayer(player);
	while (true) {
		if (DIRECTION_QUEUE.length > 0) {
			LAST_DIRECTION = DIRECTION_QUEUE[0];
			player.movePlayer(DIRECTION_QUEUE.shift());
		} else {
			player.movePlayer(LAST_DIRECTION);
		}
		if (isOutofBounds(HEIGHT, WIDTH, player)) {
			break;
		}

		if (player.playerBody[0] == fruit) {
			player.grow();
			fruit = newFruit(player, HEIGHT, WIDTH);
      fruitEmoji = randomFruit();
			document.getElementById("score-counter").innerText = String(player.playerLength - 1);
		}
    redrawBoard();
		drawPlayer(player);
		draw(fruit, fruitEmoji, true);
		await sleep(tickSpeed);
	}
	gameOver();
}

async function multiplayerGameLoop(tickSpeed, HEIGHT, WIDTH, boardCenter) {
  let player = new Player(boardCenter);
  await addSnake(player);
	let fruit = newFruit(player, HEIGHT, WIDTH);
  let fruitEmoji = randomFruit();
	DIRECTION_QUEUE = ['w'];
  LAST_DIRECTION = DIRECTION_QUEUE[0];
  redrawBoard();
	drawPlayer(player);
  drawOtherPlayers(player);
	while (true) {
		if (DIRECTION_QUEUE.length > 0) {
			LAST_DIRECTION = DIRECTION_QUEUE[0];
			player.movePlayer(DIRECTION_QUEUE.shift());
		} else {
			player.movePlayer(LAST_DIRECTION);
		}
		if (isOutofBounds(HEIGHT, WIDTH, player)) {
			break;
		}

		if (player.playerBody[0] == fruit) {
			player.grow();
			fruit = newFruit(player, HEIGHT, WIDTH);
      fruitEmoji = randomFruit();
			document.getElementById("score-counter").innerText = String(player.playerLength - 1);
		}
    redrawBoard();
		drawPlayer(player);
    drawOtherPlayers(player);
    draw(fruit, fruitEmoji, true);
    updateSnake(player);
		await sleep(tickSpeed);
	}
  removeSnake(player.firebaseId);
	gameOver();
}

export { drawPlayer, redrawBoard, gameLoop, multiplayerGameLoop };
