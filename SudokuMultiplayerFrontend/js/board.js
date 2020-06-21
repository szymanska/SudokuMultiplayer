var board;
let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
let greenColor = getComputedStyle(document.documentElement).getPropertyValue('--main-light2-color');
let mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color');

function initGame(initNumbers) {
    board = new Sudoku;
    board.fill(initNumbers);

    addDragAndDrop();
    addKeyboard();
    addDoubleClick();
}

class Sudoku {
    constructor() {
        // To avoid this connected issue
        var that = this;

        this.board = [];

        (function () {
            class Pos {
                constructor(origPos) {
                    this.x;
                    this.y;
                    this.origPos = origPos;
                    this.boxId = '';
                    this.val = ' ';
                    this.dom;
                }
            }
            for (var i = 0; i < 81; i++) {
                that.board[i] = new Pos(i);
            };
        }());

        // init rows
        (function () {
            that.rows = [];
            for (var i = 0; i < 9; i++) {
                that.rows.push([]);
                for (var j = 0; j < 9; j++) {
                    that.rows[i].push(that.board[j + i * 9]);
                    that.board[j + i * 9].x = i;
                    that.board[j + i * 9].y = j;
                }
            };
        }());

        // init boxes
        (function () {
            var x, y;
            that.boxes = [];

            for (var i = 0; i < 9; i++) {
                that.boxes.push([]);
            }

            for (i = 0; i < 9; i++) {
                x = 3 * (i / 3 | 0);
                for (var j = 0; j < 9; j++) {
                    y = j / 3 | 0;
                    that.board[j + 9 * i].boxId = x + y;
                    that.boxes[x + y].push(that.board[j + 9 * i]);
                }
            }
        }());

        (function () {
            var boxes = document.getElementById('main').getElementsByTagName('table');
            var domBoxes = [];
            var cells;

            for (var i = 0; i < 9; i++) {
                cells = boxes[i].getElementsByTagName('td');
                domBoxes.push([]);
                for (var j = 0; j < 9; j++) {
                    domBoxes[i].push(cells[j]);
                    that.boxes[i][j].dom = domBoxes[i][j];
                    that.boxes[i][j].dom.innerText = ' ';
                };
            };
        }());

        this.clearBoard = function () {
            for (var i = 0; i < that.board.length; i++) {
                that.board[i].val = ' ';
            };
        };

        function removeNoDrop(line_num, i) {
            let line = that.rows[line_num]
            if (line[i].dom.classList.contains('noDrop')) {
                line[i].dom.classList.remove('noDrop');
            }
            line[i].dom.style.color = 'darkred';
        }

        function addNoDrop(line_num, i) {
            let line = that.rows[line_num]
            if (line[i].dom.classList.contains('noDrop') == false) {
                line[i].dom.classList.add('noDrop');
            }
            line[i].dom.style.color = 'black';
        }

        function fillLine(line_num, nums) {
            let line = that.rows[line_num]
            for (var i = 0; i < line.length; i++) {

                if (nums[i].is_blocked) {
                    addNoDrop(line_num, i)
                }
                else {
                    removeNoDrop(line_num, i)
                }

                if (nums[i].value == 0) {
                    line[i].val = ' ';
                }
                else {
                    line[i].val = nums[i].value;
                }
            };
        };

        this.fill = function (initNumbers) {
            for (var i = 0; i < 9; i++)
                fillLine(i, initNumbers[i]);

            for (var i = 0; i < 81; i++) {
                that.board[i].dom.innerHTML = that.board[i].val;
            }
        }
    }
}

function changeNumber(row, column, value) {
    if (value == 0) {
        value = " ";
    }
    j = rowColToTarget(row, column)
    let target = document.getElementsByClassName('target');
    target[j].innerHTML = value;
}

function targetToRowCol(t) {
    smallRow = parseInt((t % 9) / 3);
    smallCol = t % 3;
    bigRow = parseInt(t / 27);
    bigCol = parseInt(t / 9) % 3;
    row = bigRow * 3 + smallRow;
    column = bigCol * 3 + smallCol;
    return {
        row: row,
        column: column
    };
}

function rowColToTarget(row, col) {
    return parseInt(col / 3) * 9 + col % 3 + 3 * (row % 3) + parseInt(row / 3) * 27
}

// DOUBLE CLICK TO CLEAR

function addDoubleClick() {
    var target = document.getElementsByClassName('target');
    for (var i = 0; i < target.length; i++) {
        (function (j) {
            target[j].addEventListener('dblclick', function () {
                if (target[j].classList.contains('noDrop') == false) {
                    rowCol = targetToRowCol(j)
                    requestChangeNumber(window.roomId, rowCol.row, rowCol.column, 0)
                }
            });
        })(i)
    }
}

// DRAG AND DROP INPUT

function addDragAndDrop() {
    var target = document.getElementsByClassName('target');

    for (var i = 0; i < target.length; i++) {
        (function (j) {

            target[j].addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('text', target[j].innerHTML)
            });

            target[j].addEventListener('dragenter', function (e) {
                e.preventDefault();
            });

            target[j].addEventListener('dragover', function (e) {
                e.preventDefault();
                colorCell(target[j]);

            });
            target[j].addEventListener('dragleave', function (e) {
                e.preventDefault();
                target[j].style.backgroundColor = backgroundColor;
            });

            target[j].addEventListener('drop', function (e) {
                e.preventDefault();
                if (target[j].classList.contains('noDrop') == false) {
                    rowCol = targetToRowCol(j)
                    value = e.dataTransfer.getData('text');
                    if (value == " ") {
                        value = 0
                    }
                    requestChangeNumber(window.roomId, rowCol.row, rowCol.column, parseInt(value))
                };
                colorCell(target[j]);
            });

        })(i);
    }
}

// KEYBOARD INPUT

var rowPos = 0;
var colPos = 0;
function changeKeyboardPosition(direction) {

    board.board[rowPos * 9 + colPos].dom.style.backgroundColor = backgroundColor;

    function getNextPos(direction) {
        //left
        if (direction == 37) {
            if (colPos == 0) {
                colPos = 8;
            } else {
                colPos--;
            }
        };
        //right
        if (direction == 39) {
            if (colPos == 8) {
                colPos = 0;
            } else {
                colPos++;
            }
        };
        //up
        if (direction == 38) {
            if (rowPos == 0) {
                rowPos = 8
            } else {
                rowPos--;
            }
        };
        //down
        if (direction == 40) {
            if (rowPos == 8) {
                rowPos = 0
            } else {
                rowPos++;
            }
        };
    }
    getNextPos(direction)

    colorCell(board.board[rowPos * 9 + colPos].dom)
}

function colorCell(cell) {
    if (cell.classList.contains('noDrop')) {
        cell.style.backgroundColor = mainColor;
    } else {
        cell.style.backgroundColor = greenColor;
    }
    window.setTimeout(function () {
        cell.style.backgroundColor = backgroundColor;
    }, 1500);
}

function addKeyboard() {
    document.addEventListener('keydown', function (e) {
        if (37 <= e.keyCode && e.keyCode <= 40) {
            e.preventDefault()
            changeKeyboardPosition(e.keyCode);
        }
    });

    document.addEventListener('keypress', function (e) {
        if (board.board[rowPos * 9 + colPos].dom.classList.contains('noDrop') == false) {
            if (49 <= e.keyCode && e.keyCode <= 57) {
                requestChangeNumber(window.roomId, rowPos, colPos, e.keyCode - 48)
            }
            if (e.keyCode == 48 || e.keyCode == 32) {
                requestChangeNumber(window.roomId, rowPos, colPos, 0)
            }
        }
    });

}
var authToken;

SudokuGame.authToken.then(function setAuthToken(token) {
    if (token) {
        authToken = token;
    } else {
        window.location.href = '/signin.html';
    }
}).catch(function handleTokenError(error) {
    alert(error);
    window.location.href = '/signin.html';
});

//CHANGE NUMBER

function requestChangeNumber(roomId, row, column, value) {
    payload = {
        "action": "changeNumber",
        "message": {
            "roomId": roomId,
            "column": column,
            "row": row,
            "value": value
        }
    };

    window.socket.send(JSON.stringify(payload));
}