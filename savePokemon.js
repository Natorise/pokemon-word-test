const data = require("./pokemon.json")
const names = require("./names.json")

const namesMap = {
    "nidoran♀️": "nidoran♀",
    "nidoran♂️": "nidoran♂",
    "flabebe": "flabébé",
    "attack deoxys": "deoxys",
    "defense deoxys": "deoxys",
    "speed deoxys": "deoxys",
    "blue-striped basculin": "basculin",
    "pom-pom oricorio": "oricorio",
    "pa'u oricorio": "oricorio",
    "sensu oricorio": "oricorio",
    "rapid strike urshifu": "urshifu",
}

const formsMap = {
    "sandy wormadam": "wormadam",
    "trash wormadam": "wormadam",
    "sunny castform": "castform",
    "rainy castform": "castform",
    "snowy castform": "castform",
    "alolan rattata": "rattata",
    "alolan raticate": "raticate",
    "alolan raichu": "raichu",
    "alolan sandshrew": "sandshrew",
    "alolan sandslash": "sandslash",
    "alolan vulpix": "vulpix",
    "alolan ninetales": "ninetales",
    "alolan diglett": "diglett",
    "alolan dugtrio": "dugtrio",
    "alolan meowth": "meowth",
    "alolan persian": "persian",
    "alolan geodude": "geodude",
    "alolan graveler": "graveler",
    "alolan golem": "golem",
    "alolan grimer": "grimer",
    "alolan muk": "muk",
    "alolan exeggutor": "exeggutor",
    "alolan marowak": "marowak",
    "10% zygarde": "zygarde",
    "complete zygarde": "zygarde",
    "galarian meowth": "meowth",
    "galarian ponyta": "ponyta",
    "galarian rapidash": "rapidash",
    "galarian slowpoke": "slowpoke",
    "galarian slowbro": "slowbro",
    "galarian farfetchd": "farfetch'd",
    "galarian weezing": "weezing",
    "galarian mr. mime": "mr. mime",
    "galarian articuno": "articuno",
    "galarian zapdos": "zapdos",
    "galarian moltres": "moltres",
    "galarian slowking": "slowking",
    "galarian corsola": "corsola",
    "galarian zigzagoon": "zigzagoon",
    "galarian linoone": "linoone",
    "galarian darumaka": "darumaka",
    "galarian darmanitan": "darmanitan",
    "galarian yamask": "yamask",
    "galarian stunfisk": "stunfisk",
    "hisuian growlithe": "growlithe",
    "hisuian arcanine": "arcanine",
    "hisuian voltorb": "voltorb",
    "hisuian electrode": "electrode",
    "hisuian typhlosion": "typhlosion",
    "hisuian qwilfish": "qwilfish",
    "hisuian sneasel": "sneasel",
    "hisuian samurott": "samurott",
    "hisuian lilligant": "lilligant",
    "hisuian zorua": "zorua",
    "hisuian zoroark": "zoroark",
    "hisuian braviary": "braviary",
    "hisuian sliggoo": "sliggoo",
    "hisuian goodra": "goodra",
    "hisuian avalugg": "avalugg",
    "hisuian decidueye": "decidueye",
}

function normalize(text) {
    // ‘’
    return text?.toLowerCase()?.normalize("NFD").replace(/[\u0300-\u036f‘’']/g, "")
}

function getNames(pokeNames) {
    let pokeName = pokeNames[0]
    pokeName = normalize(namesMap[pokeName] ?? pokeName)
    
    let namesEntry = Object.entries(names).find(x=>normalize(x[1].english[0]) === pokeName)
    if(!namesEntry) return console.log("Names Conflict:",pokeName)
    // if(parseInt(namesEntry[0]) >= 10000) console.log(`"${normalize(pokeName)}": "${pokeName.split(" ").slice(-1)}",`)

    let newPokeNames = pokeNames
    newPokeNames = newPokeNames.concat(Object.values(namesEntry[1]).reduce((a,b)=>a.concat(b),[]))

    if(formsMap[pokeName]) {
        let pokeData = data.find(x=>normalize(x.names[0]) === normalize(formsMap[pokeName]))
        if(!pokeData?.names) return console.log("Pokemon Conflict:",formsMap[pokeName])
        newPokeNames = newPokeNames.concat(getNames(pokeData.names))
    }

    newPokeNames = Array.from(new Set(newPokeNames.map(x=>normalize(x))))

    return newPokeNames
}



for(let i of data) {
    i.names = getNames(i.names)
}

const fs = require("fs")
fs.writeFileSync("./pokemon.json",JSON.stringify(data,null,2))

