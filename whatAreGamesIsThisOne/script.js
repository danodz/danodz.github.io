let gameData;
if(localStorage.getItem("gameData"))
    gameData = JSON.parse(localStorage.getItem("gameData"));
else
    gameData = {
        currentText: 0,
        winCount: 0,
        loseCount: 0,
        meme: true
    };

document.querySelector(".text").innerHTML = texts.reduce((longest, current)=>{
    return longest.length>current.length?longest:current;
}, "");
document.querySelector(".caracteristics .one").classList.remove("hidden");
document.querySelector(".caracteristics .two").classList.remove("hidden");
document.querySelector(".caracteristics .three").classList.remove("hidden");

const textNode = document.querySelector(".text");
let fontSize = parseInt(window.getComputedStyle(textNode).fontSize);
while(hasVerticalScroll() && fontSize>1){
    fontSize -= 1;
    textNode.style.fontSize = fontSize+"px";
}
document.querySelector(".caracteristics .one").classList.add("hidden");
document.querySelector(".caracteristics .two").classList.add("hidden");
document.querySelector(".caracteristics .three").classList.add("hidden");

updateScreen();
function updateScreen(){
    document.querySelector(".loseCount").innerHTML = gameData.loseCount;
    document.querySelector(".winCount").innerHTML = gameData.winCount;
	if(gameData.currentText > 152 && gameData.winCount==69 && gameData.meme){
        gameData.currentText -= 1;
       	document.querySelector(".text").innerHTML = "nice";
		gameData.meme = false;
	} else {
        document.querySelector(".text").innerHTML = texts[gameData.currentText];
        if(gameData.currentText >= 177){
            document.querySelector(".caracteristics .one").classList.remove("hidden");
        }
        if(gameData.currentText >= 178){
            document.querySelector(".caracteristics .two").classList.remove("hidden");
        }
        if(gameData.currentText >= 179){
            document.querySelector(".caracteristics .three").classList.remove("hidden");
        }
        if(gameData.currentText < 177 || gameData.currentText >= 208){
            document.querySelector(".caracteristics").classList.add("hidden");
        }
        if(gameData.currentText >= 177 && gameData.currentText <= 208){
            document.querySelector(".caracteristics").classList.remove("hidden");
        }
    }
}

var winBtn = document.querySelector(".winBtn");
var loseBtn = document.querySelector(".loseBtn");
/*
var btnSize = window.innerWidth>600?200:100;

winBtn.style.borderLeftWidth= btnSize/2+"px";
winBtn.style.borderRightWidth= btnSize/2+"px";
winBtn.style.borderBottomWidth= btnSize+"px";

loseBtn.style.width= btnSize+"px";
loseBtn.style.height= btnSize+"px";
loseBtn.style.marginLeft= btnSize/2+"px";
*/

const winSound = new Audio('res/win.wav');
winBtn.onclick = function(){
	winSound.pause();
	winSound.currentTime = 0;
	winSound.play();
    gameData.winCount += 1;
    nextText();
}

const loseSound = new Audio('res/lose.wav');
loseBtn.onclick = function(){
	loseSound.pause();
	loseSound.currentTime = 0;
	loseSound.play();
    gameData.loseCount += 1;
    nextText();
}

function nextText(){
    if(gameData.currentText < texts.length - 1)
    {
        gameData.currentText += 1;
    }
    updateScreen();
    localStorage.setItem("gameData", JSON.stringify(gameData));
}

function restart(){
	gameData.currentText=0;
	gameData.meme = true;
    gameData.winCount = 0;
    gameData.loseCount = 0;
    document.querySelector(".caracteristics .one").classList.add("hidden");
    document.querySelector(".caracteristics .two").classList.add("hidden");
    document.querySelector(".caracteristics .three").classList.add("hidden");
    document.querySelector(".caracteristics").classList.remove("hidden");
    updateScreen();
    localStorage.setItem("gameData", JSON.stringify(gameData));
}

function hasVerticalScroll(node){
    if(node == undefined){
        if(window.innerHeight){
            return document.body.offsetHeight> window.innerHeight;
        }
        else {
            return  document.documentElement.scrollHeight > 
                document.documentElement.offsetHeight ||
                document.body.scrollHeight>document.body.offsetHeight;
        }
    }
    else {
        return node.scrollHeight> node.offsetHeight;
    }
}

function openHistory(){
    const historyWindow = document.querySelector(".history");
    const historyContent = document.querySelector(".history .content");
    historyWindow.classList.remove("hidden");
    historyContent.innerHTML = "<p>- Press the blue triangle to win. Press the red square to lose.</p>"; 
    for(let i = 1; i<gameData.currentText; i++){
        historyContent.innerHTML += "<p>- " + texts[i] + "</p>";
    }

    historyContent.scrollTo(0,historyContent.scrollHeight);
}

function closeHistory(){
    document.querySelector(".history").classList.add("hidden");
}

document.onkeydown = (e)=>{
    if(e.keyCode == 27){
        closeHistory();
    }
}
