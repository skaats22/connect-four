/*-------------------- constants --------------------*/
const COLORS = {
  'null': 'white', 
  '1': 'rebeccapurple',
  '-1': 'orange',
};


/*-------------------- state variables --------------------*/
let board;
let turn;
let winner;

/*-------------------- cached elements --------------------*/
// Adding Play Again button to a variable
const playAgainBtn = document.getElementById('play-again');
// Adding h1 message to a variable
const messageEl = document.querySelector('h1');
// Adding arrow drop buttons to an array
const markerEls = [...document.querySelectorAll('#markers > div')];

/*-------------------- event listeners --------------------*/
// When a marker is clicked, run function handleDrop
document.getElementById('markers').addEventListener('click', handleDrop);
// When Play Again button is clicked, run function init
playAgainBtn.addEventListener('click', init);


/*-------------------- functions --------------------*/
init();

// Initialize all state variables, then call render()
function init() {

  // To visualize the mapping between the column arrays
  //  and the cells on the page (DOM), rotate the board 
  //  array 90 degrees counter-clockwise
  board = [
    [null, null, null, null, null, null], // column 0
    [null, null, null, null, null, null], // column 1
    [null, null, null, null, null, null], // column 2
    [null, null, null, null, null, null], // column 3
    [null, null, null, null, null, null], // column 4
    [null, null, null, null, null, null], // column 5
    [null, null, null, null, null, null], // column 6
  ];
  turn = 1;
  winner = null;
  render();
}

// In response to user interaction, update all impacted state, then call render()
function handleDrop(eventObject) {
  // Determine the colidx for clicked marker
  const colIdx = markerEls.indexOf(eventObject.target);
  // If user misclicked a marker, do nothing
  if (colIdx === -1) return;
  // Shortcut variable to the column A
  const colArr = board[colIdx];
  // Determine the rowIdx (first null in the column)
  const rowIdx = colArr.indexOf(null);
  // Update the borad/column state
  colArr[rowIdx] = turn;
  winner = getWinner(colIdx, rowIdx);
  turn *= -1;
  render();
}

function getWinner(colIdx, rowIdx) {
  // Winner has to include the most recent cell clicked so start from there
  return checkVertical(colIdx, rowIdx) || checkHorizontal(colIdx, rowIdx) || 
  checkForwardSlash(colIdx, rowIdx) || checkBackSlash(colIdx, rowIdx);
}

function checkBackSlash(colIdx, rowIdx) {
  const numUpLeft = countNumAdjacent(colIdx, rowIdx, -1, 1);
  const numDownright = countNumAdjacent(colIdx, rowIdx, 1, -1);
  // If markers to left and right of last placed marker is greater, 
  //  or equal to 3. Return turn, but if not,
  //  then return null, which keeps game going
  return (numUpLeft + numDownright) >= 3 ? turn : null;
}

function checkForwardSlash(colIdx, rowIdx) {
  const numUpRight = countNumAdjacent(colIdx, rowIdx, 1, 1);
  const numDownLeft = countNumAdjacent(colIdx, rowIdx, -1, -1);
  // If markers to left and right of last placed marker is greater, 
  //  or equal to 3. Return turn, but if not,
  //  then return null, which keeps game going
  return (numUpRight + numDownLeft) >= 3 ? turn : null;
}

function checkHorizontal(colIdx, rowIdx) {
  // Need to check left & right 3 markers are the same
  // Need to check if out of bounds

  // col/rowOffset is the value to adjust the current
  //  colIdx and rowIdx by after each iteration
  const numLeft = countNumAdjacent(colIdx, rowIdx, -1, 0);
  const numRight = countNumAdjacent(colIdx, rowIdx, 1, 0);
  // If markers to left and right of last placed marker is greater, 
  //  or equal to 3. Return turn, but if not,
  //  then return null, which keeps game going
  return (numLeft + numRight) >= 3 ? turn : null;
}

function checkVertical(colIdx, rowIdx) {
  // Need to check below 3 markers are the same
  // Need to check if out of bounds

  // col/rowOffset is the value to adjust the current
  //  colIdx and rowIdx by after each iteration
  const numBelow = countNumAdjacent(colIdx, rowIdx, 0, -1);
  // If markers below = 3, then return turn, but if not,
  //  then return null, which keeps game going
  return numBelow === 3 ? turn : null;
}

function countNumAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
  let count = 0;
  colIdx += colOffset;
  rowIdx += rowOffset;
  // If && = falsy, it gets returned immediately
  while (board[colIdx] && board[colIdx][rowIdx] === turn) {
    count++;
    colIdx += colOffset;
    rowIdx += rowOffset;
  }
  return count;
}

// Visualize all state and other info in the DOM
function render() {
  renderBoard();
  renderControls();
  renderMessage();
}

function renderBoard() {
  board.forEach(function(colArr, colIdx) {
    colArr.forEach(function(cellVal, rowIdx) {
      // Select the appropriate  cell
      const cellEl = document.getElementById(`c${colIdx}r${rowIdx}`);
      cellEl.style.backgroundColor = COLORS[cellVal];
    });
  });
}

function renderControls() {
  // Ternary expression
  // <conditional expression> ? <truthy expression> : <falsy expression>
  // : = otherwise
  playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
  // Hide/show the marker divs
  markerEls.forEach(function(markerEl, colIdx) {
    // Checking if column contains a null (empty space)
    const showMarker = board[colIdx].includes(null);
    // If a column does not contain a null and game is in play, then hide marker
    markerEl.style.visibility = showMarker && !winner ? 'visible' : 'hidden';
  });
}

function renderMessage() {
  if (winner === null) {
    // This codes out who's turn it is
    messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`
  } else if (winner === 'Tie') {
    messageEl.innerText = "It's a Tie!";
  } else {
    // We have a winner
    messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> wins!`
  }
}