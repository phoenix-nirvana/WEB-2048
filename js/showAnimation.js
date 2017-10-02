/* 显示数字的动画：
 * 在 x=i,y=j 的位置上 显示数字 该数字的值 = randNumber
 * 在这个显示过程中 设置了一个50毫秒的动画效果
 */
function showNumberWithAnimation(i, j, number) {
    var numberCell = $('#number_cell_' + i + '_' + j);
    numberCell.css({ 'background-color': getNumberBackgroundColor(number), 'color': getNumberColor(number), 'font-size': getNumberFontSize(number) });
    numberCell.text(number);
    numberCell.animate({
        width: "100px",
        height: "100px",
        top: getPosition(i),
        left: getPosition(j)
    }, 50);
    //console.log("showNumberWithAnimation running...");
}

/* 移动数字的动画：
 * 从 x=fromx,y=fromy 的位置 移动到  x=tox,y=toy 的位置
 * 在这个显示过程中 设置了一个200毫秒的动画效果
 */
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number_cell_' + fromx + '_' + fromy);
    numberCell.animate({
        top: getPosition(tox),
        left: getPosition(toy)
    }, 200);
}

// 分数刷新显示，此处未设置动画
function updateScore(score) {
    $('#score').text(score);
}