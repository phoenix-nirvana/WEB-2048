var board = new Array();
var score = 0;
var hasConflicted = new Array(); //用来判断每个格子是否已经发生过碰撞，从而避免一下子好几个格子相加;
$(document).ready(function() {
    newGame();
});

function newGame() {
    $('.score').empty();
    //初始化棋盘格
    init();
    //随机在两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

/*
 *  1、初始化棋盘格 gridCell
 *  2、初始化二维数组 用于存储数据 board
 *  3、初始化数据 清零 updateBoardView();
 */
function init() {
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid_cell_' + i + '_' + j);
            // var x={
            // 	'top': getPosition(i),
            // 	'left': getPosition(j)
            // }
            // gridCell.css(x);
            gridCell.css({ 'top': getPosition(i), 'left': getPosition(j) });
            //console.log('#grid_cell_' + i + '_' + j);
            //console.log(getPosition(i), getPosition(j));
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();
    score = 0;
    updateScore(score);
}

// 初始化数据,将数据可视化,根据board[i][j]存的数值来画图
function updateBoardView() {
    $('.number_cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid_container').append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>');
            var theNumberCell = $('#number_cell_' + i + '_' + j);
            if (board[i][j] == 0) {
                var numberCellCSS = {
                    "width": '0px',
                    "height": '0px',
                    "top": getPosition(i) + 50,
                    "left": getPosition(j) + 50
                }
                //console.log(getPosition(i), getPosition(j));
                theNumberCell.css(numberCellCSS);
            } else {
                var numberCellCSS = {
                    "width": "100px",
                    "height": "100px",
                    "top": getPosition(i),
                    "left": getPosition(j),
                    "background-color": getNumberBackgroundColor(board[i][j]),
                    "color": getNumberColor(board[i][j]),
                    'font-size': getNumberFontSize(board[i][j])
                }
                theNumberCell.css(numberCellCSS);
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
    //console.log("updateBoardView running...");
}

// 随机选一个格子生成一个数字
function generateOneNumber() {
    if (noSpace(board))
        return false;
    //随机位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    // 设置一个时间参数，50次以内系统还未生成一个空位置，那么就进行人工找一个空位置
    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0)
            break;

        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));

        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
    }

    //console.log(randx, randy);
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //console.log(randNumber);
    board[randx][randy] = randNumber;
    //在上面找到的随机位置显示该随机数字
    showNumberWithAnimation(randx, randy, randNumber);
    //console.log("generateOneNumber running...");
}

// 判断键盘的响应时间 上下左右
$(document).keydown(function(event) {
    event.preventDefault();
    switch (event.keyCode) {
        case 37: // left 向左移动
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            };
            break;
        case 38: // up 向上移动
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            };
            break;
        case 39: // right 向右移动
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            };
            break;
        case 40: // down 向下移动
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            };
            break;
        default: // default
            break;
    }
});

function moveLeft() {
    //1.先判断能否向左移动
    if (!canMoveLeft(board))
        return false;

    /*2.如果可以向左移动：
     *   ①当前的数字是否为0，不为0则进行左移 board[i][j] != 0
     *   ②如果左侧为空格子，则数字进行一个移位操作 board[i][k] == 0
     *   ③如果左侧有数字且不相等，则数字还是进行移位操作 noBlockHorizontal
     *   ④如果左侧有数字且相等，则数字进行相加操作
     */
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k); //移动
                        board[i][k] += board[i][j]; //相加
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score); //更新分数
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    // 3、初始化数据 updateBoardView()
    // 为显示动画效果，设置该函数的等待时间200ms
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board))
        return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k); //移动
                        board[i][k] += board[i][j]; //相加
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score); //更新分数
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board))
        return false;
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockHorizontal(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j); //移动
                        board[k][j] += board[i][j]; //相加
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score); //更新分数
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board))
        return false;
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockHorizontal(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j); //移动
                        board[k][j] += board[i][j]; //相加
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score); //更新分数
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

//判断游戏是否结束
function isGameOver() {
    if (noSpace(board) && noMove(board)) {
        gameOver();
    }
}