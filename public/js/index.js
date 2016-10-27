/**
 * This file handles game play mechanics and  dom manipulations. minimax.js  is called from here to
 * handle decision logic and is unaware of the dom. 
 */
// dom nodes
const board = document.querySelector('.board');
const squares = [...document.querySelectorAll('.square')];
const length = Math.sqrt(squares.length);

// state
let player1 = true;
let isGameInProgress = true;

//constants
const X = "X";
const O = "O";
const WINNING_GROUPS = getWinningGroups();

/**
 * Gets all possible sequences that can result in a win
 */
function getWinningGroups() {
	let columnIndexes = getColumnIndexes();
	let rowIndexes = getRowIndexes();
	let diagonalIndexes = getDiagonalIndexes();
	return [...columnIndexes, ...rowIndexes, ...diagonalIndexes];
}

function getColumnIndexes() {
	let columns = [[],[],[]];
	for(let i=0; i < squares.length; i++) {
		let colIndex = i % length;
		columns[colIndex].push(i);
	}
	return columns;
}

function getRowIndexes() {
	let rows = [[],[],[]];
	for (let i=0; i<squares.length; i++) {
		let rowIndex = Math.floor(i/length);
		rows[rowIndex].push(i);
	}
	return rows;
}

function getDiagonalIndexes() {
	let diagonals = [[],[]];
	let leftToRight = diagonals[0];
	let rightToLeft = diagonals[1];

	//left to right
	for (let i=0; i < squares.length; i+=length + 1) {
		leftToRight.push(i);
	} 

	//right to left
	let firstColumnOfLastRow = squares.length - length;
	for (let i=length-1; i <= firstColumnOfLastRow; i+= length - 1) {
		rightToLeft.push(i);
	}
	return diagonals;
}

/**
 * Converts state of board from DomNodes to a matrix for easier computation.
 * A single square can be filled with ["", x, o]
 * 
 * @return {Matrix} 2D array representing the board
 */
function getState() {
	return squares.map((square) =>  square.innerHTML);
}

function onBoardClick(event) {
	if (!!event.target.innerHTML) return; //non empty square then do nothing
	doTurn(event.target, X);
	if (isGameInProgress) {
		makeOpposingMove();
	}
}

function doTurn(node, player) {
	if (!isGameInProgress) return; // game is over, do nothing
	
	fillSquare(node, player);
	
	let state = getState();
	let winningGroup = checkWin(state, player);
	
	if (winningGroup) {
		console.log("winner", winningGroup);
		isGameInProgress = false;
		board.className += " win";
		drawWin(winningGroup);
	} else {
		checkTie(state);
	}
}
/**
 * Start off by making random move, will later be filled with AI
 */
function makeOpposingMove() {
	let moveIndex = pickOpposingMove(getState(), O);

	doTurn(squares[moveIndex], O);
}

function fillSquare(node, player) {
	if (node.classList.contains('filled')) { // do nothing if square is filled
		return;
	} else {
		node.className += " filled";
		node.innerHTML = player;
		player1 = !player1;
	}
}

/**
 * Given squares, draws a line connecting them
 * @param  {[type]} TODO [description]
 * @return {[type]}      [description]
 */
function drawWin(indexes) {
	indexes.forEach(index => squares[index].className += " winner");
}

function newGame() {
	squares.forEach(function(square) {
		board.className = "board";
		square.innerHTML = "";
		square.className = "square";
		player1 = true;
		isGameInProgress = true;
	})
}

/**
 * Predict a move with minmax algorithm:
 * Given: Player X already made a move, what move should O make
 *
 * ===Sample===
 * |x| | |
 * | | | |
 * | | | |
 * X went first and picked top left corner (0,0)
 * o has to pick next move
 */

/* 
* A description for the algorithm, assuming X is the "turn taking player," would look something like:
*
* If the game is over, return the score from X's perspective.
* Otherwise get a list of new game states for every possible move
* Create a scores list
* For each of these states add the minimax result of that state to the scores list
* If it's X's turn, return the maximum score from the scores list
* If it's O's turn, return the minimum score from the scores list
* You'll notice that this algorithm is recursive, it flips back and forth between the players until a final score is found.
*/

/**
 * Given the state of the board, computes the next move by delgating to 
 * a selection algorithm. Expected to be called form index.js
 * @param  {Array} state lis of DomNode that belong to the game grid
 * @param {String} player the player we are making a move for
 * @return {DomNode}         the DomNode that was selected to fill
 */
 function pickOpposingMove(state, O) {
 	return pickRandomSquare(state);
 }

/**
 * Simple algorithm to pick a rando empty square
 * 
 * @param  {Array} state List of DomNode that belong to the game grid
 * @return {DomNode}      the selected random dom node that is empty
 */
 function pickRandomSquare(state) {
 	//square is value of a square acutally, so only keeping empty squares aka where value is "" == false
 	let emptySquares = state.reduce((previous, current, currentIndex) => {
 		!current && previous.push(currentIndex);
 		return previous;
 	}, []);
 	let randomIndex = Math.random() * emptySquares.length
 	randomIndex = Math.floor(randomIndex);
 	return emptySquares[randomIndex];
 }

 /**
  * Checks if either player has won the game and shows victory
  * on baord if there is a winner.
  *
  * A win is when 3 squars line up in:
  * 	- one row
  * 		1,2,3
  * 		4,5,6
  * 		7,8,9
  * 	- one column
  * 		1,4,7
  * 		2,5,8
  * 		3,6,9
  * 	- diagonal (top left or top right)
  * 		1,5,9
  * 		3,5,7
  * 
  * @return {Boolean} true means game is over, false means continue
  */
 function checkWin(state, player) {
 	for(let group of WINNING_GROUPS) {
 		if (group.every(index => state[index] == player)) {
 			return group;
 		}
 	}
 }

 function checkTie(state) {
 	let allFilled = state.every(entry => !!entry);
 	if (allFilled) {
 		board.className += " tie";
 		isGameInProgress = false;
 	}
 }