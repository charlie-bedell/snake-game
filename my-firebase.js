import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { randNum } from './util.js';
import { Player } from './player.js';

// CONFIG
const firebaseConfig = {
	apiKey: API_KEY,
	authDomain: AUTH_DOMAIN,
	projectId: PROJECT_ID,
	storageBucket: STORAGE_BUCKET,
	messagingSenderId: MESSAGING_SENDER_ID,
	appId: APP_ID
};

// CONFIG



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const snakesRef = collection(db, 'snakes');
const highscoresRef = collection(db, 'highscores');
const fruitsRef = collection(db, 'fruits');


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
    firebaseId: player.firebaseId,
    color: player.color,
    name: player.name
  });
}

async function getOtherSnakes(player) {
  // gets the body of each alive snake in firestore
  let playerId = player.firebaseId;
  let snakes = await getAllSnakes();
  snakes = Object.values(snakes).filter((x) => playerId !== x.firebaseId);
  return snakes;
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
    firebaseId: player.firebaseId,
    color: player.color,
    name: player.name
  });
}

async function removeSnake(playerId) {
  await deleteDoc(doc(snakesRef, playerId)).then(() => {
    console.log('record deleted: ', playerId);
  }).catch((error) => {
    console.log('unable to delete ', playerId, ': ', error);
  });
}

async function getScores() {
  let querySnapshot  = await getDocs(highscoresRef);
  let scores = {};
  querySnapshot.forEach((x) => scores[x.id] = x.data()['score']);
  return scores;
}

async function getScore(name) {
  let score = await getDoc(doc(highscoresRef, name));
  score = score.data()['score'];
  return score;
}

async function removeScore(name) {
  await deleteDoc(doc(highscoresRef, name));
}

async function addScore(name, score) {
  await setDoc(doc(highscoresRef, name), {score: score});
}

async function onlyKeepScoreTop(n) {
  let scores = await getScores();
  scores = Object.entries(scores);
  scores.sort((a,b) => b[1] - a[1]);
  let restScores = scores.slice(n);
  restScores.forEach((x) => removeScore(x[0]));
}

async function updateScore(name, score) { 
  let scores = getScores();
  if (!Object.keys(scores).includes(name)) {
    addScore(name,score);
  } else {
    let maxScore = Math.max(scores[name][score], score);
    await setDoc(doc(highscoresRef, name), {score: maxScore});
  }
}

async function getTopNScores(n) {
  let scores = await getScores();
  scores = Object.entries(scores);
  scores.sort((a,b) => b[1] - a[1]);
  return scores.slice(0,n);
}

async function getFruits() {
  let fbFruits = await getDoc(doc(fruitsRef, 'fruitDoc'));
  fbFruits = fbFruits.data();
  let fruitsArray = Object.keys(fbFruits).map((x) => fbFruits[x]);
  return fruitsArray;
}

async function replaceFruit(oldFruit, newFruit) {
  let fruits = await getFruits();
  fruits = fruits.filter((x) => x[1] !== oldFruit);
  fruits.push([randNum(19), newFruit]);
  await setDoc(doc(fruitsRef, 'fruitDoc'), {
    fruit1: fruits[0],
    fruit2: fruits[1]
  });
}

export { getAllSnakes, getSnake, updateSnake, getOtherSnakes, addSnake, removeSnake, getScores, getScore, removeScore, addScore, updateScore, onlyKeepScoreTop, getTopNScores, getFruits, replaceFruit }

