let cardIndex = 0;
let cards = player.deck.filter((card)=>{
    return card.nextReview <= today && card.level < 7;
});
let questionNode;
let answerNode;
let revealBtn;
let failBtn;
let successBtn;

let nextQuestion = ()=>{
    if(cards.length == 0){
        document.querySelector(".done").classList.remove("hidden");
        document.querySelector(".questionCard").classList.add("hidden");
        if(searchParams.has("day")){
            let tomorowLink = document.querySelector(".tomorrowLink");
            if(steps.length > day+1){
                tomorowLink.href = steps[day+1] + "?day=" + (day+1);
            } else {
                tomorowLink.href = "/play.html?day=" + (day+1);
            }
            tomorowLink.classList.remove("hidden");
        }
    } else {
    questionNode.innerHTML = cards[cardIndex].question;
    answerNode.innerHTML = cards[cardIndex].answer;

    answerNode.classList.add("invisible");
    revealBtn.classList.remove("hidden");
    failBtn.classList.add("hidden");
    successBtn.classList.add("hidden");
    }
}

let reveal = ()=>{
    answerNode.classList.remove("invisible");
    revealBtn.classList.add("hidden");
    failBtn.classList.remove("hidden");
    successBtn.classList.remove("hidden");
}

let fail = ()=>{
    let card = cards[cardIndex];
    card.level = 0;

    cardIndex += 1;
    if(cardIndex > cards.length-1){
        cardIndex = 0;
    }
    nextQuestion();
}

let success = ()=>{
    let card = cards[cardIndex];
    card.nextReview = new Date(today).setHours(0,0,0,0) + oneDay * levels[card.level];
    card.level += 1;
    cards.splice(cardIndex,1);
    savePlayer();
    if(cardIndex > cards.length-1){
        cardIndex = 0;
    }
    nextQuestion();
}

document.addEventListener("DOMContentLoaded", () => {
    questionNode = document.querySelector(".question");
    answerNode = document.querySelector(".answer");
    revealBtn = document.querySelector(".reveal");
    failBtn = document.querySelector(".fail");
    successBtn = document.querySelector(".success");
    nextQuestion();
});