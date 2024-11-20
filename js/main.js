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
// WHen a marker is clicked, run function handleDrop
document.getElementById('markers').addEventListener('click', handleDrop);
// When Play Again button is clicked, run function init
playAgainBtn.addEventListener('click', init);


/*-------------------- functions --------------------*/
init();

// Initialize all state variables, then call render()
function init() {

  // to visualize 
  // array 90 degrees counter-clockwise
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
  winner = getWinner();
  turn *= -1;
  render();
}

function getWinner() {
  return null;
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

