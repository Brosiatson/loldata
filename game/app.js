import { getSummonerMatch } from "../fetchAPI"

const clickedGame = localStorage.getItem("clickedGame")

async function x() {
    const y = await getSummonerMatch(clickedGame)
    console.log(y)
}

x()