// simulation board for alorithm testing and development
const sim = [
	[ 2, 0, 0, 0, 0, 0, 0 ],
	[ 2, 0, 0, 0, 0, 0, 0 ],
	[ 1, 0, 0, 0, 0, 0, 0 ],
	[ 1, 0, 1, 1, 1, 0, 0 ],
	[ 1, 0, 2, 2, 1, 2, 2 ],
	[ 1, 2, 2, 1, 2, 2, 2 ]
];
// define playing board to board from script.js
// const dummyBoard = game.board;
const bot = 2;
const human = 1;
let count = 0;

//This function is called when it's bot's turn to play
function aiTurn(dummyBoard) {
	// console.log(dummyBoard);
	//firstit checks for any immediate winning spots for bot or human
	const winningSpot = checkWin(bot, dummyBoard);
	const losingSpot = checkWin(human, dummyBoard);
	//second it checks for any moves that can give human a win in human's next turn. And removes those moves from possibilities
	const firstMoves = makeBoards(bot, dummyBoard); //bot
	removeFlaggedSpotsFromFirstMoves(firstMoves);

	//if theres a winning spot, move there
	if (winningSpot.length > 0) {
		count++;
		console.log('winning Spot');
		return moveHere(winningSpot[0]);
	} else if (losingSpot.length > 0) {
		//if there;s a losing spot, move there
		count++;
		console.log('losing Spot');
		return moveHere(losingSpot[0]);
	} else if (count < 1) {
		// on the first turn place next to human's piece (this strategy is to avoid human gaininng leverage in the first horizontal moves)
		count++;
		let possibleMoves = checkPosMoves(dummyBoard);
		for (let thisMove of possibleMoves) {
			let y = thisMove[0];
			let x = thisMove[1];
			if (dummyBoard[y][x + 1] === human) {
				console.log('first Spot');

				return moveHere([ y, x ]);
			}
		}
	} else {
		//bot will now calculate up to 3 moves ahead and decide to move based on which immidiate position offers least amount of losing possibilities or more winning possibilites wihtin the next 3 moves.
		const secondMoves = makeBoardsForFirstMoves(firstMoves); //human
		const thirdMoves = makeBoardsForSecondMoves(secondMoves); //bot
		const fourthMoves = makeBoardsForThirdMoves(thirdMoves); //human
		const possibleWins2 = findPotentialWinningSpots2(fourthMoves, firstMoves, dummyBoard);
		if (possibleWins2.length > 0) {
			console.log('possiblewins2 Spot');
			return moveHere(possibleWins2);
		}
		let possibleMoves = checkPosMoves(dummyBoard);
		for (let thisMove of possibleMoves) {
			let y = thisMove[0];
			let x = thisMove[1];
			if (dummyBoard[y][x + 1] === human) {
				console.log('possiblewins Spot');
				return moveHere([ y, x ]);
			}
		}
		//	 possibleMoves=checkPosMoves(dummyBoard);
		let rand = Math.floor(Math.random() * possibleMoves.length);
		return moveHere(possibleMoves[rand]);
		// }
	}
}

function findMoveFromBoard(board, currBoard) {
	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board[0].length; x++) {
			if (board[y][x] !== currBoard[y][x]) {
				return [ y, x ];
			}
		}
	}
}

function removeFlaggedSpotsFromFirstMoves(firstMoves) {
	// const flaggedSpots=[];
	firstMoves.forEach((board, i) => {
		if (checkWin(human, board).length > 0) {
			//    flaggedSpots.push(flaggedSpot[0])
			firstMoves.splice(i, 1);
		}
	});
}

function findPotentialWinningSpots2(fourthMove, firstMoves, dummyBoard) {
	const thisArr2 = [];
	let c2 = 0;
	for (let thirdMove of fourthMove) {
		for (let secondMove of thirdMove) {
			for (let firstMove of secondMove) {
				for (let board of firstMove) {
					const winningSpot = checkWin(bot, board);
					if (winningSpot.length > 0) {
						c2++;
						break;
					}
				}
			}
		}
		thisArr2.push(c2);
		c2 = 0;
	}
	if (thisArr2.length < 1) {
		return [];
	}
	const max = Math.max(...thisArr2);
	// console.log(thisArr2,"<--thisArr, min-->",max);
	// console.log(thisArr2.indexOf(max),"<--index. move--> ",findMoveFromBoard(firstMoves[thisArr2.indexOf(max)],dummyBoard));
	return findMoveFromBoard(firstMoves[thisArr2.indexOf(max)], dummyBoard);
}

function makeBoards(currPlayer, board) {
	const possibleMoves = checkPosMoves(board);
	const boards = [];
	for (let thisMove of possibleMoves) {
		const newBoard = JSON.parse(JSON.stringify(board));
		newBoard[thisMove[0]][thisMove[1]] = currPlayer;
		boards.push(newBoard);
	}
	return boards;
}

function makeBoardsForFirstMoves(firstMoves) {
	const secondMoves = [];
	for (let board of firstMoves) {
		secondMoves.push(makeBoards(human, board));
	}
	return secondMoves;
}

function makeBoardsForSecondMoves(secondMoves) {
	const thirdMoves = [];
	for (let firstMoves of secondMoves) {
		const thirdMove = [];
		for (let board of firstMoves) {
			thirdMove.push(makeBoards(bot, board));
		}
		thirdMoves.push(thirdMove);
	}
	return thirdMoves;
}

function makeBoardsForThirdMoves(thirdMoves) {
	const fourthMoves = [];
	for (let secondMoves of thirdMoves) {
		const third3Moves = [];
		for (let firstMoves of secondMoves) {
			const thirdMove = [];
			for (let board of firstMoves) {
				thirdMove.push(makeBoards(human, board));
			}
			third3Moves.push(thirdMove);
		}
		fourthMoves.push(third3Moves);
	}
	return fourthMoves;
}

function checkWin(currPlayer, board) {
	const possibleMoves = checkPosMoves(board);
	const wins = [];
	//console.log(possibleMoves,currPlayer);

	for (let thisMove of possibleMoves) {
		const predBoard = JSON.parse(JSON.stringify(board));
		let yMove = thisMove[0];
		let xMove = thisMove[1];
		predBoard[yMove][xMove] = currPlayer;
		if (game.checkForWin(currPlayer, predBoard) === true) {
			wins.push([ yMove, xMove ]);
		}
	}
	return wins;
}

function checkPosMoves(board) {
	const possibleMoves = [];
	for (let x = 0; x < board[0].length; x++) {
		y = game.findSpotForCol(x, board);
		if (y != null) possibleMoves.push([ y, x ]);
	}
	return possibleMoves;
}

function moveHere(pos) {
	console.log('bot move here', pos);
	return pos;
}
// aiTurn(sim);
