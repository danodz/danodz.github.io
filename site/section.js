let proceed = ()=>{
    let questions = document.querySelectorAll(".questions .question");
    questions.forEach((question)=>{
        let q = question.querySelector(".q");
        let a = question.querySelector(".a");

        player.deck.push({
            question: q.value,
            answer: a.value,
            level: 1,
            nextReview: new Date(today).setHours(0, 0, 0, 0)
        });
    });
    
    player.progress.nextStepTime = new Date(today).setHours(0, 0, 0, 0) + oneDay;
    player.progress.step += 1;
    
    savePlayer();
    if(searchParams.has("day")){
        location.href = "/play.html?day="+day;
    } else {
        location.href = "/play.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let questions = document.querySelector(".questions");
    suggestions.forEach((suggestion)=>{
        let question = document.createElement("div");
        question.classList.add("question");
        let q = document.createElement("input");
        q.classList.add("q");
        q.value = suggestion.q;
        let a = document.createElement("input");
        a.classList.add("a");
        a.value = suggestion.a;
        
        question.appendChild(q);
        question.appendChild(a);
        questions.appendChild(question);
    })
});