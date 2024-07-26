const chessBoard = document.getElementById('chessBoard');
const statusDisplay = document.getElementById('status');
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
let isWhiteTurn = true;

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
    if (piece && isCorrectTurn(piece)) {
        selectedPiece = piece;
        selectedPieceIndex = index;
        highlightMoves(index);
    }
}

function isCorrectTurn(piece) {
    return (isWhiteTurn && piece === piece.toUpperCase()) || (!isWhiteTurn && piece === piece.toLowerCase());
}

function highlightMoves(index) {
    clearHighlights();
    const possibleMoves = getPossibleMoves(index);
    possibleMoves.forEach(i => chessBoard.children[i].classList.add('highlight'));
    chessBoard.children[index].classList.add('highlight');
}

function getPossibleMoves(index) {
    const moves = [];
    const piece = initialPieces[index];
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    if (piece.toLowerCase() === 'p') {
        const direction = piece === 'P' ? -1 : 1;
        const startRow = piece === 'P' ? 6 : 1;

        if (initialPieces[index + direction * boardSize] === '') {
            moves.push(index + direction * boardSize);
            if (row === startRow && initialPieces[index + 2 * direction * boardSize] === '') {
                moves.push(index + 2 * direction * boardSize);
            }
        }
        if (col > 0 && initialPieces[index + direction * boardSize - 1] && initialPieces[index + direction * boardSize - 1].toLowerCase() !== piece.toLowerCase()) {
            moves.push(index + direction * boardSize - 1);
        }
        if (col < 7 && initialPieces[index + direction * boardSize + 1] && initialPieces[index + direction * boardSize + 1].toLowerCase() !== piece.toLowerCase()) {
            moves.push(index + direction * boardSize + 1);
        }
    } else if (piece.toLowerCase() === 'n') {
        const knightMoves = [
            -17, -15, -10, -6, 6, 10, 15, 17
        ];
        knightMoves.forEach(move => {
            const targetIndex = index + move;
            const targetRow = Math.floor(targetIndex / boardSize);
            const targetCol = targetIndex % boardSize;
            if (targetIndex >= 0 && targetIndex < 64 && Math.abs(row - targetRow) <= 2 && Math.abs(col - targetCol) <= 2) {
                if (initialPieces[targetIndex] === '' || initialPieces[targetIndex].toLowerCase() !== piece.toLowerCase()) {
                    moves.push(targetIndex);
                }
            }
        });
    }

    return moves;
}

function clearHighlights() {
    Array.from(chessBoard.children).forEach(square => square.classList.remove('highlight'));
}

function movePiece(index) {
    if (chessBoard.children[index].classList.contains('highlight')) {
        initialPieces[selectedPieceIndex] = '';
        initialPieces[index] = selectedPiece;
        isWhiteTurn = !isWhiteTurn;
        statusDisplay.textContent = isWhiteTurn ? "White's turn" : "Black's turn";
    }
    selectedPiece = null;
    selectedPieceIndex = null;
    clearHighlights();
    updateBoard();
}

function updateBoard() {
    const squares = chessBoard.children;
    for (let i = 0; i < squares.length; i++) {
        squares[i].innerText = initialPieces[i];
    }
}

createBoard();
