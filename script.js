const chessBoard = document.getElementById('chessBoard');
const statusDisplay = document.getElementById('status');
const moveHistoryDisplay = document.getElementById('moveHistory');
const whitePlayerInput = document.getElementById('whitePlayer');
const blackPlayerInput = document.getElementById('blackPlayer');
const boardSize = 8;
const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟︎',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const initialBoard = [
    'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
    'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
    'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
];

let board = initialBoard.slice();
let selectedPiece = null;
let selectedPieceIndex = null;
let isWhiteTurn = true;
let moveHistory = [];

function createBoard() {
    chessBoard.innerHTML = '';
    for (let i = 0; i < boardSize * boardSize; i++) {
        const square = document.createElement('div');
        const isBlack = (Math.floor(i / boardSize) + i) % 2 === 1;
        square.className = isBlack ? 'black' : 'white';
        square.dataset.index = i;
        square.innerText = pieces[board[i]] || '';
        square.addEventListener('click', () => handleSquareClick(i));
        chessBoard.appendChild(square);
    }
}

function handleSquareClick(index) {
    if (selectedPiece !== null) {
        movePiece(index);
    } else {
        selectPiece(index);
    }
}

function selectPiece(index) {
    const piece = board[index];
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
    const piece = board[index];
    switch (piece.toLowerCase()) {
        case 'p': return getPawnMoves(index);
        case 'r': return getRookMoves(index);
        case 'n': return getKnightMoves(index);
        case 'b': return getBishopMoves(index);
        case 'q': return getQueenMoves(index);
        case 'k': return getKingMoves(index);
        default: return [];
    }
}

function getPawnMoves(index) {
    const moves = [];
    const piece = board[index];
    const direction = piece === 'P' ? -1 : 1;
    const startRow = piece === 'P' ? 6 : 1;
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    // Move one square forward
    if (row + direction >= 0 && row + direction < boardSize && board[index + direction * boardSize] === '') {
        moves.push(index + direction * boardSize);
        // Move two squares forward from the starting position
        if (row === startRow && board[index + 2 * direction * boardSize] === '') {
            moves.push(index + 2 * direction * boardSize);
        }
    }

    // Capture diagonally
    if (col > 0 && row + direction >= 0 && row + direction < boardSize && board[index + direction * boardSize - 1] && board[index + direction * boardSize - 1].toLowerCase() !== piece.toLowerCase()) {
        moves.push(index + direction * boardSize - 1);
    }
    if (col < 7 && row + direction >= 0 && row + direction < boardSize && board[index + direction * boardSize + 1] && board[index + direction * boardSize + 1].toLowerCase() !== piece.toLowerCase()) {
        moves.push(index + direction * boardSize + 1);
    }

    return moves;
}

function getRookMoves(index) {
    const moves = [];
    const directions = [-1, 1, -boardSize, boardSize];
    directions.forEach(direction => {
        for (let i = index + direction; isValidMove(i, direction); i += direction) {
            if (board[i] === '') {
                moves.push(i);
            } else {
                if (board[i].toLowerCase() !== board[index].toLowerCase()) {
                    moves.push(i);
                }
                break;
            }
        }
    });
    return moves;
}

function getKnightMoves(index) {
    const moves = [];
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

    knightMoves.forEach(move => {
        const targetIndex = index + move;
        const targetRow = Math.floor(targetIndex / boardSize);
        const targetCol = targetIndex % boardSize;
        if (targetIndex >= 0 && targetIndex < 64 && Math.abs(row - targetRow) <= 2 && Math.abs(col - targetCol) <= 2) {
            if (board[targetIndex] === '' || board[targetIndex].toLowerCase() !== board[index].toLowerCase()) {
                moves.push(targetIndex);
            }
        }
    });

    return moves;
}

function getBishopMoves(index) {
    const moves = [];
    const directions = [-9, -7, 7, 9];
    directions.forEach(direction => {
        for (let i = index + direction; isValidMove(i, direction); i += direction) {
            if (board[i] === '') {
                moves.push(i);
            } else {
                if (board[i].toLowerCase() !== board[index].toLowerCase()) {
                    moves.push(i);
                }
                break;
            }
        }
    });
    return moves;
}

function getQueenMoves(index) {
    return [...getRookMoves(index), ...getBishopMoves(index)];
}

function getKingMoves(index) {
    const moves = [];
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    const kingMoves = [-9, -8, -7, -1, 1, 7, 8, 9];

    kingMoves.forEach(move => {
        const targetIndex = index + move;
        const targetRow = Math.floor(targetIndex / boardSize);
        const targetCol = targetIndex % boardSize;
        if (targetIndex >= 0 && targetIndex < 64 && Math.abs(row - targetRow) <= 1 && Math.abs(col - targetCol) <= 1) {
            if (board[targetIndex] === '' || board[targetIndex].toLowerCase() !== board[index].toLowerCase()) {
                moves.push(targetIndex);
            }
        }
    });

    return moves;
}

function isValidMove(targetIndex, direction) {
    const startRow = Math.floor(targetIndex / boardSize);
    const startCol = targetIndex % boardSize;
    const endRow = Math.floor((targetIndex + direction) / boardSize);
    const endCol = (targetIndex + direction) % boardSize;

    if (direction === 1 && (endCol === 0 || endCol === 7)) return false;
    if (direction === -1 && (startCol === 0 || startCol === 7)) return false;

    return true;
}

function clearHighlights() {
    Array.from(chessBoard.children).forEach(square => square.classList.remove('highlight'));
}

function movePiece(index) {
    if (chessBoard.children[index].classList.contains('highlight')) {
        const move = {
            from: selectedPieceIndex,
            to: index,
            piece: board[selectedPieceIndex]
        };
        board[index] = selectedPiece;
        board[selectedPieceIndex] = '';
        isWhiteTurn = !isWhiteTurn;
        statusDisplay.textContent = isWhiteTurn ? `${whitePlayerInput.value || "White"}'s turn` : `${blackPlayerInput.value || "Black"}'s turn`;
        updateBoard();
        addMoveToHistory(move);
        selectedPiece = null;
        selectedPieceIndex = null;
        clearHighlights();
    }
}

function updateBoard() {
    const squares = chessBoard.children;
    for (let i = 0; i < squares.length; i++) {
        squares[i].innerText = pieces[board[i]] || '';
    }
}

function addMoveToHistory(move) {
    const moveEntry = document.createElement('li');
    moveEntry.textContent = `${pieces[move.piece]} moved from ${getPosition(move.from)} to ${getPosition(move.to)}`;
    moveHistoryDisplay.appendChild(moveEntry);
}

function getPosition(index) {
    const col = String.fromCharCode('a'.charCodeAt(0) + (index % boardSize));
    const row = boardSize - Math.floor(index / boardSize);
    return `${col}${row}`;
}

createBoard();
