// load pokemon data
const pokemonDataPromise = fetch("./pokemon.json")
.then((response) => response.json());

let columns = 7;
let rows = 4;
let totalItems = columns*rows;

const spawnsElement = document.getElementById("spawns");

const ppmElement = document.getElementById("ppm");

// reset when tab is pressed
document.addEventListener("keydown",(e)=>{
    if(e.key == "Tab") {
        e.preventDefault();
        reload()
    }
})

const columnSelector = document.getElementById("columnSelector");
const rowSelector = document.getElementById("rowSelector");

function generateOptions(selector) {
    for(let i = 1; i <= 15; i++) {
        const optionElement = document.createElement("option");
        optionElement.setAttribute("value",i);
        optionElement.innerText = i;
        selector.append(optionElement)
    }
}

generateOptions(columnSelector)
generateOptions(rowSelector)

columnSelector.value = columns;
rowSelector.value = rows;

columnSelector.addEventListener("change",e=>onChange(e,"columns"))
rowSelector.addEventListener("change",e=>onChange(e,"rows"))

function onChange(e,variableName) {
    const newValue = parseInt(e.target.value)

    if(variableName === "columns") columns = newValue
    else if(variableName === "rows") rows = newValue

    reload()
}

let spawns = [];
let interval;
let startTime;
let answered = 0;

function onKeydown(e) {
    const pokemonInput = e.target
    const currentSpawnId = parseInt(pokemonInput.parentNode.parentNode.id);

    if(e.key ==="Enter") {
        const answer = pokemonInput.value.trim().toLowerCase().split(" ").filter(x=>!["<@716390085896962058>","@pokétwo#8236","catch","c"].includes(x)).join(" ");
        pokemonInput.value = "";

        const spawn = spawns[currentSpawnId]
        
        if(spawn.pokemon.names.includes(answer)) {
            answered++
            updatePPM(answered,startTime);
            if(answered >= spawnsElement.children.length) clearInterval(interval)
        
            const targetImageElement = e.target.parentNode.getElementsByTagName("img")[0]
            targetImageElement.classList.add("answeredspawn")

            pokemonInput.disabled = true

            let newSpawnId = currentSpawnId+1;
            if(newSpawnId === spawnsElement.children.length) newSpawnId = 0;
            focusSpawn(newSpawnId);
        }  
    }else {
        if(!interval) {
            startTime = Date.now();
            interval = setInterval(()=>{
                updatePPM(answered,startTime);
            },1000);
        }
        
    }
    
}


function focusSpawn(i) {
    let input = spawnsElement.children[i].getElementsByClassName("pokemonInput")[0];
    input.focus();
}

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

function generatePokemonDiv(i,pokemon) {
    // spawn div
    const spawnElement = document.createElement("div");
    spawnElement.setAttribute("class","spawn");
    spawnElement.setAttribute("id",i);

    // main div which holds all spawn elements; will be centered inside of spawn div
    const mainElement = document.createElement("div");
    mainElement.setAttribute("class","main");


    const imgElement = document.createElement("img");
    imgElement.setAttribute("src",pokemon.image);
    imgElement.setAttribute("title",`${pokemon.names[0]}`)
    
    const brElement = document.createElement("br");
    
    const inputElement = document.createElement("input");
    inputElement.setAttribute("class","pokemonInput")
    inputElement.addEventListener("keydown",onKeydown)
    inputElement.placeholder  = pokemon.names[0]

    mainElement.append(imgElement,brElement,inputElement);
    spawnElement.append(mainElement);

    return spawnElement

}

async function generateSpawns() {
    const randomPokemon = await generateRandomPokemon(totalItems)

    console.log(randomPokemon)
    const elements = []

    for(let i =0; i < randomPokemon.length; i++) {
        let pokemon = randomPokemon[i]
        let element = generatePokemonDiv(i,randomPokemon[i]);
        elements.push(element);
        spawns[i] = {
            pokemon:pokemon,
            element:element,
            answered:false
        }
    }
    
    spawnsElement.replaceChildren(...elements)
    focusSpawn(0)
}



function updatePPM(i,startTime) {
    const currentTime = Date.now()
    const timeSince = currentTime-startTime
    let ppm = (i/(timeSince/1000/60))
    if(isNaN(ppm)) ppm = 0

    let incenses =  ppm / 3
    ppmElement.textContent = `${ppm.toFixed(2)} Pokémon per Minute | ${incenses.toFixed(2)} incenses`
}

function reload() {
    totalItems = columns*rows

    // asign column & row counts
    spawnsElement.style.gridTemplateColumns = `repeat(${columns},1fr)` 
    spawnsElement.style.gridTemplateRows = `repeat(${rows},1fr)` 

    clearInterval(interval)
    interval = undefined;
    startTime = undefined;
    spawns = [];
    answered = 0;
    generateSpawns()
    updatePPM(0)
}


reload()






