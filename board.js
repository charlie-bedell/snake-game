import { randNum } from './util.js';

function createCell(id) {
	let cell = document.createElement("div");
	cell.className = "cell";
	cell.id = id;
	// cell.innerText = id;
	return cell;
}

function createBoard(x, y) {
	let boardSize = x * y;

	let gameContainer = document.getElementById("game-container");
	gameContainer.style.gridTemplateRows = "1fr ".repeat(x);
	gameContainer.style.gridTemplateColumns = "1fr ".repeat(y);

	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			gameContainer.appendChild(createCell(`cell/${i}/${j}`));
		}
	}
}

function getCell(id) {
	return document.querySelector(`#${id}`);
}

function boardCenterId(x, y) {
	let xmid = Math.floor(x / 2);
	let ymid = Math.floor(y / 2);
	return `cell/${xmid}/${ymid}`;
}

function isValidCell(id, x, y) {
	let idxy = id.split('/').slice(1);
	let xid = idxy[0];
	let yid = idxy[1];
	if ((xid < 0) ||
		(yid < 0) ||
		(xid > x - 1) ||
		(yid > y - 1)) {
		return false;
	} else {
		return true;
	}
}

function newApple(player,x,y) {
  let playerIds = player.playerBody;
  let appleId = `cell/${randNum(x)}/${randNum(y)}`;
  
  while (playerIds.includes(appleId)) {
    appleId = `cell/${randNum(x)}/${randNum(y)}`;
  }
  return appleId;
}

export { createBoard, getCell, boardCenterId, isValidCell, newApple };
