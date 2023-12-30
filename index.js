const pokemonDataPromise = fetch("./pokemon.json")
.then((response) => response.json())


// remove accents etc
function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

// generate random pokemon based on spawnrates
async function generateRandomPokemon(count) {
    const pokemonData = await pokemonDataPromise;
    const totalAbundance = pokemonData.reduce((p,c)=>p + c.abundance,0)
    const pokemonArr = []

    for(let i = 0; i < count; i++) {
        const randomAbundance = Math.floor(Math.random() * totalAbundance)
    
        let abundanceSum = 0;
        let randomPokemon
        for(let pokemon of pokemonData) {
            abundanceSum+= pokemon.abundance
            if(randomAbundance < abundanceSum) {
                randomPokemon = pokemon
                break
            }
        }

        pokemonArr.push(randomPokemon)
    }

    return pokemonArr
}


// set words to pokemon names with formatting
function setWords(wordsElement,pokemonArr,i = 0) {
    const pokemonNamesArr = pokemonArr.map(x=>x.names[0])

    let newStrArr = []
    if(i > 0) newStrArr.push(`<span id="completed">${pokemonNamesArr.slice(0,i).join(" ")}</span>`)
    if(i < pokemonNamesArr.length) newStrArr.push(`<u>${pokemonNamesArr[i]}</u>`)

    newStrArr.push(pokemonNamesArr.slice(i+1).join(" "))

    wordsElement.innerHTML = newStrArr.join(" ")
}

// update Pokemon per minute
function updatePPM(ppmElement,i,startTime) {
    const currentTime = Date.now()
    const timeSince = currentTime-startTime
    let ppm = (i/(timeSince/1000/60))
    if(isNaN(ppm)) ppm = 0

    let incenses =  ppm / 3
    ppmElement.textContent = `${ppm.toFixed(2)} Pokémon per Minute | ${incenses.toFixed(2)} incenses`
}



window.onload = async ()=>{
    // get elements
    const currentWordElement = document.getElementById("currentWord");
    const wordsElement = document.getElementById("words");
    const ppmElement = document.getElementById("ppm");


    // set defaults
    currentWordElement.placeholder = "Type to begin";
    currentWordElement.value = "";
    currentWordElement.focus();
    updatePPM(ppmElement,0);

    // generate 25 random pokemon
    let pokemonArr = await generateRandomPokemon(20);
    setWords(wordsElement,pokemonArr)

    // track changes to input
    let i = 0;
    let currentPokemon = pokemonArr[i];
    let startTime;
    let interval;

    let finished = false; 
    
    currentWordElement.oninput = (input)=>{
        if(finished) return;
        let newLetter = input.data
        if(!startTime) {
            currentWordElement.placeholder = ""
            startTime = Date.now();
            interval = setInterval(()=>{
                updatePPM(ppmElement,i,startTime);
            },1000);
        }

        let onLastWord = i+1 === pokemonArr.length
        if(onLastWord ||  newLetter == " ") {
            let word = normalize(currentWordElement.value);

            if(!onLastWord) word = word.slice(0,-1);

            if(currentPokemon.names.includes(word)) {
                i++;
                currentWordElement.value = "";
                setWords(wordsElement,pokemonArr,i)
                currentPokemon = pokemonArr[i];

                // detect if finished
                if(i >= pokemonArr.length) {
                    clearInterval(interval);
                    updatePPM(ppmElement,i,startTime);
                    currentWordElement.placeholder = "Press Enter";
                    finished = true;
                }
            }

        }
    }
    // reset when press enter
    function onKeyup(e) {
        if(e.key == "Enter") {
            if(finished) {
                currentWordElement.oninput = undefined
                currentWordElement.removeEventListener("keyup",onKeyup)
                window.onload()
            }
        }
    }
    currentWordElement.addEventListener("keyup",onKeyup)




}

