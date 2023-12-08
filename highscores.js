import {getScores, getTopNScores} from './my-firebase.js';

async function updateHighscores() {
  let topScores = await getTopNScores(5);
  let scoreList = document.getElementById('highscores-list');
  scoreList.innerHTML = '';
  topScores.forEach((x) => {
    let liEle = document.createElement('li');
    liEle.innerText = `${x[0]}: ${x[1]}`;
    scoreList.appendChild(liEle);
  });
}

export { updateHighscores }
