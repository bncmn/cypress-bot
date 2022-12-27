<img src="https://user-images.githubusercontent.com/41103373/209212413-cf00931e-c7fe-43b9-b4e5-fcdf0d094010.png" width="200" height="200" align="right"/>

# Cypress, a general-purpose Discord bot
This is a work-in-progress Discord bot that has a few (mostly trivial) commands. This will be something I hope to work on as a side project, and will add more functionality (both simple and complex) while I try to get a hang of the Discord API, Discord.JS, and JavaScript in general.

## Dependencies 
Cypress uses [Discord.JS](https://discord.js.org/) v14, which requires [Node.js v16.9](https://nodejs.org/en/) or higher. 

## Running the Bot
You will need to create your own Application through Discord's [Developer Portal](https://discord.com/developers/applications), and obtain a `token` which you can put in a `.env` file. More information [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and [here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html).

```bash
# Clone and enter the dir
git clone git@github.com:bncmn/cypress-bot.git && cd cypress-bot

# Install packages
npm i
```

Navigate into the `cypress-bot` folder and copy/rename `.env.example` to `.env`.
For this example, only `token` needs to be changed. Change it to **your bot token**.

```bash
# Start the bot
node .

# Refresh the command list (used when adding a new command)
node update
```

## Usage
Currently, the bot supports these commands:
```
/ping
/echo
/info user <user>
/info server
/admin kick <user> <reason>
/admin ban <user> <reason>
/admin timeout <user> <length> <reason>
/roll <max> <min>
/split-teams <size>
/search anime <title>
/search randcat
/search randdog
/yvr
/give-me-a-quote
```
These are implemented as application commands (or "slash commands").<br>
`/yvr` and `/give-me-a-quote` are purpose-built for my own personal server.

---
Last Updated: 2022/12/26 00:10 PST
