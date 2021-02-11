const dummyBoard = board;
const sim = [
	[ 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 1, 1, 0, 0, 0 ],
	[ 0, 0, 2, 2, 0, 0, 0 ],
	[ 0, 1, 2, 1, 2, 1, 2 ],
	[ 1, 2, 1, 2, 1, 1, 1 ]
];
const player1=1;
const player2=2;





function simulateThirdMoves(secondMove,thirdMove){
    for(let arrBoard of secondMove){
        const thirdMoves=[];
        for(let board of arrBoard){
            thirdMoves.push(simulateMoves(player1,board));
             
        }
        thirdMove.push(thirdMoves);
    }
}

function simulateSecondMoves(firstMove,secondMove){
    for(let board of firstMove){
        secondMove.push(simulateMoves(player2,board));        
    }
}


function findMoveFromBoard(board,currBoard){
    for(let y=0;y<board.length;y++){
        for(let x=0;x<board[0].length;x++){
            if(board[y][x]!==currBoard[y][x]){
                return [y,x];
            }
        }
    }


}



function simulateMoves(currPlayer,board){
    const possibleMoves= checkPosMoves(board);
    const p1Moves=[];

    for(let thisMove of possibleMoves){
      
       const newBoard= JSON.parse(JSON.stringify(board));
       newBoard[thisMove[0]][thisMove[1]]=currPlayer;
       p1Moves.push(newBoard);

}

return p1Moves;
}

function moveHere(pos){
    console.log("move here",pos);
    return pos;
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

function checkWin(currPlayer,board) { 
    const possibleMoves= checkPosMoves(board);
    const wins=[];
	for (let thisMove of possibleMoves) {  
        const predBoard=JSON.parse(JSON.stringify(board));    
        let yMove=thisMove[0];
        let xMove=thisMove[1];
        predBoard[yMove][xMove]=currPlayer;
        
       //console.log(predBoard);
		function _win(cells) {
			return cells.every(([ y, x ]) => 
            y >= 0 
            && y < HEIGHT 
            && x >= 0 
            && x < WIDTH 
            && predBoard[y][x] === currPlayer);
		}
        

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
              var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
              var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
              var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
              var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
        
              if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                wins.push([yMove,xMove]);
              }
            }
          }

	}  
    return wins;

}
let count=0;
function aiTurn(){
    const winningSpot=checkWin(player1,dummyBoard);
    const losingSpot=checkWin(player2,dummyBoard);

    if(winningSpot.length>0){
        return moveHere(winningSpot[0]);
    }
    else if(losingSpot.length>0){
        return moveHere(losingSpot[0]);
    }
    else if(count>4){
        

    
    const firstMove=simulateMoves(player1,dummyBoard);
    const flaggedSpots=[];
    removeFlaggedSpots(firstMove);

    const secondMove=[];
    simulateSecondMoves(firstMove,secondMove);
    const potentialWinningSpotsFromSecondMove= findPotentialWinningSpots(secondMove);
    
    
    
    const thirdMove=[];
    simulateThirdMoves(secondMove,thirdMove);     
    const leastLoses= leastLosesF(thirdMove);
    //console.log(potentialWinningSpotsFromSecondMove,leastLoses) 

    function removeFlaggedSpots(firstMove){
        firstMove.forEach((board,i)=>{
            //const flaggedSpots=[];
            const winningSpot=checkWin(player2,board);
            if(winningSpot.length>0){
                const flaggedSpot= JSON.parse(JSON.stringify(winningSpot));
               flaggedSpot[0][0]=flaggedSpot[0][0]+1;
               flaggedSpots.push(flaggedSpot[0])    
               firstMove.splice(i,1);
            }        
        })
    
    }

    function findPotentialWinningSpots(secondMove){

        const potentialWinningBoards=[];
    for(let arrBoard of secondMove){
        for(let board of arrBoard){
            const winningSpot=checkWin(player1,board);
            if(winningSpot.length>0){
                //console.log(winningSpot,"for board", firstMove[secondMove.indexOf(arrBoard)]);
    
                potentialWinningBoards.push(findMoveFromBoard(firstMove[secondMove.indexOf(arrBoard)],dummyBoard));
                break;
               
            }
    
       
        }
    }
    return potentialWinningBoards;
    }

    function leastLosesF(thirdMove){
        const firstMoveNLoses=[]
        let c=0;
        let thisArr=[];
        for(let first of thirdMove){
            
           
            for(let second of first){
                for(let board of second){
                   //  console.log(board);
                   const winningSpot=checkWin(player2,board);                    
                    
                   if(winningSpot.length>0){
                      // console.log(board,"winningspot:",winningSpot);
                       c++;
                       
                      // console.log(thirdMove.indexOf(first));
                       
                   }
                }
            }
            thisArr.push(c);
           c=0;
    
        }
     
        const min = Math.min(...thisArr)
       // console.log(min,"of arr",thisArr,"index of", thisArr.indexOf(min));
        return thisArr.indexOf(min);
    
       };


    //console.log(potentialWinningSpotsFromSecondMove[0],"and",findMoveFromBoard(firstMove[leastLoses],dummyBoard));
    // if(leastLoses.length===0){
    //     move random
    // })
  //  if(potentialWinningSpotsFromSecondMove[0]!=undefined){
   // return moveHere(potentialWinningSpotsFromSecondMove[0]);
   // }
  //  else
    return findMoveFromBoard(firstMove[leastLoses],dummyBoard);
}
else{
    possibleMoves=checkPosMoves(dummyBoard);
    let rand=Math.floor(Math.random()*possibleMoves.length);
    
    count++;
    return moveHere(possibleMoves[rand]);
}
    
}








