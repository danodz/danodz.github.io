let root = "/FPE2150_MicroEnseignement";
let searchParams = new URLSearchParams(document.location.search);
let today = new Date().getTime();
let day;
let oneDay = 24*60*60*1000;
if(searchParams.has("day")){
    day = parseInt(searchParams.get("day"));
    today += oneDay * day;
}

let steps = [
    "semaine1/section1.html",
    "semaine1/section2.html",
    "semaine1/section3.html",
    "semaine1/section4.html",
    "play.html",
]

let levels = [1, 2, 4, 8, 16, 32, 64];

let player = {
    progress: {
        nextStepTime: 0,
        step: 0
    },
    lastPlay: 0,
    deck: [],
}
if(localStorage.getItem("tempPlayer") && searchParams.has("day")){
    if(!searchParams.has("reset")){
        player = JSON.parse(localStorage.getItem("tempPlayer"))
    }
} else if(localStorage.getItem("player")) {
    player = JSON.parse(localStorage.getItem("player"))
}

let savePlayer = ()=>{
    if(searchParams.has("day")){
        localStorage.setItem("tempPlayer", JSON.stringify(player));
    } else {
        localStorage.setItem("player", JSON.stringify(player));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let playHref;
    if(localStorage.getItem("player")){
        let p = JSON.parse(localStorage.getItem("player"));
        if(p.progress.nextStepTime < new Date().getTime() && steps.length > p.progress.step){
            playHref = steps[player.progress.step];        
        } else {
            playHref = "play.html"
        }
    } else {
        playHref = "semaine1/section1.html"
    }

    document.querySelector(".navigation").innerHTML = `
            <a class="${location.pathname=="/index.html"?"active":""}" href="${root}index.html">Accueil</a>
            <a class="${!searchParams.has("day") && location.pathname!="/index.html"?"active":""}" href="${root}${playHref}">Révision du jour</a>
            <a class="${searchParams.has("day")?"active":""}" href="${root}semaine1/section1.html?day=${0}&reset">Contenu en rafale</a>`
});