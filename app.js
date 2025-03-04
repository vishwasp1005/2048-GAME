var board;
var score = 0;
var tempScore = 0;
var soundPlayed = false;
var isFirstTime = true;
var firstMoveMade = false;
var best = 0;
var rows = 4;
var cols = 4;
best = parseInt(best);
document.getElementById("best").innerHTML = best;
const beatBest = new Audio('./ringtone-193209.mp3');
beatBest.volume= 0.5;

// document.addEventListener('touchstart', function() {
//     beatBest.play().then(() => beatBest.pause()).catch(error => console.log('Audio play failed:', error));
// }, { once: true });

window.onload = function(){
    setGame();
}

function setGame(){
    // board= [
    //     [2,4,8,16],
    //     [16,8,4,2],
    //     [2,4,8,16],
    //     [2,8,4,2]
    // ]

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
   

    for(i = 0; i<rows; i++){
        for(j=0; j<cols; j++){
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            let num = board[i][j];
            updateTile(tile,num);
            document.getElementById("board").append(tile);
        }
    }
    genTwo();
    genTwo();
}

function renderBoard() {
    let boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            updateTile(tile, board[r][c]);
            boardElement.appendChild(tile);
        }
    }
}

function hasEmptyTile(){
    for(let r = 0; r<rows; r++){
        for(let c = 0; c<cols; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }
}

function genTwo(){

    if(!hasEmptyTile()){
        return;
    }
    let found = false;
    
    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString()+ "-" +c.toString());
            tile.innerText = "2";
            tile.classList.add("t2");
            found = true;
        }
    }
}

function updateTile(tile, num){
    tile.innerHTML = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if(num > 0){
        tile.innerHTML = num;
        if(num <= 1024){
            tile.classList.add("t"+num.toString());
        }
        else{
            tile.classList.add("t2048");
        }
    }
    if (num == 2048) {
        youWon();
    }
}


function canMove() {
    
    if (hasEmptyTile()) return true;

   
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let current = board[r][c];
            if (c < cols - 1 && current == board[r][c + 1]) return true; 
            if (r < rows - 1 && current == board[r + 1][c]) return true;
        }
    }
    return false;
}

document.addEventListener("keyup", (e) => {
    if (!firstMoveMade) firstMoveMade = true;

    if(e.code == "ArrowLeft"){
        slideLeft();
        genTwo();
    }
    if(e.code == "ArrowRight"){
        slideRight();
        genTwo();
    }
    if(e.code == "ArrowUp"){
        slideUp();
        genTwo();
    }
    if(e.code == "ArrowDown"){
        slideDown();
        genTwo();
    }
    document.getElementById("score").innerHTML = score;
    document.getElementById("best").innerHTML = best;

    if (!canMove()) {
        // document.getElementById("game-over-container").style.display = "flex";
        // document.getElementById("final-score").innerText = score;
        // document.getElementById("board").classList.add("blur");
        showGameOverMessage();
    }
});


//left move karva mate
function slideLeft(){
    for(let r = 0; r<rows; r++){
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for(let c = 0; c<cols; c++){
            let tile = document.getElementById(r.toString()+ "-" +c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

function removeZeros(row){
    return row.filter(num =>  num!=0);
}

function slide(row){
    row = removeZeros(row);

    for(i = 0; i<row.length-1; i++){
        if(row[i] == row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
            if(score > best){
                best += row[i];
            }
            if (best > tempScore && !soundPlayed && !isFirstTime && firstMoveMade) { 
                soundPlayed = true; 
                beatBest.play().catch(error => console.log('Audio play failed:', error));
                document.getElementById('msg').innerHTML = "You beat highest score!";
                setTimeout(() => {
                    document.getElementById('msg').innerHTML = "";
                }, 3000);
            }
        }
    }

    row = removeZeros(row);

    while (row.length < cols) {
        row.push(0);
    }

    return row;
}


//right move karva mate
function slideRight(){
    for(let r = 0; r<rows; r++){
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        

        for(let c = 0; c<cols; c++){
            let tile = document.getElementById(r.toString()+ "-" +c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}


//up move karva mate
function slideUp(){
    for(let c = 0; c< cols; c++){
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3]; 

        for(let r = 0; r<rows; r++){
            let tile = document.getElementById(r.toString()+ "-" +c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}


//down slide karva mate
function slideDown(){
    for(let c = 0; c< cols; c++){
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3]; 

        for(let r = 0; r<rows; r++){
            let tile = document.getElementById(r.toString()+ "-" +c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}


function showGameOverMessage() {
    document.body.classList.add('blur-background');
    
    Swal.fire({
        title: 'Game Over!',
        html: `<p>Your score is: <strong>${score}</strong></p>`,
        showCloseButton: false,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Play Again',
        cancelButtonText: 'Close',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        backdrop: 'rgba(0,0,0,0.4)',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            soundPlayed = false;
            isFirstTime = false;
            resetGame();
        }
        document.body.classList.remove('blur-background');
    });
}

function resetGame() {
    tempScore = score;
    soundPlayed = false;
    isFirstTime = false;
    score = 0;
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    document.body.classList.remove('blur-background');
    document.getElementById("score").innerHTML = score;
    document.getElementById("best").innerHTML = best;

    renderBoard();
    genTwo();
    genTwo();
}


let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const SWIPE_THRESHOLD = 40;

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
}

function handleSwipe() {
    if (!firstMoveMade) firstMoveMade = true;

    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            
            if (deltaX > 0) {
                slideRight();
            } else {
                slideLeft();
            }
        } else {
            if (deltaY > 0) {
                slideDown();
            } else {
                slideUp();
            }
        }
        
        genTwo();
        document.getElementById("score").innerHTML = score;
        document.getElementById("best").innerHTML = best;
        
        if (!canMove()) {
            showGameOverMessage();
        }
    }
    
    touchStartX = touchStartY = touchEndX = touchEndY = 0;
}

let reset = document.getElementById("reset");

reset.addEventListener("click", ()=>{
    Swal.fire({
        title: "Are you sure?",
        text: "Your score will start from 0 again!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Reset it!"
      }).then((result) => {
        if (result.isConfirmed) {
          resetGame();
        }
      });
});


function youWon(){
    confetti.start();
    document.body.classList.add('blur-background');
    const winAudio = new Audio('./win.mp3');
    winAudio.play();
    Swal.fire({
        title: "Hurray!",
        html: `You won🎉🎉🎉 You reached 2048! <br> Your Score is ${score}`,
        imageUrl: "./image_processing20200509-30357-1ndo5eg.gif",
        imageWidth: 300,
        imageHeight: 200,
        imageAlt: "Custom image"
      }).then((result) => {
        if (result.isConfirmed) {
            confetti.stop();
            document.body.classList.remove('blur-background');
            resetGame();
        }
      });  
}
