import { Player } from "./player.js";
import { newApple } from "./board.js";
import { draw, getRootStyle } from "./util.js";

let DIRECTION = "w";

document.addEventListener("keydown", (event) => {
	if (['w', 'a', 's', 'd'].includes(event.key)) {
		let newDirection = event.key;
		let oppositeDirections = {
			"w": "s",
			"s": "w",
			"d": "a",
			"a": "d"
		};
		if (newDirection !== oppositeDirections[DIRECTION]) {
			DIRECTION = newDirection;
		}
	}
});

function drawPlayer(player) {
	redrawBoard();
	player.playerBody.forEach((x) => document.getElementById(x).style
                            .backgroundColor = getRootStyle("--snake-color"));
}

function redrawBoard() {
	let gameContainer = document.getElementById("game-container");
	let cellIds = Array.from(gameContainer.children).map((x) => x.id);
	cellIds.forEach((x) => document.getElementById(x).style
                  .backgroundColor = getRootStyle("--game-background-color"));
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function gameOver() {
  document.getElementById("game-over-text").classList.remove("hidden");
  let startButton = document.getElementById("start-button");
  let buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
  startButton.innerText = "Retry?";
}

async function gameLoop(tickSpeed, HEIGHT, WIDTH, boardCenter) {
	let playerLost = false;
	let player = new Player(boardCenter);
  let apple = newApple(player, HEIGHT, WIDTH);
	drawPlayer(player);
	while (true) {

    player.movePlayer(DIRECTION);

    if (isOutofBounds(HEIGHT, WIDTH, player)) {
			break;
		}

    if (player.playerBody[0] == apple) {
      player.grow();
      apple = newApple(player, HEIGHT, WIDTH);
      document.getElementById("score-counter").innerText = String(player.playerLength - 1);
    }
    
		drawPlayer(player);
    draw(apple, getRootStyle("--apple-color"));
		await sleep(tickSpeed);
	}
	gameOver();
}

export { drawPlayer, redrawBoard, gameLoop };
