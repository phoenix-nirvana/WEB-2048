var board = new Array();
var score = 0;
var hasConflicted = new Array(); //用来判断每个格子是否已经发生过碰撞，从而避免一下子好几个格子相加;

//新增
var startx = 0; //移动端触摸屏幕时开始点的x坐标
var starty = 0; //移动端触摸屏幕时开始点的y坐标
var endx = 0; //移动端触摸屏幕时结束点的x坐标
var endy = 0; //移动端触摸屏幕时结束点的y坐标



$(document).ready(function() {

    //新增,做自适应处理
    prepareForMobile();

    newGame();
});

function newGame() {
    $('.score').empty();
    //初始化棋盘格
    init();
    //随机在两个格子生成数字
    generateOneNumber();
    generateOneNumber();
};


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
            board[i][j] = 0;
            hasConflicted[i][j] = false;
            var grid_cell = $('#grid_cell_' + i + '_' + j);
            grid_cell.css('top', getPosition(i));
            grid_cell.css('left', getPosition(j));
            //console.log('#grid_cell_' + i + '_' + j);
            //console.log(getPosition(i), getPosition(j));
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
                    'width': '0px',
                    'height': '0px',
                    'top': getPosition(i) + cellSideLength / 2,
                    'left': getPosition(j) + cellSideLength / 2
                };
                theNumberCell.css(numberCellCSS);
                //console.log(getPosition(i), getPosition(j));
            } else {
                var numberCellCSS = {
                    'width': cellSideLength,
                    'height': cellSideLength,
                    'top': getPosition(i),
                    'left': getPosition(j),
                    'background-color': getNumberBackgroundColor(board[i][j]),
                    'color': getNumberColor(board[i][j]),
                    'font-size': getNumberFontSize(board[i][j])
                };
                theNumberCell.css(numberCellCSS);
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
    $('.number_cell').css('line-height', cellSideLength + 'px');
    //console.log("updateBoardView running...");
}


// 随机选一个格子生成一个数字
function generateOneNumber() {
    if (noSpace(board)) {
        return false;
    }
    //随机位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    // 设置一个时间参数，50次以内系统还未生成一个空位置，那么就进行人工找一个空位置
    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }
    //console.log(randx, randy);
    //
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //console.log(randNumber);

    board[randx][randy] = randNumber;

    //在上面找到的随机位置显示该随机数字
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
    //console.log("generateOneNumber running...");
}

//新增 自适应处理
function prepareForMobile() {
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }
    $('#grid_container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid_container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid_container').css('padding', cellSpace);
    $('#grid_container').css('border-radius', 0.02 * gridContainerWidth);
    $('.grid_cell').css('width', cellSideLength);
    $('.grid_cell').css('height', cellSideLength);
    $('.grid_cell').css('border-radius', 0.02 * gridContainerWidth);
}

// 监听键盘的上下左右移动
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



//新增
//touchstart：当手指触摸屏幕时候触发，即使已经有一个手指放在屏幕上也会触发。
//touchmove：当手指在屏幕上滑动的时候连续地触发。在这个事件发生期间，调用preventDefault()事件可以阻止滚动。
//touchend：当手指从屏幕上拿起的时候触发。
//touchcancel：当系统停止（取消）跟踪touch触摸的时候触发。
//
//
//每个触摸事件都包括了三个触摸列表（即用于跟踪触摸的属性），每个列表里包含了对应的一系列触摸点（用来实现多点触控）：
//touches：当前位于屏幕上的所有手指的一个列表（表示当前跟踪的触摸操作的touch对象的数组）
//targetTouches：位于当前DOM元素上的手指的一个列表（特定于事件目标的Touch对象的数组）
//changeTouches：涉及当前事件的手指的一个列表（表示自上次触摸以来发生了什么改变的Touch对象的数组）
//
//
//监听移动设备的触摸开始
document.addEventListener('touchstart', function(event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

//监听移动设备的触摸移动
document.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

//监听移动设备的触摸结束
document.addEventListener('touchend', function(event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    if (Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth) {
        return;
    }

    if (Math.abs(deltax) >= Math.abs(deltay)) {
        if (deltax > 0) {
            //move right
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
        } else {
            //move left
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
        }
    } else { //y
        if (deltay > 0) {
            //move down
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
        } else {
            //move up
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
        }
    }
});

// 向左移动
function moveLeft() {

    // 1、首先，判断能否向左移动
    if (!canMoveLeft(board))
        return false;

    /*2、如果可以向左移动：
     *   ①当前的数字是否为0，不为0则进行左移 board[i][j] != 0
     *   ②如果左侧为空格子，则数字进行一个移位操作 board[i][k] == 0
     *   ③如果左侧有数字且不相等，则数字还是进行移位操作 noBlockHorizontal
     *   ④如果左侧有数字且相等，则数字进行相加操作 board[i][k] == board[i][j]
     */
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    // 3、初始化数据 updateBoardView()
    // 为显示动画效果，设置该函数的等待时间200毫秒
    setTimeout("updateBoardView()", 200);
    return true;
}

// 向上移动
function moveUp() {
    if (!canMoveUp(board))
        return false;
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

// 向右移动
function moveRight() {
    if (!canMoveRight(board))
        return false;

    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

// 向下移动
function moveDown() {
    if (!canMoveDown(board))
        return false;
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

//判断游戏是否结束
function isGameOver() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 2048) {
                gameSucess();
                return;
            }
        }
    }
    if (noSpace(board) && noMove(board)) {
        gameOver();
    }
}


