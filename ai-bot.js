const sim = [
	[ 1, 1, 0, 1, 1, 1, 2 ],
	[ 1, 1, 0, 2, 2, 2, 1 ],
	[ 2, 1, 0, 1, 1, 1, 2 ],
	[ 1, 2, 0, 2, 2, 2, 1 ],
	[ 1, 2, 0, 2, 1, 2, 2 ],
	[ 1, 2, 2, 1, 2, 2, 2 ]
];

const dummyBoard = board;

const bot = 1;
const human = 2;
let count = 0;

function aiTurn() {
	const winningSpot = checkWin(bot, dummyBoard);
	const losingSpot = checkWin(human, dummyBoard);
	const firstMoves = makeBoards(bot, dummyBoard); //bot
	removeFlaggedSpotsFromFM(firstMoves);

	const secondMoves = makeBoardsForFM(firstMoves); //human
	const possibleWins = findPotentialWinningSpots(secondMoves, firstMoves);

	const thirdMoves = makeBoardsForSM(secondMoves); //bot
	const leastLoses = findLeastLosingSpot(thirdMoves, firstMoves);

	const fourthMoves = makeBoardsForTM(thirdMoves); //human
	const possibleWins2 = findPotentialWinningSpots2(fourthMoves, firstMoves);

	if (winningSpot.length > 0) {
		count++;
		return moveHere(winningSpot[0]);
	} else if (losingSpot.length > 0) {
		count++;
		return moveHere(losingSpot[0]);
	} else if (count < 1) {
		count++;
		let possibleMoves = checkPosMoves(dummyBoard);
		for (let thisMove of possibleMoves) {
			let y = thisMove[0];
			let x = thisMove[1];
			if (dummyBoard[y][x + 1] === human) {
				return moveHere([ y, x ]);
			}
		}
		//	 possibleMoves=checkPosMoves(dummyBoard);
		let rand = Math.floor(Math.random() * possibleMoves.length);

		return moveHere(possibleMoves[rand]);
	} else {
		if (leastLoses.length > 0) {
			return moveHere(leastLoses);
		} else if (possibleWins.length > 0) {
			return moveHere(possibleWins[0]);
		} else if (possibleWins.length > 0) {
			return moveHere(possibleWins2);
		} else {
			let possibleMoves = checkPosMoves(dummyBoard);
			for (let thisMove of possibleMoves) {
				let y = thisMove[0];
				let x = thisMove[1];
				if (dummyBoard[y][x + 1] === human) {
					return moveHere([ y, x ]);
				}
			}
			//	 possibleMoves=checkPosMoves(dummyBoard);
			let rand = Math.floor(Math.random() * possibleMoves.length);

			return moveHere(possibleMoves[rand]);
		}
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

function removeFlaggedSpotsFromFM(firstMoves) {
	// const flaggedSpots=[];
	firstMoves.forEach((board, i) => {
		if (checkWin(human, board).length > 0) {
			//    flaggedSpots.push(flaggedSpot[0])
			firstMoves.splice(i, 1);
		}
	});
}

function findPotentialWinningSpots2(fourthMove, firstMoves) {
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

function findPotentialWinningSpots(secondMove, firstMoves) {
	const potentialWinningBoards = [];
	for (let firstMove of secondMove) {
		for (let board of firstMove) {
			const winningSpot = checkWin(bot, board);
			if (winningSpot.length > 0) {
				potentialWinningBoards.push(findMoveFromBoard(firstMoves[secondMove.indexOf(firstMove)], dummyBoard));
				break;
			}
		}
	}
	return potentialWinningBoards;
}

function findLeastLosingSpot(thirdMove, firstMoves) {
	let c = 0;
	let thisArr = [];
	for (let first of thirdMove) {
		for (let second of first) {
			for (let board of second) {
				const winningSpot = checkWin(human, board);
				if (winningSpot.length > 0) {
					c++;
				}
			}
		}
		thisArr.push(c);
		c = 0;
	}
	if (thisArr.length < 1) {
		return [];
	}
	const min = Math.min(...thisArr);
	console.log(thisArr, '<--thisArr, min-->', min);
	// console.log(thisArr.indexOf(min),"<--index. move--> ",findMoveFromBoard(firstMoves[thisArr.indexOf(min)],dummyBoard));
	return findMoveFromBoard(firstMoves[thisArr.indexOf(min)], dummyBoard);
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

function makeBoardsForFM(firstMoves) {
	const secondMoves = [];
	for (let board of firstMoves) {
		secondMoves.push(makeBoards(human, board));
	}
	return secondMoves;
}

function makeBoardsForSM(secondMoves) {
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

function makeBoardsForTM(thirdMoves) {
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

function moveHere(pos) {
	console.log('bot move here', pos);
	return pos;
}

function checkWin(currPlayer, board) {
	const possibleMoves = checkPosMoves(board);
	const wins = [];
	for (let thisMove of possibleMoves) {
		const predBoard = JSON.parse(JSON.stringify(board));
		let yMove = thisMove[0];
		let xMove = thisMove[1];
		predBoard[yMove][xMove] = currPlayer;

		function _win(cells) {
			return cells.every(
				([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && predBoard[y][x] === currPlayer
			);
		}
		for (let y = 0; y < HEIGHT; y++) {
			for (let x = 0; x < WIDTH; x++) {
				var horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				var vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				var diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				var diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					wins.push([ yMove, xMove ]);
				}
			}
		}
	}
	return wins;
}

function checkPosMoves(board) {
	const possibleMoves = [];
	for (let x = 0; x < board[0].length; x++) {
		for (let y = board.length - 1; y >= 0; y--) {
			if (board[y][x] === 0) {
				possibleMoves.push([ y, x ]);
				break;
			}
		}
	}
	return possibleMoves;
}
