"use strict";
const MINE = "🧨";
const FLAG = "🚩";
let globalStartTime;
let globalIntervalId;
let globalBoard;
let globalGame;
let globalLevel = {
    size: 4,
    mines: 2,
};

function initGame() {
    globalBoard = buildBoard();
    resetTimer();
    addRandMines();
    setMinesNegsCount(globalBoard);
    renderBoard(globalBoard);
    globalGame = {
        isOn: true,
        lives: 3,
        IsVictory: false,
        isFirstClick: true,
    };
    let elLive = document.querySelector(".live span");
    elLive.innerText = globalGame.lives;
    let elBtn = document.querySelector(".restart span");
    elBtn.innerText = "😂";
}

function buildBoard() {
    let board = [];
    for (let i = 0; i < globalLevel.size; i++) {
        board.push([]);
        for (let j = 0; j < globalLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
        }
    }

    return board;
}

function countNeighbors(cellI, cellJ, board) {
    let neighborsCount = 0;
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            var cell = board[i][j];

            if (cell.isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function renderBoard(board) {
    let strHTML = '<table border="4"><tbody>';
    for (let i = 0; i < board.length; i++) {
        strHTML += "<tr>";
        for (let j = 0; j < board[0].length; j++) {
            let currCell = board[i][j];
            let className = getClassName({ i, j });
            if (currCell.isShown) {
                let cell = !currCell.isMine ? currCell.minesAroundCount : MINE;
                strHTML += `<td class="cell ${className}" onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(this, ${i}, ${j})">${cell}</td>`;
            } else {
                strHTML += `<td class="cell ${className}" onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"></td>`;
            }
        }
        strHTML += "</tr>";
    }
    strHTML += "</tbody></table>";
    let elTable = document.querySelector(".table");
    elTable.innerHTML = strHTML;
}

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNeighbors(i, j, board);
            }
        }
    }
}

function renderCell(location, value) {
    let cellSelector = "." + getClassName(location);
    let elCell = document.querySelector(cellSelector);
    elCell.innerText = value;
    elCell.style.backgroundColor = "gray";
}

function cellClicked(elCell, i, j) {
    let cell = globalBoard[i][j];
    if (globalGame.isFirstClick) {
        if (cell.isMine) return;
        globalGame.isFirstClick = false;
    }
    if (!globalGame.isOn) return;
    if (!globalIntervalId) startTimer();
    if (cell.isMarked) return;
    if (cell.isShown) return;
    if (!cell.isMine && !cell.isShown) {
        cell.isShown = true;
        renderCell({ i, j }, cell.minesAroundCount);
        checkWin();
    }
    if (cell.minesAroundCount === 0 && !cell.isMine) {
        cell.isShown = true;
        renderCell({ i, j }, cell.minesAroundCount);
        expandShown(globalBoard, i, j);
        checkWin();
    }

    if (cell.isMine) {
        let elBtn = document.querySelector(".restart span");
        elBtn.innerText = "😫";
        if (cell.isShown) return;
        globalGame.lives--;
        updateLives();
        cell.isShown = true;
        renderCell({ i, j }, MINE);
        if (globalGame.lives === 0) {
            globalGame.isOn = false;
            revealMines();
            clearInterval(globalIntervalId);

            let elBtn = document.querySelector(".restart span");
            elBtn.innerText = "💀";
        }
    }
}

function cellMarked(elCell, i, j) {
    let cell = globalBoard[i][j];
    if (!globalGame.isOn) {
        clearInterval(globalIntervalId);
        return;
    }

    if (cell.isShown) return;
    if (cell.isMarked) {
        cell.isMarked = false;
        elCell.innerText = "";
        renderCell({ i, j }, "");
        elCell.style.backgroundColor = "";
        checkWin();
    } else {
        cell.isMarked = true;
        elCell.innerText = FLAG;
        renderCell({ i, j }, FLAG);
        checkWin();
    }
}

function checkWin() {
    for (let i = 0; i < globalBoard.length; i++) {
        for (let j = 0; j < globalBoard[0].length; j++) {
            let currCell = globalBoard[i][j];
            if (!currCell.isMine && !currCell.isShown) return;
            if (currCell.isMine && !currCell.isShown && !currCell.isMarked)
                return;
        }
    }
    clearInterval(globalIntervalId);
    globalGame.IsVictory = true;
    let elBtn = document.querySelector(".restart span");
    elBtn.innerText = "😛";
}

function expandShown(board, cellI, cellJ) {
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            let cell = board[i][j];
            renderCell({ i, j }, cell.minesAroundCount);
            cell.isShown = true;
        }
    }
}

function addRandMines() {
    let count = 0;
    while (count < globalLevel.mines) {
        let i = getRandomInt(0, globalBoard.length);
        let j = getRandomInt(0, globalBoard[0].length);
        var randCell = globalBoard[i][j];
        if (randCell.isMine) continue;
        randCell.isMine = true;
        count++;
    }
}



function revealMines() {
    for (let i = 0; i < globalBoard.length; i++) {
        for (let j = 0; j < globalBoard[0].length; j++) {
            let cell = globalBoard[i][j];
            if (cell.isMine) {
                cell.isShown = true;
                renderCell({ i, j }, MINE);
            }
        }
    }
}

function safeClick() {
    if (globalGame.safeClick === 0) return;
    globalGame.safeClick--;
    let safeCells = [];
    for (let i = 0; i < globalBoard.length; i++) {
        for (let j = 0; j < globalBoard[0].length; j++) {
            let cell = globalBoard[i][j];
            if (!cell.isMine && !cell.isShown) {
                let newPos = { i, j };
                safeCells.push(newPos);
            }
        }
    }

    let randomNum = getRandomInt(0, safeCells.length);
    let randomCell = safeCells[randomNum];
    let elCell = document.querySelector(
        `.cell-${randomCell.i}-${randomCell.j}`
    );
    elCell.classList.add("safe-click");
    let elBtn = document.querySelector(".buttons span");
    elBtn.innerText = globalGame.safeClick;
    setTimeout(() => {
        elCell.classList.remove("safe-click");
    }, 700);
}


