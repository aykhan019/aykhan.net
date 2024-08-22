
class Board {
    constructor() {
        this.Squares = [...Array(64)].map(() => Piece.None);
        this.htmlBoard = document.getElementById("chessBoard");
        this.ColorToMove = Piece.White;
        this.MovesPlayed = [];
        this.WhiteKingIsChecked = false;
        this.BlackKingIsChecked = false;
        this.WhiteCanCastleToKingSide = true;
        this.WhiteCanCastleToQueenSide = true;
        this.BlackCanCastleToKingSide = true;
        this.BlackCanCastleToQueenSide = true;
        this.fen = chess.fen();
    }

    // This function draws a chess board
    drawBoard() {
        let isEven = true;
        for (let r = ranks.length - 1; r >= 0; r--) {
            for (let f = 0; f < files.length; f++) {
                let myClass = 'odd square';
                if (isEven) {
                    myClass = 'even square';
                }
                board.htmlBoard.innerHTML += `
                    <section id='${r * ranks.length + f}' class='${myClass}'></section>
               `;
                isEven = !isEven;
            }
            isEven = !isEven;
        }
    }

    // This function updates "Squares" property of "Board" class
    initializePieces() {
        let fenBoard = board.fen.split(" ")[0].replace(/\//g, "");
        let index = ranks.length * files.length - ranks.length;

        for (let i = 0; i < fenBoard.length; i++) {
            const char = fenBoard[i];

            let isDigit = !isNaN(parseInt(char));
            if (isDigit) {
                let digit = parseInt(char);
                for (let k = 0; k < digit; k++) {
                    board.Squares[index] = new Piece(Piece.None, Piece.None);
                    index++;
                }
            }
            else {
                board.Squares[index] = Piece.getPiece(char);
                index++
            }

            if ((index) % ranks.length === 0) {
                index -= (ranks.length * 2);
            }
        };
    }

    // This function draws pieces by using "Squares" property of "Board" class
    drawPieces() {
        for (let x = 0; x < board.Squares.length; x++) {
            const element = board.Squares[x];
            let color = Piece.getColorByNo(element.color);
            let piece = Piece.getPieceByNo(element.piece);
            let myclass = `${color}-${piece}`;
            if (myclass != `${none}-${none}`) {
                let square = document.getElementById(x);
                let pieceImgSource = getPieceSourceByClass(myclass);
                square.innerHTML = `<img src='${pieceImgSource}' class='piece' alt='${myclass}' draggable="true">`;
            }
        }
    }

    // returns index of the squares that are around in the given index
    getAdjacentSquares(index) {
        const adjacentSquares = [];
        const row = Math.floor(index / 8);
        const col = index % 8;

        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < 8 && j >= 0 && j < 8 && (i !== row || j !== col)) {
                    adjacentSquares.push(i * 8 + j);
                }
            }
        }

        return adjacentSquares;
    }

    // returns index of the piece in Squares Array
    getPieceIndex(piece) {
        for (let i = 0; i < BOARD_SIZE; i++) {
            const square = this.Squares[i];
            if (square.piece === piece.piece && square.color === piece.color) {
                return i;
            }
        }
        return -1;
    }

    // returns true if there is a piece on the square
    isPieceOnSquare(squareIndex) {
        return this.Squares[squareIndex].piece !== Piece.None;
    }

    // returns row of the square with the given index
    getRankOfIndex(index) {
        return Math.floor((index / 8)) + 1;
    }

    filterLegalMoves(newGeneratedMoves) {
        let legalMoves = [];
        for (let i = 0; i < newGeneratedMoves.length; i++) {
            const moveToVerify = newGeneratedMoves[i];

            // Make Move
            let startSquarePiece = board.Squares[moveToVerify.startSquare];
            let targetSquarePiece = board.Squares[moveToVerify.targetSquare];
            board.Squares[moveToVerify.startSquare] = new Piece(Piece.None, Piece.None);
            board.Squares[moveToVerify.targetSquare] = startSquarePiece;
            //    board.Squares[moveToVerify.targetSquare].hasMoved = true;
            let myPiece = board.Squares.filter(s => s.piece == Piece.King && s.color == board.ColorToMove)[0];
            let myKingSquare;
            if (myPiece)
                myKingSquare = board.getPieceIndex(myPiece);
            else
                continue;

            // change boardColor to get opponent moves
            board.ColorToMove = Piece.reverseColor(board.ColorToMove);
            let opponentsMoves = generateMoves();
            board.ColorToMove = Piece.reverseColor(board.ColorToMove);

            // Check Move
            if (opponentsMoves.filter(response => response.targetSquare == myKingSquare).length > 0) {
                // The KING Is Under Attack!
            }
            else {
                document.getElementById(myKingSquare).style.backgroundColor = stringEmpty;
                legalMoves.push(moveToVerify);
            }

            // UnMake Move
            //   board.Squares[moveToVerify.targetSquare].hasMoved = false;
            board.Squares[moveToVerify.startSquare] = startSquarePiece;
            board.Squares[moveToVerify.targetSquare] = targetSquarePiece;
        }
        // if (moves.length != legalMoves.length) {
        //     AI_vs_AI = false;
        //     console.log("----- LEGAL MOVES -----")
        //     for (let i = 0; i < legalMoves.length; i++) {
        //         const element = legalMoves[i];
        //         console.log(element.startSquare + " " + element.targetSquare);
        //     }
        //     console.log("-----------------------")
        // }
        return legalMoves;
    }
}

class Piece {
    constructor(piece, color) {
        this.piece = piece;
        this.color = color;
        this.hasMoved = false; // for pawns
    }

    static movePiece(oldSquare, newSquare, piece, isCapture = false) { // it modifies Squares array
        board.Squares[oldSquare.id] = new Piece(Piece.None, Piece.None);
        board.Squares[newSquare.id] = piece;
        board.Squares[newSquare.id].hasMoved = true;

        board.ColorToMove = Piece.reverseColor(board.ColorToMove);
        // check castle
        if (piece.piece === Piece.King && Math.abs(oldSquare.id - newSquare.id) == 2) {
            let noPiece = new Piece(Piece.None, Piece.None);
            if (piece.color === Piece.White) {
                let whiteRook = new Piece(Piece.Rook, Piece.White);
                if (newSquare.id == 6) { // King Side Castle
                    board.Squares[7] = noPiece;
                    board.Squares[5] = whiteRook;
                    changeViewAfterMove(document.getElementById(7), document.getElementById(5), document.getElementById(7).children[0]);
                }
                else if (newSquare.id == 2) { // Queen Side Castle
                    board.Squares[0] = noPiece;
                    board.Squares[3] = whiteRook;
                    changeViewAfterMove(document.getElementById(0), document.getElementById(3), document.getElementById(0).children[0]);
                }
                board.WhiteCanCastleToKingSide = false;
                board.WhiteCanCastleToQueenSide = false;
            }
            else if (piece.color === Piece.Black) {
                let blackRook = new Piece(Piece.Rook, Piece.Black);
                if (newSquare.id == 62) { // King Side Castle
                    board.Squares[63] = noPiece;
                    board.Squares[61] = blackRook;
                    changeViewAfterMove(document.getElementById(63), document.getElementById(61), document.getElementById(63).children[0]);
                }
                else if (newSquare.id == 58) { // Queen Side Castle
                    board.Squares[56] = noPiece;
                    board.Squares[59] = blackRook;
                    changeViewAfterMove(document.getElementById(56), document.getElementById(59), document.getElementById(56).children[0]);
                }
                board.BlackCanCastleToKingSide = false;
                board.BlackCanCastleToQueenSide = false;
            }
        }
        // check EnPassant
        if (piece.piece === Piece.Pawn) {
            const direction = Piece.isColor(piece, Piece.White) ? 1 : -1;
            let directionToSide1 = 2;
            let directionToSide2 = 3;
            if (piece.color === Piece.Black) {
                directionToSide1 = 3;
                directionToSide2 = 2;
            }
            let myDir;
            const leftCaptureIndex = oldSquare.id + direction * 7;
            if (leftCaptureIndex === newSquare.id) {
                myDir = directionToSide1;
            } else {
                myDir = directionToSide2;
            }
            if (checkEnPassant(oldSquare.id, newSquare.id, direction, myDir)) {
                const direction = Piece.isColor(piece, Piece.White) ? 1 : -1;
                let enPassantVictimSqaureID = newSquare.id - (direction * 8);
                board.Squares[enPassantVictimSqaureID] = new Piece(Piece.None, Piece.None);
                changeViewAfterMove(document.getElementById(enPassantVictimSqaureID), document.getElementById(oldSquare.id), document.getElementById(enPassantVictimSqaureID).children[0]);
                isCapture = true;
            }

            // check rank for pawn
            let rank = board.getRankOfIndex(newSquare.id);
            if (rank === 1 || rank === 8) // do not check colors, since pawns cannot go back
            {
                const newPiece = new Piece(Piece.Queen, piece.color);
                board.Squares[newSquare.id] = newPiece;

                // Select Piece
                let mc;
                if (piece.color === Piece.White)
                    mc = "white-queen";
                else
                    mc = "black-queen";

                let newPieceImgSource = getPieceSourceByClass(mc);
                beingDragged = document.getElementById(oldSquare.id).children[0];
                beingDragged.src = newPieceImgSource;
            }
        }

        // check check :)
        let myKingSquareIndex = board.Squares.findIndex(f => f.piece == Piece.King && f.color == board.ColorToMove);
        // console.log("KING INDEX " + myKingSquareIndex);
        let myKingSquare = document.getElementById(myKingSquareIndex);
        board.ColorToMove = Piece.reverseColor(board.ColorToMove);
        let testMoves = getNewMoves();
        board.ColorToMove = Piece.reverseColor(board.ColorToMove);

        if (testMoves.findIndex(m => m.targetSquare === myKingSquareIndex) != -1) {
            myKingSquare.style = "background-image: radial-gradient(circle at center center, rgb(255, 0, 0) 0%, rgb(231, 0, 0) 25%, rgba(169, 0, 0) 89%, rgba(158, 0, 0) 100%);"
            myPrevKingSquare = myKingSquare;
            if (board.Squares[myKingSquareIndex].color === Piece.White) {
                board.WhiteKingIsChecked = true;
            } else if (board.Squares[myKingSquareIndex].color === Piece.Black) {
                board.BlackKingIsChecked = true;
            }
        } else {
            if (myPrevKingSquare != null) {
                myPrevKingSquare.style.background = stringEmpty;
            }

            if (board.Squares[myKingSquareIndex].color === Piece.White) {
                board.WhiteKingIsChecked = false;
            } else if (board.Squares[myKingSquareIndex].color === Piece.Black) {
                board.BlackKingIsChecked = false;
            }
        }

        //check capture
        if (isCapture) {
            captureAudio.play();
        }
        else {
            moveAudio.play();
        }
        board.MovesPlayed.push(new Move(oldSquare.id, newSquare.id));
        showBoardInConsole();

        let startMove = coordinates[oldSquare.id];
        let endMove = coordinates[newSquare.id];


        if (isCapture){
            endMove = "x" + endMove;
        }

        if (piece.piece != Piece.Pawn && piece.piece != Piece.None) {
            let pieceLetter = getPieceLetter(piece).toUpperCase();
            // startMove = pieceLetter + startMove;
            endMove = pieceLetter + endMove;
        }
        else if (piece.piece === Piece.Pawn && endMove.indexOf("x") != -1){
            endMove = startMove[0] + endMove;
        }
      
        // let move = `${startMove}-${endMove}`;

        let result = chess.move(endMove);
        // console.log(result);
        // console.log("Move Played : " + endMove);
        board.fen = chess.fen();
        // console.log("FEN : " + board.fen);
        // console.log(chess.ascii());

        updatePlayedMoves();
        moves = getNewMoves();
    }

    static get None() {
        return 0;
    }
    static get King() {
        return 1;
    }
    static get Pawn() {
        return 2;
    }
    static get Knight() {
        return 3;
    }
    static get Bishop() {
        return 4;
    }
    static get Rook() {
        return 5;
    }
    static get Queen() {
        return 6;
    }

    static get White() {
        return 8;
    }
    static get Black() {
        return 16;
    }

    static getPiece(char) {
        let result = new Piece(-1, -1);
        if (isLower(char))
            result.color = this.Black;
        else
            result.color = this.White;

        char = char.toLowerCase();
        if (char === 'p')
            result.piece = this.Pawn;
        else if (char === 'n')
            result.piece = this.Knight;
        else if (char === 'b')
            result.piece = this.Bishop;
        else if (char === 'r')
            result.piece = this.Rook;
        else if (char === 'q')
            result.piece = this.Queen;
        else if (char === 'k')
            result.piece = this.King;

        return result;
    }

    static getColorByNo(no) {
        if (no === this.White)
            return white;
        else if (no === this.Black)
            return black;
        else
            return none;
    }

    static getPieceByNo(no) {
        if (no === this.Pawn)
            return pawn;
        else if (no === this.Rook)
            return rook;
        else if (no === this.Knight)
            return knight;
        else if (no === this.Bishop)
            return bishop;
        else if (no === this.Queen)
            return queen;
        else if (no === this.King)
            return king;
        else
            return none;
    }

    static isColor(piece, color) {
        if (piece.color == color)
            return true;
        return false;
    }

    static isType(piece, otherPiece) {
        return piece.piece === otherPiece;
    }

    static isSlidingPiece(piece) {
        if (Piece.isType(piece, this.Queen) ||
            Piece.isType(piece, this.Rook) ||
            Piece.isType(piece, this.Bishop))
            return true;
        return false;
    }

    static reverseColor(color) {
        if (color === this.White)
            return this.Black;
        return this.White;
    }

    static getUnicode(piece) {
        switch (piece.piece) {
            case Piece.None:
                return "";
            case Piece.King:
                return piece.color === Piece.White ? "\u2654" : "\u265A";
            case Piece.Pawn:
                return piece.color === Piece.White ? "\u2659" : "\u265F";
            case Piece.Knight:
                return piece.color === Piece.White ? "\u2658" : "\u265E";
            case Piece.Bishop:
                return piece.color === Piece.White ? "\u2657" : "\u265D";
            case Piece.Rook:
                return piece.color === Piece.White ? "\u2656" : "\u265C";
            case Piece.Queen:
                return piece.color === Piece.White ? "\u2655" : "\u265B";
            default:
                return "";
        }
    }
}

class Move {
    constructor(startSquare, targetSquare) {
        this.startSquare = startSquare;
        this.targetSquare = targetSquare;
    }
}