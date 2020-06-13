var board;
let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
let greenColor = getComputedStyle(document.documentElement).getPropertyValue('--main-light2-color');
let mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color');

function initGame() {

    board = new Sudoku;
    board.fill(board);

    // ToDo: to be deleted
    board.eraseMost();

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

        // init columns
        (function () {
            that.columns = [];
            for (var j = 0; j < 9; j++) {
                that.columns.push([]);
                that.columns[j].push(that.board[j])
            };
            for (var i = 1; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    that.columns[j].push(that.board[j + i * 9])
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

        this.fill = createExampleSudoku;

        // ToDo to be deleted
        this.eraseMost = function (level) {
            var boardSpot;
            level = 5;
            for (var i = 0; i < 81; i++) {
                boardSpot = that.board[i];
                //resettng from previous round
                if (boardSpot.dom.classList.contains('noDrop')) {
                    boardSpot.dom.classList.remove('noDrop');
                    boardSpot.dom.style.color = 'darkred';
                    //boardSpot.dom.style.fontSize = 'initial';
                }
                ;
                if ((Math.floor(Math.random() * 10) + 1) > level) {
                    boardSpot.val = ' ';
                    //will need a better place in code for this iffy

                }
                else {
                    boardSpot.dom.style.color = 'black';
                    //boardSpot.dom.style.fontSize = '1.2em'
                    boardSpot.dom.classList.add('noDrop');
                }
            }
            ;
            for (var i = 0; i < 81; i++) {
                that.board[i].dom.innerHTML = that.board[i].val;
            }
            ;
        };
    }
}


function createExampleSudoku(board) {

    function fillLine(line_num, nums) {
        line = board.rows[line_num]
        for (var i = 0; i < line.length; i++) {
            line[i].val = nums[i];
        };
    };

    fillLine(0, [5, 8, 1, 4, 7, 2, 9, 6, 3])
    fillLine(1, [2, 7, 3, 6, 1, 9, 5, 4, 8])
    fillLine(2, [6, 4, 9, 5, 3, 8, 7, 1, 2])
    fillLine(3, [9, 5, 6, 1, 8, 7, 3, 2, 4])
    fillLine(4, [4, 2, 8, 3, 9, 5, 6, 7, 1])
    fillLine(5, [3, 1, 7, 2, 6, 4, 8, 5, 9])
    fillLine(6, [8, 6, 4, 9, 5, 1, 2, 3, 7])
    fillLine(7, [7, 3, 2, 8, 4, 6, 1, 9, 5])
    fillLine(8, [1, 9, 5, 7, 2, 3, 4, 8, 6])

    return true;
}

// DOUBLE CLICK TO CLEAR

function addDoubleClick() {
    var target = document.getElementsByClassName('target');
    for (var i = 0; i < target.length; i++) {
        (function (j) {
            target[j].addEventListener('dblclick', function () {
                if (target[j].classList.contains('noDrop') == false) {
                    target[j].innerHTML = ' ';
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
                    target[j].innerHTML = e.dataTransfer.getData('text');
                };
                colorCell(target[j]);
            });

        })(i);
    }
}

// KEYBOARD INPUT

var inputPos = 0;
function changeKeyboardPosition(direction) {

    board.board[inputPos].dom.style.backgroundColor = backgroundColor;

    function getNextPos(direction) {
        //left
        if (direction == 37) {
            if (inputPos % 9 == 0) {
                inputPos += 8;
            } else {
                inputPos--;
            }
        };
        //right
        if (direction == 39) {
            if (inputPos % 9 == 8) {
                inputPos -= 8;
            } else {
                inputPos++;
            }
        };
        //up
        if (direction == 38) {
            if (inputPos < 9) {
                inputPos += 72
            } else {
                inputPos -= 9;
            }
        };
        //down
        if (direction == 40) {
            if (inputPos >= 72) {
                inputPos -= 72
            } else {
                inputPos += 9;
            }
        };
    }
    getNextPos(direction)

    colorCell(board.board[inputPos].dom)
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
        if (49 <= e.keyCode && e.keyCode <= 57) {
            if (board.board[inputPos].dom.classList.contains('noDrop') == false) {
                board.board[inputPos].dom.innerHTML = e.keyCode - 48;
            }
        }
    });

}