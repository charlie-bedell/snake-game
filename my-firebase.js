import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { Player } from './player.js';


// CONFIG
const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID
};

// CONFIG

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const snakesRef = collection(db, 'snakes');


async function getAllSnakes() {
  let snakes = {};
  const querySnapshot = await getDocs(snakesRef);
  querySnapshot.forEach((doc) => {
    snakes[doc.id] = doc.data();
   });
  return snakes; 
}

async function getSnake(playerId) {
  let snake = await getDoc(doc(snakesRef, playerId));
  return snake.data();
}

async function updateSnake(player) {
  await setDoc(doc(snakesRef, player.firebaseId), {
    playerBody: player.playerBody,
    playerLength: player.playerLength,
    isAlive: player.isAlive,
    inGame: player.inGame,
    firebaseId: player.firebaseId
  });
}

async function getOtherSnakeLocs(player) {
  // gets the body of each alive snake in firestore
  let playerId = player.firebaseId;
  let snakes = await getAllSnakes();
  let locations = Object.values(snakes)
      .filter((x) => playerId !== x.firebaseId)
      .map((x) => x.playerBody);
  return locations;
}

async function addSnake(player) {
  // pass in the player object to add that player to the firebase "snakes"
  // collection
  let newSnake = doc(snakesRef);
  player.firebaseId = newSnake.id;
  await setDoc(newSnake, {
    playerBody: player.playerBody,
    playerLength: player.playerLength,
    isAlive: player.isAlive,
    inGame: player.inGame,
    firebaseId: player.firebaseId
  });
}

async function removeSnake(playerId) {
  await deleteDoc(doc(snakesRef, playerId)).then(() => {
    console.log('record deleted: ', playerId);
  }).catch((error) => {
    console.log('unable to delete ', playerId, ': ', error);
  });
}





export { getAllSnakes, getSnake, updateSnake, getOtherSnakeLocs, addSnake, removeSnake }
