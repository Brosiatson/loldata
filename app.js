import {getSummonerData, getSummonerMatches, getSummonerMatch} from "./fetchAPI.js"

const input = document.querySelector("input[type=text]")
const button = document.querySelector("input[type=button]")
let inputValue, gameIds = []

//interactivity//

input.addEventListener("input", () => { inputValue = input.value })

button.addEventListener("click", () => { if(inputValue) { displayData(inputValue) } })

//get data//

async function displayData(summonerName) {
    clearData()

    const summonerData = await getSummonerData(summonerName)
    console.log(summonerData)
    displaySummonerBanner(summonerData.name, summonerData.summonerLevel, summonerData.profileIconId)

    const puuid = summonerData.puuid
    const name = summonerData.name

    const summonerMatches = await getSummonerMatches(puuid)
    for (const match of summonerMatches) {
        const summonerMatch = await getSummonerMatch(match)
        console.log(summonerMatch)
        gameIds.push(summonerMatch.info.gameId)

        let index
        summonerMatch.info.participants.map((x, y) => {
            if(x.summonerName === name) {
                index = y
            }
        })

        let preName = summonerMatch.info.participants[index]

        let kills = preName.kills
        let deaths = preName.deaths
        let assists = preName.assists
        let result = preName.win
        let champion = preName.championName
        let level = preName.champLevel
        let kda = kills + assists + deaths === NaN ? 0.00 : ((kills + assists) / deaths).toFixed(2)
        let multiKills = Boolean(preName.pentaKills) ? "Penta Kill" :
        Boolean(preName.quadraKills) ? "Quadra Kill" :
        Boolean(preName.tripleKills) ? "Triple Kill" :
        Boolean(preName.doubleKills) ? "Double Kill" : false
        let typeOfGame = summonerMatch.info.gameMode
        let duration = summonerMatch.info.gameDuration < 10000 ? 
        (`${(summonerMatch.info.gameDuration / 60).toFixed(0)}:${(summonerMatch.info.gameDuration % 60) < 10 ? `0${summonerMatch.info.gameDuration % 60}` : summonerMatch.info.gameDuration % 60}`) :
        (`${(summonerMatch.info.gameDuration / 1000 / 60).toFixed(0)}:${((summonerMatch.info.gameDuration / 1000).toFixed(0) % 60) < 10 ? `0${(summonerMatch.info.gameDuration / 1000).toFixed(0) % 60}` : (summonerMatch.info.gameDuration / 1000).toFixed(0) % 60}`)
        let newDate = new Date()
        let currentTime = newDate.getTime()
        let endGameTime = summonerMatch.info.gameEndTimestamp || summonerMatch.info.gameStartTimestamp 
        let timeAgo = dateParamsCounter(currentTime, endGameTime, 1) < 60 ? `${dateParamsCounter(currentTime, endGameTime, 1).toFixed(0)} seconds ago` :
        dateParamsCounter(currentTime, endGameTime, 2) < 60 ? `${dateParamsCounter(currentTime, endGameTime, 2).toFixed(0)} minutes ago` :
        dateParamsCounter(currentTime, endGameTime, 3) < 24 ? `${dateParamsCounter(currentTime, endGameTime, 3).toFixed(0)} hours ago` :
        dateParamsCounter(currentTime, endGameTime, 4) < 7 ? `${dateParamsCounter(currentTime, endGameTime, 4).toFixed(0)} days ago` :
        dateParamsCounter(currentTime, endGameTime, 5) < 4 ? `${dateParamsCounter(currentTime, endGameTime, 5).toFixed(0)} weeks ago` :
        dateParamsCounter(currentTime, endGameTime, 6) < 12 ? `${dateParamsCounter(currentTime, endGameTime, 6).toFixed(0)} months ago` :
        `${dateParamsCounter(currentTime, endGameTime, 7).toFixed(0)} years ago`

        displaySummonerMatches(kills, deaths, assists, result, champion, level, kda, multiKills, typeOfGame, duration, timeAgo)

        const gameTiles = document.querySelectorAll(".match")
        if(gameTiles.length > 0) {gameTiles.forEach((tile, index) => tile.addEventListener("click", () => {
            location.href = "./game/index.html"
            const clickedGame = gameIds[index]
            localStorage.setItem("clickedGame", clickedGame)
        }))}
    }
}

function dateParamsCounter(a, b, c) {
    switch(c){
        case 1: return (a - b) / 1000
        case 2: return (a - b) / 1000 / 60
        case 3: return (a - b) / 1000 / 3600
        case 4: return (a - b) / 1000 / 86400
        case 5: return (a - b) / 1000 / 604800
        case 6: return (a - b) / 1000 / 2419200
        case 7: return (a - b) / 1000 / 29030400

    }
}

//design//

function displaySummonerBanner(name, level, avatar) {
    const img = document.createElement("img")
    const div = document.createElement("div")
    const div1 = document.createElement("div")
    const p1 = document.createElement("p")
    const span = document.createElement("span")

    document.querySelector("#banner").appendChild(div)
    div.setAttribute("class", "player")

    div.appendChild(div1)
    div1.setAttribute("class", "avatar")
    div1.appendChild(img)
    img.src = `./img/profileicon/${avatar}.png`
    div1.appendChild(span)
    span.innerHTML = level

    div.appendChild(p1)
    p1.setAttribute("class", "banner-paragraph")
    p1.innerHTML = name
}

function displaySummonerMatches(kills, deaths, assists, result, champion, level, kda, multiKills, typeOfGame, duration, timeAgo) {
    const div = document.createElement("div")
    const div1 = document.createElement("div")
    const div2 = document.createElement("div")
    const div3 = document.createElement("div")
    const img = document.createElement("img")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p")
    const p3 = document.createElement("p")
    const p4 = document.createElement("p")
    const p5 = document.createElement("p")
    const span1 = document.createElement("span")
    const span2 = document.createElement("span")
    const span3 = document.createElement("span")

    document.querySelector("#matches").appendChild(div)
    div.setAttribute("class", "match")
    if(result) {
        div.style.border = "2px solid #00ff00"
    }
    else {
        div.style.border = "2px solid #ff0000"
    }

    div.appendChild(div3)
    div3.setAttribute("class", "type-and-time")
    div3.appendChild(p5)
    p5.setAttribute("class", "type-paragraph")
    p5.innerHTML = typeOfGame
    div3.appendChild(span2)
    span2.innerHTML = duration
    div3.appendChild(span3)
    span3.innerHTML = timeAgo

    div.appendChild(div1)
    div1.setAttribute("class", "champion")
    div1.appendChild(img)
    img.src = `./img/champion/${champion}.png`
    div1.appendChild(p1)
    p1.setAttribute("class", "champion-paragraph")
    p1.innerHTML = champion
    div1.appendChild(span1)
    span1.innerHTML = level

    div.appendChild(div2)
    div2.setAttribute("class", "stats")
    div2.appendChild(p2)
    p2.setAttribute("class", "stats-paragraph")
    p2.innerHTML = `${kills}/${deaths}/${assists}`
    div2.appendChild(p3)
    p3.setAttribute("class", "kda-paragraph")
    p3.innerHTML = `KDA: ${kda}`
    if(multiKills) {
        div2.appendChild(p4)
        p4.setAttribute("class", "multikills-paragraph")
        p4.innerHTML = multiKills
    }
}

function clearData() {
    const bannerContents = document.querySelectorAll("#banner *")
    const matchesContents = document.querySelectorAll("#matches *")

    bannerContents.forEach(x => x.remove())
    matchesContents.forEach(x => x.remove())
}