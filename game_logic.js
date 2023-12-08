import { Player } from "./player.js";
import { newFruit } from "./board.js";
import { draw, drawCellArray, getRootStyle, randomFruit, randColor } from "./util.js";
import { getAllSnakes, getSnake, updateSnake, getOtherSnakes, addSnake, removeSnake, updateScore } from './my-firebase.js';
import { updateHighscores } from './highscores.js';


// handles input and manages players direction
let DIRECTION_QUEUE = ['w'];
let LAST_DIRECTION = DIRECTION_QUEUE[0];

function manageControls(event) {
  let key = event.key;

  switch (key) {
  case "ArrowDown":
    key = "s";
    break;
  case "ArrowUp":
    key = 'w';
    break;
  case "ArrowRight":
    key = 'd';
    break;
  case "ArrowLeft":
    key = 'a';
    break;
  }
  
  if (['w', 'a', 's','d'].includes(key)) {
    let newDirection = key;
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
		                        .backgroundColor = player.color);
}

async function drawOtherPlayers(player, otherSnakes=null) {
  if (otherSnakes == null) {
    otherSnakes = await getOtherSnakes(player);
  }
  for (let i = 0; i < otherSnakes.length; i++) {
    let snake = otherSnakes[i];
    snake.playerBody.forEach((x) => document.getElementById(x).style
                             .backgroundColor = snake.color);
  };
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

function multiplayerCollision(player, otherPlayers) {
  // grace period of X ticks
  if (player.playerAge < 10) {
    return false;
  }
  let playerHead = player.playerBody[0];
  let otherPlayerBodies = otherPlayers.map((x) => x.playerBody).flat(Infinity);
  if (otherPlayerBodies.includes(playerHead)) {
    return true;
  } else {
    return false;
  }
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
	let buttons = document.getElementsByTagName("button");
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].disabled = false;
	}
}

async function multiplayerDrawPhase(player, otherSnakes, fruit, fruitEmoji) {
  updateSnake(player);
  redrawBoard();
  drawOtherPlayers(player, otherSnakes);
  drawPlayer(player);
  draw(fruit, fruitEmoji, true);
}

// handles the main game loop
// score, draw, apple
async function gameLoop(tickSpeed, HEIGHT, WIDTH, boardCenter) {
	let player = new Player(boardCenter, randColor());
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
  let player = new Player(boardCenter, randColor());
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
		if (isOutofBounds(HEIGHT, WIDTH, player, true)) {
			break;
		}

		if (player.playerBody[0] == fruit) {
			player.grow();
			fruit = newFruit(player, HEIGHT, WIDTH);
      fruitEmoji = randomFruit();
			document.getElementById("score-counter").innerText = String(player.playerLength - 1);
		}
    let otherPlayers = await getOtherSnakes(player);
    await multiplayerDrawPhase(player, otherPlayers, fruit, fruitEmoji);
    if (multiplayerCollision(player, otherPlayers)) {
      break;
    }
		await sleep(tickSpeed);
	}
  
  removeSnake(player.firebaseId);
	gameOver();
  console.log(player.name);
  console.log(player.playerLength);
  await updateScore(player.name, player.playerLength);
  await updateHighscores();
}



export { drawPlayer, redrawBoard, gameLoop, multiplayerGameLoop };
