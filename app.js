import { createBoard, boardCenterId } from "./board.js";
import { gameLoop } from "./game_logic.js";


const HEIGHT = 20; // x or row
const WIDTH = 20;  // y or column
const TICKSPEED = 120;



createBoard(HEIGHT, WIDTH);
gameLoop(TICKSPEED, HEIGHT, WIDTH, boardCenterId(HEIGHT, WIDTH));
