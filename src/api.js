const fetch = require('node-fetch');
const findIndex = require('lodash/findIndex');
const get = require('lodash/get');
const { result } = require('lodash');
const fetchParams = {
    method: 'GET',
    headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': 'Bearer ' + process.env.PUBG_TOKEN,
    }
};

const getPlayerId = async (playerName) => {
    const url = "https://api.pubg.com/shards/steam/players?filter[playerNames]=" + playerName;
    const payload = await fetch(url, fetchParams)
    .then(response => {
        if (response.status === 200) { return response.json(); }
        if (response.status === 404) { console.error(`No player info found for user ${playerName}`); }
        console.error("API Error in getMatchInfo fetch");
    })
    .then(json => {
        const playerId = get(json, "data[0].id");
        return playerId;
    })
    .catch(error => console.error(error));
  
    return payload;
};

const getSeasonId = async () => {
    const url = 'https://api.pubg.com/shards/steam/seasons';
    const payload = await fetch(url, fetchParams)
    .then(response => {
        if (response.status === 200) { return response.json(); }
        console.error('API Error in getSeasonsList fetch');
    })
    .then(json => {
        const seasonInfo = get(json, 'data');
        const idx = findIndex(seasonInfo, function(el) { return el.attributes.isCurrentSeason === true; });
        return seasonInfo[idx].id;
    })
    .catch(error => console.error(error));
    
    return payload;
};

module.exports = {
    getSeasonADR: async (playerName) => {
        const player = await getPlayerId(playerName);
        const season = await getSeasonId();
        const url = "https://api.pubg.com/shards/steam/players/" + player + "/seasons/" + season;
        const payload = await fetch(url, fetchParams)
        .then(response => {
            if (response.status === 200) { return response.json(); }
            console.error("API Error in getSeasonsList fetch");
        })
        .then(json => { 
            const squadStats = json.data.attributes.gameModeStats.squad;
            const totalRounds = squadStats.roundsPlayed;

            if (totalRounds < parseInt(process.env.MINIMUM_ROUNDS_PLAYED)) {
                return null;
            } else {
                const totalDamage = squadStats.damageDealt;
                return Math.round(parseInt(totalDamage) / parseInt(totalRounds));
            }
        })
        .catch(error => console.error(error));
        
        return payload;
    },
}
