function onBoardClick(event) {
	console.log("event", event);
	fillSquare(event.target);
}

let player1 = true;
function fillSquare(node) {
	if (node.classList.contains('filled')) {
		console.warn("Clicked on filled square");
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
 * 	- one column
 * 	- diagonal (top left or top right)
 *
 * 
 * @return {Boolean} true means game is over, false means continue
 */
function checkWin() {

}

/**
 * Given squares, draws a line connecting them
 * @param  {[type]} TODO [description]
 * @return {[type]}      [description]
 */
function drawWin(TODO) {
	
}

function newGame() {
	let squares = [...document.querySelectorAll('.square')];
	squares.forEach(function(square) {
		square.innerHTML = "";
		square.className = "square";
	})
}