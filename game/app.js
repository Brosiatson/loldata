import { getSummonerMatchTimeline } from "../fetchAPI.js"

const clickedGame = localStorage.getItem("clickedGame")

async function x() {
    const y = await getSummonerMatchTimeline(clickedGame)
    console.log(y)
}

x()