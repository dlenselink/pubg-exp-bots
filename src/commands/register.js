const api = require('../api');

module.exports = {
    name: 'register',
    description: 'Assigns a user a server role based on their current seasons ADR if they have played at least 20 games this season. Otherwise, it uses the last season\'s ADR.',
    execute: async (message, args) => {
        const gamertag = args[0];
        const adr = await api.getSeasonADR(gamertag);

        if (adr === null) {
            message.reply('You must have played at least 20 rounds of TPP squad this season in order to be assigned a role.');
        } else {
            let roleName = ""; 
            const pre = Math.floor(adr / 100) * 100;

            if (adr > 0 && adr < 100) {
                roleName = '0-100 ADR';
            } else if (adr > 500) {
                roleName = '500+ ADR';
            } else {
                roleName = `${pre}+ ADR`;
            }

            const role = message.guild.roles.cache.find(role => role.name === roleName);

            if (role) {
                message.member.roles.add(role);
                message.reply(`you were assigned the ${roleName} role`);
            }
        }
    },
};
