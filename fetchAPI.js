const addresses = {
    eun1: "https://eun1.api.riotgames.com",
    europe: "https://europe.api.riotgames.com"
}
const apiKey = "api_key=RGAPI-c7299743-44e8-40d3-907c-5f5a54716d4a"

async function getSummonerData(summonerName) {
    const api = await fetch(`${addresses.eun1}/lol/summoner/v4/summoners/by-name/${summonerName}?${apiKey}`)
    const res = await api.json()
    return res
}

async function getSummonerMatches(summonerPuuid) {
    const api = await fetch(`${addresses.europe}/lol/match/v5/matches/by-puuid/${summonerPuuid}/ids?start=0&count=20&${apiKey}`)
    const res = await api.json()
    return res
}

async function getSummonerMatch(matchId) {
    const api = await fetch(`${addresses.europe}/lol/match/v5/matches/${matchId}?${apiKey}`)
    const res = await api.json()
    return res
}

export {getSummonerData, getSummonerMatches, getSummonerMatch}

