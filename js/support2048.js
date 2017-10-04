<<<<<<< HEAD
//新增
=======
//新赠
>>>>>>> e5034614d5abbe0bb75fca91790f01ba2d70018a
documentWidth = window.screen.availWidth; //屏幕宽度
gridContainerWidth = 0.92 * documentWidth; //期盘宽度
cellSideLength = 0.18 * documentWidth; //格子的大小
cellSpace = 0.04 * documentWidth; //格子之间的间隔


//获取每个单元格的坐标
function getPosition(index) {
<<<<<<< HEAD
  return cellSpace + index * (cellSpace + cellSideLength);
=======
    return cellSpace + index * (cellSpace + cellSideLength);
>>>>>>> e5034614d5abbe0bb75fca91790f01ba2d70018a
}

// 设置不同数字的不同背景颜色
function getNumberBackgroundColor(number) {
  switch (number) {
    case 2:
      return "#eee4da";
    case 4:
      return "#ede0c8";
    case 8:
      return "#f2b179";
    case 16:
      return "#f59563";
    case 32:
      return "#f67c5f";
    case 64:
      return "#f65e3b";
    case 128:
      return "#edcf72";
    case 256:
      return "#edcc61";
    case 512:
      return "#9c0";
    case 1024:
      return "#33b5e5";
    case 2048:
      return "#09c";
    case 4096:
      return "#a6c";
    case 8192:
      return '#93c';
  }
  return "black";
}

// 设置数字的颜色：2和4的颜色都为#776e65，其它数字的颜色为白色
function getNumberColor(number) {
<<<<<<< HEAD
  if (number <= 4) {
    return "#776e65";
  }
  return "white";
=======
    if (number <= 4){
        return "#776e65";
    }
    return "white";
>>>>>>> e5034614d5abbe0bb75fca91790f01ba2d70018a
}

//设置数字字体大小:2和4为60px,其他为40px
function getNumberFontSize(number) {
<<<<<<< HEAD
  if (number <= 512) {
    return 0.6 * cellSideLength;
  }
  return 0.4 * cellSideLength;
=======
    if (number <= 512){
        return 0.6 * cellSideLength;
    }
    return 0.4 * cellSideLength;
>>>>>>> e5034614d5abbe0bb75fca91790f01ba2d70018a
}

// 判断棋盘是否还有空格子
function noSpace(board) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
}

/* 判断能否向左移动
 * 1、只需要判断每一行的后3列格子即可。
 * 2、可以移动的条件是：
 *   ①当前格子有数字，即 board[i][j] != 0
 *   ②左侧格子没有数字，即 (board[i][j - 1] == 0
 *   或者左侧格子和当前格子数字相同，即 board[i][j - 1] == board[i][j]
 */
function canMoveLeft(board) {
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

//判断是否能向右、向上、向下移动
function canMoveRight(board) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] != 0) {
        if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

function canMoveUp(board) {
  for (var j = 0; j < 4; j++) {
    for (var i = 1; i < 4; i++) {
      if (board[i][j] != 0) {
        if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

function canMoveDown(board) {
  for (var j = 0; j < 4; j++) {
    for (var i = 0; i < 3; i++) {
      if (board[i][j] != 0) {
        if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

// 判断水平方向的两个目标格子之间有没有其他数字
function noBlockHorizontal(row, col1, col2, board) {
<<<<<<< HEAD
  for (var i = col1 + 1; i < col2; i++)
    if (board[row][i] != 0) {
      return false; // 如果在这两者之间的其它格子有数字，返回false
    }
  return true; // 如果两者之间没数字，返回true
=======
    for (var i = col1 + 1; i < col2; i++)
        if (board[row][i] != 0){
            return false; // 如果在这两者之间的其它格子有数字，返回false
        }
    return true; // 如果两者之间没数字，返回true
>>>>>>> e5034614d5abbe0bb75fca91790f01ba2d70018a
}

// 判断垂直方向的两个目标格子之间没有其他数字
function noBlockVertical(col, row1, row2, board) {
<<<<<<< HEAD
  for (var i = row1 + 1; i < row2; i++)
    if (board[i][col] != 0) {
      return false; // 如果在这两者之间的其它格子有数字，返回false
    }
  return true; // 如果两者之间没数字，返回true
=======
    for (var i = row1 + 1; i < row2; i++)
        if (board[i][col] != 0){
            return false; // 如果在这两者之间的其它格子有数字，返回false
        }
    return true; // 如果两者之间没数字，返回true
>>>>>>> e5034614d5abbe0bb75fca91790f01ba2d70018a
}

//判断4个方向是否还能移动
function noMove(board) {
<<<<<<< HEAD
  if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)) {
    return false;
  }
  return true;
}

//新增
//游戏成功
function gameSucess() {
  $('.score').html('<p style="color: green;">Sucess</p>');
=======
    if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)){
        return false;
    }
    return true;
>>>>>>> e5034614d5abbe0bb75fca91790f01ba2d70018a
}

//新增
//游戏成功
function gameSucess(){
    $('.score').html('<p style="color: green;">Sucess</p>');
}

//游戏结束
function gameOver() {
<<<<<<< HEAD
  $('.score').html('<p style="color: red;">Game Over</p>');
}
=======
    $('.score').html('<p style="color: red;">Game Over</p>');
}
>>>>>>> e5034614d5abbe0bb75fca91790f01ba2d70018a
