let player1 = {
    name: "player1",
};

let player2 = {
    name: "player2",
};

player1.enemy = player2;
player2.enemy = player1;

currentPlayer = player1;

let gameState = "setup";

let gameStatusTxt;
let connectionStatusTxt;
let socket={emit:(a,b)=>{},on:(a,b)=>{}}

let transitionScreen;
let inputBlock;
function changePlayer(){
    inputBlock.classList.remove("hidden");
    setTimeout(()=>{
        inputBlock.classList.add("hidden");
        transitionScreen.classList.remove("hidden");
        currentPlayer.grids.classList.add("hidden");
        currentPlayer.enemy.grids.classList.remove("hidden");
        currentPlayer = currentPlayer.enemy;
    }, 1000);
}

function gridUpdate(grid, x, y, value){
    document.querySelector(".moveFeedback .missTxt").style.display="none";
    document.querySelector(".moveFeedback .hitTxt").style.display="none";
    document.querySelector(".moveFeedback .hitTxt .mermaid").style.display="none";
    document.querySelector(".moveFeedback .hitTxt .crab").style.display="none";

    if(value == "boat")
    {
        grid[x][y].style.background = "red";

        tempDisplay(document.querySelector(".moveFeedback .hitTxt"));
    }
    else if(value == "mermaid" || value == "crab")
    {
        grid[x][y].style.background = "red";
        fadeIn(grid[x][y].querySelector("."+value))

        tempDisplay(document.querySelector(".moveFeedback .hitTxt"));
        fadeIn(document.querySelector(".moveFeedback .hitTxt ." + value));
    }
    else if(value == "empty")
    {
        grid[x][y].style.background = "blue";

        tempDisplay(document.querySelector(".moveFeedback .missTxt"));
    }
}

let displaying;
let timeout;
function tempDisplay(e){
    if(displaying){
        displaying.style.display = "none";
        clearTimeout(timeout);
    }
    e.style.display="block";
    displaying = e;
    timeout = setTimeout(()=>{
        e.style.display = "none";
    }, 5000);
}

function fadeIn(e){
    e.style.display="block";
    e.style.opacity=0;
    setTimeout(()=>{
        let opacity = 0;
        let interval = setInterval(()=>{
            e.style.opacity=opacity;
            opacity += 0.01;
            if(opacity >= 1){
                clearInterval(interval);
            }
        }, 50);
    }, 1000);
}

function sendMove(e){
    let pos = e.currentTarget.dataset.position.split(",");
    let x = parseInt(pos[0]);
    let y = parseInt(pos[1]);
    let tile = currentPlayer.enemy.board[x][y]
    if(tile.played)
        return;
    tile.played = true;
    let data = {
        x: x,
        y: y,
        value: tile.type
    };
    gridUpdate(currentPlayer.enemyGrid, data.x, data.y, data.value)
    gridUpdate(currentPlayer.enemy.playerGrid, data.x, data.y, data.value)

    let won = currentPlayer.enemy.board.every(function(row) {
        return row.every(function(tile){
            return tile.type != "boat" || tile.played;
        })
    })
    if(won){
        const node = document.querySelector(".gameOver");
        node.classList.remove("hidden");
        node.innerText = currentPlayer.name + " Won!";

        document.querySelectorAll(".grids").forEach((e)=>e.classList.remove("hidden"));
        document.querySelectorAll(".enemyGrid").forEach((e)=>e.classList.add("hidden"));
    } else {
        changePlayer();
    }
}

function init(){
    initPlayer(player1);
    initPlayer(player2);
    gameStatusTxt = document.querySelector(".gameStatus");
    connectionStatusTxt = document.querySelector(".connectionStatus");

    transitionScreen = document.querySelector(".transition");
    inputBlock = document.querySelector(".inputBlock");
    transitionScreen.onclick = (e)=>{ e.currentTarget.classList.add("hidden") }
}

function initPlayer(player){
    player.grids = document.querySelector(".grids."+player.name)
    player.playerGrid = makeGrid(player.grids.querySelector(".playerGrid"), changeTile);
    player.enemyGrid = makeGrid(player.grids.querySelector(".enemyGrid"), sendMove);
}

function makeGrid(root, clickFn){
    let grid = [];
    for(let i=0; i<10; i++){
        grid[i] = [];
        let row = document.createElement("div");
        row.className = "row";
        for(let j=0; j<10; j++){
            let item = document.createElement("div");
            grid[i][j] = item
            item.className = "gridItem";
            item.dataset.position = [i,j]
            item.dataset.contains = "empty";
            item.onclick = clickFn

            let mermaid = document.createElement("div");
            mermaid.className = "decoy mermaid";
            mermaid.innerText = "S";
            item.appendChild(mermaid);

            let crab = document.createElement("div");
            crab.className = "decoy crab";
            crab.innerText = "C";
            item.appendChild(crab);

            row.appendChild(item);
        }
        root.appendChild(row);
    }
    return grid;
}

function changeTile(e){
    if(gameState != "setup")
        return;

    if(e.currentTarget.dataset.contains == "empty")
    {
        e.currentTarget.dataset.contains = "boat";
        e.currentTarget.classList.add("boat");
    }
    else if(e.currentTarget.dataset.contains == "boat")
    {
        e.currentTarget.dataset.contains = "mermaid";
        e.currentTarget.classList.remove("boat");
        e.currentTarget.querySelector(".mermaid").style.display = "block"
    }
    else if(e.currentTarget.dataset.contains == "mermaid")
    {
        e.currentTarget.dataset.contains = "crab";
        e.currentTarget.querySelector(".mermaid").style.display = "none"
        e.currentTarget.querySelector(".crab").style.display = "block"
    }
    else
    {
        e.currentTarget.dataset.contains = "empty";
        e.currentTarget.querySelector(".crab").style.display = "none"
    }
}

function setupDone(){
    if(gameState != "setup")
        return;

    let board = [];
    let playerGrid = currentPlayer.playerGrid;
    for(let i=0; i<playerGrid.length; i++){
        board[i] = [];
        for(let j=0; j<playerGrid[i].length; j++){
            board[i][j] = {type: playerGrid[i][j].dataset.contains, played:false}
        }
    }

    var boardIsValid = true;
    var boatLength = 0;

    function validateTile(i,j){
        function validate(x,y){
            if(board[x] && board[x][y]){
                if(board[x][y].type == "boat" && !board[x][y].valid){
                    validateTile(x, y);
                }
            }
        }
        board[i][j].valid = true;
        boatLength += 1;
        validate(i-1,j);
        validate(i+1,j);
        validate(i,j+1);
        validate(i,j-1);
    }

    let toBreak = false;
    for(var i=0; i<board.length; i++)
    {
        for(var j=0; j<board[i].length; j++)
        {
            console.log(board[i][j]);
            if(board[i][j].type == "boat"){
                validateTile(i,j);
                if(!board.every(function(row){
                    return row.every(function(tile){
                        return tile.type != "boat" || tile.valid;
                    });
                })){
                    boardIsValid = false;
                }
                toBreak = true;
                break;
            }
        }
        if(toBreak) break;
    }

    if(boardIsValid && boatLength >= 2 && boatLength <= 10)
    {
        currentPlayer.board = board;
        if(currentPlayer.name === "player1")
        {
            currentPlayer.grids.querySelector(".playerGrid").classList.add("locked");
            document.querySelector(".boardError").classList.add("hidden");

            changePlayer();
        } else {
            gameState = "playing"
            currentPlayer.grids.querySelector(".playerGrid").classList.add("locked");
            document.querySelector(".boardError").classList.add("hidden");
            document.querySelector(".ready").classList.add("hidden");

            changePlayer();
        }
    }
    else
    {
        document.querySelector(".boardError").classList.remove("hidden");
    }
}

function reset(){
    location.reload();
}

socket.on("reset",function(){
    document.querySelector(".playerGrid").innerHTML = "";
    document.querySelector(".enemyGrid").innerHTML = "";
    document.querySelector(".playerGrid").classList.remove("locked");
    document.querySelector(".ready").classList.remove("hidden");
    document.querySelector(".gameOver").classList.add("hidden");
    init();
});
