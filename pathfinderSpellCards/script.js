const init = ()=>{
    const cardTemplate = document.getElementById("card");
    const makeCard = (name, details)=>{
        const node = cardTemplate.content.firstElementChild.cloneNode(true);
        node.querySelector(".name").innerHTML += name;
        for(key in details){
            const value = details[key];
            node.querySelector("."+key).innerHTML += value;
        }
        return node;
    }

    let recurseSafe = 0;
    const splitCard = (spell, cards)=>{
        const card = makeCard(spell.name + (cards.length > 0 ? " Part " + (recurseSafe+1) : ""), spell.details)
        cards.push(card);
        document.body.append(card);
        if(card.scrollHeight - card.clientHeight <= 0){
            document.body.removeChild(card);
            recurseSafe = 0;
            return cards;
        }

        let splitDescription = [];
        const tables = spell.details.description.split("<table").forEach((str)=>{
            if(str.indexOf("</table>") !== -1){
                splitDescription.push({splitStr: "<table", text: str.split("</table>")[0]+"</table>"});
                str.split("</table>")[1].split(". ").forEach((sentence)=>{
                    splitDescription.push({splitStr:". ", text: sentence});
                });
            }
            else{
                str.split(". ").forEach((sentence)=>{
                    splitDescription.push({splitStr:". ", text: sentence});
                });
            }
        });
            
        
        splitDescription = splitDescription.filter((str)=>{
            return (str.text !== "") && (str.text !== " \t") && (str.text !== "\t")
        });

        let pushedDescription = "";
        let killSwitch = 0;
        const descriptionNode = card.querySelector(".description");
        while(card.scrollHeight - card.clientHeight > 0){
            killSwitch += 1;
            if(killSwitch >= 1000)  throw new Error(spell.name + " Loop error");;

            const lastDescription = splitDescription.splice(-1)[0];
            pushedDescription = (lastDescription.splitStr==="<table"?"<table":"") + lastDescription.text + (lastDescription.splitStr===". "?". ":"") + pushedDescription;
            descriptionNode.innerHTML = splitDescription.reduce((total, current)=>{
                return total + current.splitStr + current.text;
            }, "");
        }
        recurseSafe++;
        if(recurseSafe > 30){
            throw new Error(spell.name + " Recursion error");
        }
        document.body.removeChild(card);
        return splitCard({name:spell.name, details:{description:pushedDescription.trim()}}, cards);
    }

    const makeSpellCards = (spell, lang)=>{
        let cards = [];
        return splitCard(spell[lang], []);
    }

    document.querySelector(".refresh").onclick = ()=>{
        document.querySelectorAll(".page").forEach((node)=>node.remove())
        let pageEn = document.createElement("div");
        pageEn.className = "page En";
        document.body.append(pageEn);
        let pageFr = document.createElement("div");
        pageFr.className = "page Fr";
        document.body.append(pageFr);

        const namesEn = document.querySelector(".spellsEn .spellList").value.split(";").map((str)=>str.trim().toLowerCase());
        const namesFr = document.querySelector(".spellsFr .spellList").value.split(";").map((str)=>str.trim().toLowerCase());
        let pagePosition=0;
        spells.filter((spell)=>{
            return namesEn.includes(spell.en.name.trim().toLowerCase()) || namesFr.includes(spell.fr.name.trim().toLowerCase());
        }).sort((a,b)=>{
            const sortBy = document.querySelector(".sortBy").value;
            if(sortBy === "Alphabetical EN")
                return a.en.name>b.en.name
            if(sortBy === "Alphabetical FR")
                return a.fr.name>b.fr.name
        }).forEach((spell)=>{
            const cardsEn = makeSpellCards(spell, "en");
            const cardsFr = makeSpellCards(spell, "fr");
            const length = cardsEn.length > cardsFr.length ? cardsEn.length : cardsFr.length;
            for(let i=0; i<length; i++){
                if(pagePosition === 9){
                    pagePosition=0;
                    pageEn = document.createElement("div");
                    pageEn.className = "page En";
                    document.body.append(pageEn);
                    pageFr = document.createElement("div");
                    pageFr.className = "page Fr";
                    document.body.append(pageFr);
                }
                if(!cardsEn[i]){
                    cardsEn.push(makeCard(spell.en.name + " Blank side",{}))
                }
                if(!cardsFr[i]){
                    cardsFr.push(makeCard(spell.fr.name + " Blank side",{}))
                }
                pageEn.append(cardsEn[i]);
                pageFr.append(cardsFr[i]);
                pagePosition++;
            }
        });
    }
    
    const searchUpdate = (input)=>{
        const language = input.dataset.language;
        const suggestions = input.parentElement.querySelector(".suggestions");
        suggestions.classList.remove("hidden");
        const textTarget = input.parentElement.parentElement.querySelector(".spellList");
        suggestions.innerHTML = "";
        if(input.value.length < 2) return;
        spells
            .filter(
                (spell)=> spell[language].name.toLowerCase().includes(input.value.toLowerCase()) )
            .forEach( (spell, i)=>{
                const node = document.createElement("div");
                node.innerText += spell[language].name
                if(i === 0)
                    node.classList.add("active");
                node.onmousedown = ()=> {
                    textTarget.value += spell[language].name+";\n";
                    setTextareaHeight(textTarget);
                }
                suggestions.append(node);
            })
    }

    const setTextareaHeight = (node)=>{
        const height = node.scrollHeight < 300 ? node.scrollHeight : 300;
        node.style.height = height+"px"
    }

    document.querySelector(".spellsEn .search").onkeyup = (e)=>{
        if(e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Enter")
            searchUpdate(e.currentTarget);
    }
    document.querySelector(".spellsFr .search").onkeyup = (e)=>{
        if(e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Enter")
            searchUpdate(e.currentTarget);
    }
    document.querySelectorAll(".search").forEach((input)=>{
        const suggestions = input.parentElement.querySelector(".suggestions");
        suggestions.style.left = input.getBoundingClientRect().left;
        input.onfocus = ()=> searchUpdate(input);
        input.onblur = ()=> suggestions.classList.add("hidden");

        input.onkeydown = (e)=>{
            const active = suggestions.querySelector(".active");
            if(e.key === "ArrowDown"){
                active.classList.remove("active");
                active.nextSibling.classList.add("active");
            }
            if(e.key === "ArrowUp"){
                active.classList.remove("active");
                active.previousSibling.classList.add("active");
            }
            if(e.key === "Enter"){
                const textTarget = input.parentElement.parentElement.querySelector(".spellList");
                textTarget.value += active.innerText+";\n";
                setTextareaHeight(textTarget);
            }
        };
    })
    document.querySelectorAll(".spellList").forEach((textarea)=>{
        setTextareaHeight(textarea);
        textarea.onkeydown = ()=>setTextareaHeight(textarea);
    });
}
