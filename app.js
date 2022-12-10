import {getSummonerData, getSummonerMatches, getSummonerMatch} from "./fetchAPI.js"

const input = document.querySelector("input[type=text]")
const button = document.querySelector("input[type=button]")
let inputValue

//interactivity//

input.addEventListener("input", () => { inputValue = input.value })

button.addEventListener("click", () => displayData(inputValue))

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
        let kda = ((kills + assists) / deaths).toFixed(2)
        let multiKills = Boolean(preName.pentaKills) ? "Penta Kill" :
        Boolean(preName.quadraKills) ? "Quadra Kill" :
        Boolean(preName.tripleKills) ? "Triple Kill" :
        Boolean(preName.doubleKills) ? "Double Kill" : false

        displaySummonerMatches(kills, deaths, assists, result, champion, level, kda, multiKills)
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

function displaySummonerMatches(kills, deaths, assists, result, champion, level, kda, multiKills) {
    const div = document.createElement("div")
    const div1 = document.createElement("div")
    const div2 = document.createElement("div")
    const img = document.createElement("img")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p")
    const p3 = document.createElement("p")
    const p4 = document.createElement("p")
    const span = document.createElement("span")

    document.querySelector("#matches").appendChild(div)
    div.setAttribute("class", "match")
    if(result) {
        div.style.border = "2px solid #00ff00"
    }
    else {
        div.style.border = "2px solid #ff0000"
    }

    div.appendChild(div1)
    div1.setAttribute("class", "champion")
    div1.appendChild(img)
    img.src = `./img/champion/${champion}.png`
    div1.appendChild(p1)
    p1.setAttribute("class", "champion-paragraph")
    p1.innerHTML = champion
    div1.appendChild(span)
    span.innerHTML = level

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