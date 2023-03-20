/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// const WIDTH = 7;
// const HEIGHT = 6;
// let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])

class Game {
	constructor(height = 6, width = 7, p1 = 1, p2 = 2) {
		this.height = height;
		this.width = width;
		this.currPlayer = p1;
		this.players = [ p1, p2 ];
    // this.handleClickStart();
	}

	handleClickStart(player) {
		this.player = player;
		const start = document.getElementById('flex-box');
		let leiahThinking = document.getElementById("really") ;
		start.setAttribute('class', 'hidden');
		leiahThinking.style.visibility = "visible" ;
		this.makeBoard();
		this.makeHtmlBoard();
	}
	makeBoard() {
		this.board = [];
		for (let i = 0; i < this.height; i++) {
			let arr = [];
			for (let j = 0; j < this.width; j++) {
				arr.push(0);
			}
			this.board.push(arr);
		}
	}
	makeHtmlBoard() {
		const board1 = document.getElementById('board');
		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');
		this.moveHuman = this.moveHuman.bind(this); /////?????
		top.addEventListener('click', this.moveHuman);

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}
		board1.append(top);
		// make main part of board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}
			board1.append(row);
		}
	}

	findSpotForCol(x,board) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!board[y][x]) {
				return y;
			}
		}
		return null;
	}
	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.classList.add(`p${this.currPlayer}`);
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}
	endGame(msg) {
		setTimeout(()=>{if(confirm(msg)) {
			location.reload();
		  }},300)
		

	}

	moveHuman(evt) {
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x,this.board);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);
		this.evaluateMove();
	}

	evaluateMove() {
		// check for win
		if (this.checkForWin(this.currPlayer, this.board)) {
			this.gameOver = true;
			if(this.currPlayer===2){
				return this.endGame(`Leiah won!`);
			}
			return this.endGame(`Leiah let you win!`);
		}
		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame('Tie!');
			
		}
		// switch players
		if (this.currPlayer === this.players[0]) {
			this.currPlayer = this.players[1];
			if (this.player) this.moveAI();
		} else {
			this.currPlayer = this.players[0];
		}
	}
	moveAI() {
		let leiahMoving = document.getElementById("whatThe") ;
		let leiahThinking = document.getElementById("really") ;
		let move = aiTurn(this.board);
		let y = move[0];
		let x = move[1];
		leiahMoving.style.visibility = "visible" ;
		leiahThinking.style.visibility = "hidden" ;
		this.board[y][x] = this.currPlayer;
    setTimeout(()=>{
      this.placeInTable(y, x);
      this.evaluateMove();
	  leiahMoving.style.visibility = "hidden" ;
	  leiahThinking.style.visibility = "visible" ;
	}
    ,700)
		
	}

	checkForWin(player, board) {
		const _win = (cells) =>
			cells.every(([ y, x ]) => y >= 0 && y < this.height && x >= 0 && x < this.width && board[y][x] === player);

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];
				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}
}

let game = new Game();
