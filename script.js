const chessBoard = document.getElementById('chessBoard');
const boardSize = 8;
const initialPieces = [
    'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R',
    'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
    'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'
];

let selectedPiece = null;
let selectedPieceIndex = null;

function createBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const square = document.createElement('div');
        const isBlack = (Math.floor(i / boardSize) + i) % 2 === 1;
        square.className = isBlack ? 'black' : 'white';
        square.dataset.index = i;
        square.innerText = initialPieces[i];
        square.addEventListener('click', () => handleSquareClick(i));
        chessBoard.appendChild(square);
    }
}

function handleSquareClick(index) {
    if (selectedPiece) {
        movePiece(index);
    } else {
        selectPiece(index);
    }
}

function selectPiece(index) {
    const piece = initialPieces[index];
    if (piece) {
        selectedPiece = piece;
        selectedPieceIndex = index;
    }
}

function movePiece(index) {
    initialPieces[selectedPieceIndex] = '';
    initialPieces[index] = selectedPiece;
    selectedPiece = null;
    selectedPieceIndex = null;
    updateBoard();
}

function updateBoard() {
    const squares = chessBoard.children;
    for (let i = 0; i < squares.length; i++) {
        squares[i].innerText = initialPieces[i];
    }
}

createBoard();
