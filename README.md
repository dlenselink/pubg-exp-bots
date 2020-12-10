# PUBG Experienced Discord Bots

A collection of Discord bots for the PUBG Experienced Discord server.


## Environment Setup & Testing Locally

1) Contact dLENS (dLENS#7299 on Discord) for GitHub and Heroku access, as well as the .env file. Add the .env file to the project root.

2) Open a terminal with the project root as the active directory.

3) Run `npm install`.

4) Run `node index.js`.

5) Enter the command you wish to test in the appropriate channel. The bot can listen for different channel ids at once, see the `message.channel.id` logic in `index.js`.

6) Verify that the response and/or resulting action is correct.


## Commands

- `!register` This command is followed by the user's PUBG in-game name and should be entered in the #get-a-role channel. E.g. `!register dLENS`

- `!drop` This command chooses a random drop location when provided with a map name.

## Adding New Commands

1) Make a copy of `src/commands/_template.js` and rename it to the command you wish to add. For example, if you were adding a `!register` command, you would name the new copy `register.js`.

2) Assign the title attribute to the name of the command, minus the command prefix exclaimation point (!). In this example it should be set to `'register'`.

3) Fill out the description attribute and the JSDoc description.

4) Edit and add your code to the execute() function. The "message" param is a [Discord.js message object](https://discord.js.org/#/docs/main/master/class/Message) and is your ticket to eliciting actions by using any of the properties accessible to the message object. Read the linked documentation for full details. The "args" param contains an array of the user-provided params that came in alongside the command. Some commands might have many args, others might only have one.


## Heroku

[App Dashboard](https://dashboard.heroku.com/apps/pubg-exp-bots)

The .env file values can be edited on the [settings page](https://dashboard.heroku.com/apps/pubg-exp-bots/settings) by first clicking `Reveal Config Vars`, then adding/removing/editing the config vars so that they exactly match the keys and values in the .env file.


## Github

[Repository link](https://github.com/dlenselink/pubg-exp-bots)

Clone URL: https://github.com/dlenselink/pubg-exp-bots.git
