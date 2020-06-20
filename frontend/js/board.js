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
                fillLine(i, initNumbers[i])

            for (var i = 0; i < 81; i++) {
                that.board[i].dom.innerHTML = that.board[i].val;
            }
        }
    }
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
                    smallRow = parseInt((j % 9) / 3)
                    smallCol = j%3
                    bigRow = parseInt(j/27)
                    bigCol = parseInt(j/9)%3
                    row = bigRow*3 + smallRow
                    column = bigCol*3+ smallCol
                    // target[j].innerHTML = e.dataTransfer.getData('text');
                    value = e.dataTransfer.getData('text');
                    requestChangeNumber(window.roomId, row, column, parseInt(value))
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
var authToken;

WildRydes.authToken.then(function setAuthToken(token) {
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

function requestChangeNumber(roomId, row ,column, value) {
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl + '/change-number',
        headers: {
            Authorization: authToken
        },
        data: JSON.stringify({
            roomId: roomId,
            column: column,
            row: row,
            value: value
        }),
        contentType: 'application/json',
        success: completeChangeNumberRequest,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR.responseText);
            alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
        }
    });
}

function completeChangeNumberRequest(result) {
    console.log('Response received from API: ', result);
    
}