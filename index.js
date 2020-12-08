require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require('fs');
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('PUBG Bot is running...');
});

client.on('message', async (message) => {
    const prefix = process.env.COMMAND_PREFIX;

	if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.channel.id === process.env.CHANNEL_ID) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return;

        try {
            await client.commands.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply(`There was an error trying to execute the "${command}" command.`);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
