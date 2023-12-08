class Player {
  constructor(head, color='red') {
		this.playerBody = [head];
		this.playerLength = 1;
    this.isAlive = true;
    this.inGame = true;
    this.firebaseId = null;
    this.playerAge = 0;
    this.color = color;
    this.name = document.getElementById('username').value;
	}
  

	extractId(cellId) {
		// returns the x and y values of a cellId
		let ids = cellId.split('/').slice(1);
		let idx = ids[0];
		let idy = ids[1];
		return [idx, idy];
	}

	movePlayer(direction) {
    let ids = this.extractId(this.playerBody[0]);
    let idx = Number(ids[0]);
    let idy = Number(ids[1]);
    switch (direction) {
		case "w":
			idx -= 1;
			break;
		case "d":
			idy += 1;
			break;
		case "s":
			idx += 1;
			break;
		case "a":
			idy -= 1;
			break;
    }
    let playerMove = `cell/${idx}/${idy}`;
    if (this.playerBody.length >= this.playerLength) {
      this.playerBody.unshift(playerMove);
      this.playerBody.pop();
    } else {
      this.playerBody.unshift(playerMove);
    }
    this.playerAge++;
	}

  grow() {
    this.playerLength += 3;
  }


}

export { Player };
