import { createBoard, boardCenterId } from "./board.js";
import { Player } from "./player.js";
import { drawPlayer, redrawBoard, gameLoop } from "./game_logic.js";


const HEIGHT = 15; // x or row
const WIDTH = 15;  // y or column
const TICKSPEED = 100;



createBoard(HEIGHT, WIDTH);

gameLoop(TICKSPEED, HEIGHT, WIDTH, boardCenterId(HEIGHT, WIDTH));
