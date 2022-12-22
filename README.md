<img src="https://user-images.githubusercontent.com/41103373/209212413-cf00931e-c7fe-43b9-b4e5-fcdf0d094010.png" width="200" height="200" align="right"/>

# Cypress, a general-purpose Discord bot
This is a work-in-progress Discord bot that has a few (mostly trivial) commands. This will be something I hope to work on as a side project, and will add more functionality (both simple and complex) while I try to get a hang of the Discord API, Discord.JS, and JavaScript in general.

## Dependencies 
Cypress uses [Discord.JS](https://discord.js.org/) v14, which requires [Node.js v16.9](https://nodejs.org/en/) or higher. Discord.JS v14 can be installed directly through npm:
```bash
npm install discord.js
```

## Running the Bot
You will need to create your own Application through Discord's [Developer Portal](https://discord.com/developers/applications), and obtain a `token` and `clientId` which you can put in a `config.json` file. More information [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and [here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html).

Launch the bot:
```bash
node .
```
Refresh the command list (used when adding a new command):
```bash
node update
```

## Usage
Currently, the bot supports these commands:
```
/userinfo
/serverinfo
/roll
/ping
/yvr (purpose-built command for my own personal server)
```
These are implemented as application commands (or "slash commands").

---
Last Updated: 2022/12/22 12:22 PST (20:22 UTC)
