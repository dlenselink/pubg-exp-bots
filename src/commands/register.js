const api = require('../api');

module.exports = {
    name: 'register',
    description: 'Assigns a user a server role based on their current seasons fpp/tpp ADR (whichever is higher) if they have played at least 20 games this season.',
    /**
     * Assigns a user a server role based on their current seasons ADR if they have played at least 20 games this season.
     * @param {string} message - The Discord "Message" object. Read: https://discord.js.org/#/docs/main/master/class/Message
     * @param {[ string ]} args - Contains the gamertag of the Discord user who sent the command.
     */
    execute: async (message, args) => {
        const gamertag = args[0];
        const stats = await api.getSeasonADR(gamertag);
        
        if (stats === null) {
            await message.reply('to receive a role, your name must appear exactly as it does in-game AND you must have played at least 20 squad matches (fpp or tpp) this season.');
        } else {
            const oldRoles = [];
            const adrRole = await message.member.roles.cache.find(r => r.name.includes('ADR'));
            const tppRole = await message.member.roles.cache.find(r => r.name === 'TPP');
            const fppRole = await message.member.roles.cache.find(r => r.name === 'FPP');

            if (adrRole) oldRoles.push(adrRole);
            if (tppRole) oldRoles.push(tppRole);
            if (fppRole) oldRoles.push(fppRole);
            if (oldRoles) await message.member.roles.remove(oldRoles);
            
            let name = "";
            const pre = Math.floor(Math.round(stats.adr) / 100) * 100;

            if (stats.adr > 0 && stats.adr < 100) name = '0-100 ADR';
            else if (stats.adr > 500) name = '500+ ADR';
            else name = `${pre}+ ADR`;

            const newRoles = [];
            const newAdrRole = await message.guild.roles.cache.find(role => role.name === name);
            const newModeRole =  await message.guild.roles.cache.find(role => role.name === stats.mode.toUpperCase());

            if (newAdrRole) newRoles.push(newAdrRole);
            if (newModeRole) newRoles.push(newModeRole);
            if (newRoles) {
                message.member.roles.add(newRoles);
                message.reply(`you were assigned the ${name} role for ${stats.mode.toUpperCase()}`);
            }
        }
    },
};
