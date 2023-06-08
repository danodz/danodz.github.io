const init = ()=>{
    const itemTemplate = document.getElementById("item").content; 

    const items = [{
            name: "Pi Day",
            description: "A game made for pi day, the 14th of march. There's a bonus if you play on pi day.<br>Will you be congratulated?",
            folder: "piDay",
            repo: "piDay"
        },{
            name: "Fun with numbers (not math)",
            description: "There is a number on your screen, things will happen with it. Maybe other things will happen in the game, who knows.",
            folder: "numbers",
            repo: "funNumbers"
        },{
            name: "One Ship Battleship",
            description: "It's battleship, but you only have one ship.",
            folder: "oneShipBattleship",
            repo: "oneShipBattleshipLocal"
        },{
			name: "Slider Game",
			description: "An experiment on how to make a hardcore adventure game with a simple slider.",
			folder: "sliderGame",
			repo: "sliderGame"
		},{
			name: "Word Battle",
			description: "A competitive game in which players try to be the first to type a word assigned to them - both using the same keyboard! Chaos, rivalry and laughter guaranteed.",
			folder: "wordBattle",
			repo: "wordBattle"
		},{
			name: "Kill Monsters, Escape Room",
			description: "A comedic adventure game where you have to escape a room swamped by monsters. You manually input how many monsters you want to kill.",
			folder: "killMonstersEscapeRoom",
			repo: "killMonstersEscapeRoom"
		},{
			name: "Triangle Or Square",
			description: "An attempt to get games down to their simplest form. Press on the triangle to win; press on the square at your own risks...",
			folder: "triangleOrSquare",
			repo: "triangleOrSquare"
		},{
			name: "1 to 100",
			description: "An absurd pointless game where each player chooses a number from 1 to 100. The person with the highest number wins. Nothing prevents two players from choosing the same number.",
			folder: "1to100",
			repo: "1to100"
		},{
			name: "Shitpost Generator",
			description: 'Generating funny sentences, mostly: bold takes, empty takes, non-sensical "truths", and so on.',
			folder: "shitpost",
			repo: "https://github.com/Raphaell-Maiwen/Raphaell-Maiwen.github.io"
		}
    ]

    items.forEach((item)=>{
        const root = itemTemplate.cloneNode(true);
        root.querySelector(".name").innerHTML = item.name;
        root.querySelector(".description").innerHTML = item.description;
        root.querySelector(".thumbnail").src = item.folder + "/thumbnail.png";
        root.querySelector(".tryIt").href = item.folder + "/index.html";
        if(item.repo.includes("https://")){
            root.querySelector(".github").href = item.repo;
        } else {
            root.querySelector(".github").href = "https://github.com/danodz/"+item.repo;
        }
        document.body.appendChild(root);
    })
}
