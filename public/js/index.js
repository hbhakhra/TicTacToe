let board = document.querySelector('.board');
let squares = [...document.querySelectorAll('.square')];
let length = Math.sqrt(squares.length);
let rows = [...document.querySelectorAll('.row')]
				.map(row => [...row.querySelectorAll('.square')]);
let columns = computeColumns();
let diagonals = computeDiagonals();

function computeColumns() {
	let columns = [[],[],[]];
	for(let i=0; i < squares.length; i++) {
		let colIndex = i % length;
		let current = squares[i];
		columns[colIndex].push(current);
	}
	return columns;
}

function computeDiagonals() {
	let diagonals = [[],[]];
	let leftToRight = diagonals[0];
	let rightToLeft = diagonals[1];

	//left to right
	for (let i=0; i < squares.length; i+=length + 1) {
		leftToRight.push(squares[i]);
	} 

	//right to left
	let firstColumnOfLastRow = squares.length - length;
	for (let i=length-1; i <= firstColumnOfLastRow; i+= length - 1) {
		rightToLeft.push(squares[i]);
	}
	return diagonals;
}

function onBoardClick(event) {
	fillSquare(event.target);
	let isWinner = checkWin();
	!isWinner && checkTie();
}

let player1 = true;
function fillSquare(node) {
	if (node.classList.contains('filled')) {
		return;
	} else {
		node.className += " filled";
		node.innerHTML = (player1) ? "X" : "O";
		player1 = !player1;
	}
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
function checkWin() {
	let winningGroup; 
	winningGroup = checkGroups(rows);
	if (!winningGroup) {
		winningGroup = checkGroups(columns);
	}
	if (!winningGroup) {
		winningGroup = checkGroups(diagonals);
	}

	if (winningGroup) {
		console.log("winner", winningGroup);
		drawWin(winningGroup);
	}

	return !!winningGroup;
}

function checkGroups(groups) {
	for(let group of groups) {
		let first = group[0].innerHTML;
		let winner = group.every(square => square.innerHTML && square.innerHTML == first);
		if (winner) {
			return group;
		}
	}
	return null;
}

function checkTie() {
	let allFilled = squares.every(node => !!node.innerHTML);
	if (allFilled) {
		console.log("tie");
		board.className += " tie";
	}
}

/**
 * Given squares, draws a line connecting them
 * @param  {[type]} TODO [description]
 * @return {[type]}      [description]
 */
function drawWin(nodes) {
	nodes.forEach(node => node.className += " winner");
}

function newGame() {
	squares.forEach(function(square) {
		board.className = "board";
		square.innerHTML = "";
		square.className = "square";
		player1 = true;
	})
}