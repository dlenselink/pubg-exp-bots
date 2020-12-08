# PUBG Experienced Discord Bots

A collection of Discord bots for the PUBG Experienced Discord server.


## Environment Setup & Testing Locally

1) Contact dLENS (dLENS#7299 on Discord) to be added as a collaborator on the project and get the .env file, then add it to the project root.

2) Open a terminal with the project root as the active directory.

3) Run `npm install`.

4) Run `node index.js`.

5) In the #get-a-role channel, enter the `!register` command as outlined in the Commands section below.

6) Check the bot response and verify that the proper role was assigned.


## Commands

- `!register` This command is followed by the user's PUBG in-game name and should be entered in the #get-a-role channel. E.g. `!register dLENS`


## Heroku

[App Dashboard](https://dashboard.heroku.com/apps/pubg-exp-bots)

The .env file values can be edited on the [settings page](https://dashboard.heroku.com/apps/pubg-exp-bots/settings) by first clicking `Reveal Config Vars`, then adding/removing/editing the config vars so that they exactly match the keys and values in the .env file.


## Github

[Repository link](https://github.com/dlenselink/pubg-exp-bots)

Clone URL: https://github.com/dlenselink/pubg-exp-bots.git
