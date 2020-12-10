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

/**
 * Uses a player's gamertag to look up their PUBG user id.
 * @param {string} playerName - The user's gamertag, exactly as it appears in PUBG.
 */
const getPlayerId = async (playerName) => {
    const url = "https://api.pubg.com/shards/steam/players?filter[playerNames]=" + playerName;
    const payload = await fetch(url, fetchParams)
    .then(response => {
        if (response.status === 200) return response.json();
        if (response.status === 404) console.error(`No player info found for user ${playerName}`);
    })
    .then(json => {
        const playerId = get(json, "data[0].id");
        return playerId;
    })
    .catch(error => console.error(error));

    return payload;
};

/**
 * Gets a season list and returns the id of the current season.
 */
const getSeasonId = async () => {
    const url = 'https://api.pubg.com/shards/steam/seasons';
    const payload = await fetch(url, fetchParams)
    .then(response => {
        if (response.status === 200) return response.json();
    })
    .then(json => {
        const seasonInfo = get(json, 'data');
        const idx = findIndex(seasonInfo, (el) => el.attributes.isCurrentSeason === true);
        return seasonInfo[idx].id;
    })
    .catch(error => console.error(error));
    
    return payload;
};

module.exports = {
    /**
     * Looks up a player's stats, calculates their ADR, then assigns a role based on their ADR.
     * @param {string} playerName - The user's gamertag, exactly as it appears in PUBG.
     */
    getSeasonADR: async (playerName) => {
        const season = await getSeasonId();
        const player = await getPlayerId(playerName);
        const url = `https://api.pubg.com/shards/steam/players/${player}/seasons/${season}`;
        const payload = await fetch(url, fetchParams)
        .then(response => {
            if (response.status === 200) return response.json();
        })
        .then(json => {
            const tppStats = json.data.attributes.gameModeStats['squad'];
            const fppStats = json.data.attributes.gameModeStats['squad-fpp'];
            const tppRounds = parseInt(tppStats.roundsPlayed);
            const fppRounds = parseInt(fppStats.roundsPlayed);
            const minimum = parseInt(process.env.MINIMUM_ROUNDS_PLAYED);
            let tppAdr = null, fppAdr = null;

            if (tppRounds > minimum) {
                const tppDamage = parseInt(tppStats.damageDealt);
                tppAdr = tppDamage / tppRounds;
            }
            
            if (fppRounds > minimum) {
                const fppDamage = parseInt(fppStats.damageDealt);
                fppAdr = fppDamage / fppRounds;
            }

            if (tppAdr && !fppAdr) {
                return { adr: tppAdr, mode: 'tpp' };
            } else if (!tppAdr && fppAdr) {
                return { adr: fppAdr, mode: 'fpp' };
            } else if (tppAdr && fppAdr) {
                if (tppAdr > fppAdr) return { adr: tppAdr, mode: 'tpp' };
                return { adr: fppAdr, mode: 'fpp' };
            }
                
            return null;
        })
        .catch(error => console.error(error));

        return payload;
    },
};
