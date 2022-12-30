<img src="https://user-images.githubusercontent.com/41103373/209212413-cf00931e-c7fe-43b9-b4e5-fcdf0d094010.png" width="200" height="200" align="right"/>

# Cypress, a general-purpose Discord bot
This is a work-in-progress Discord bot that has a few (mostly trivial) commands. This will be something I hope to work on as a side project, and will add more functionality (both simple and complex) while I try to get a hang of the Discord API, Discord.JS, and JavaScript in general.

## Dependencies 
Cypress uses [Discord.JS](https://discord.js.org/) v14, which requires [Node.js v16.9](https://nodejs.org/en/) or higher. 

## Running the Bot
You will need to create your own Application through Discord's [Developer Portal](https://discord.com/developers/applications), and obtain a `token` and `clientId` which you can put in a `.env` file. More information [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and [here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html).

```bash
# Clone and enter the directory
git clone git@github.com:bncmn/cypress-bot.git
cd cypress-bot

# Install packages
npm i
```

Navigate into the `cypress-bot` folder and copy/rename `.env.example` to `.env`.
Change it to **your bot token and client ID**. Some commands (usually `/search <...>` commands) may require an API key in order to function. You can also include your API keys in the `.env` file.

```bash
# Start the bot
node .

# Refresh the command list (used when adding a new command)
node update
```
## Usage

### Updating bot presence
Navigate into the `config.json` file and update the following lines to change the bot's presence settings. You will need to restart the bot to observe the changes.
&nbsp;

Change activity status:
```json
"activity": "string",
```
Change bot activity: 0 = Playing {activity}, 2 = Listening to {activity}, 3 = Watching {activity}
```json
"activityType": 0,
```
Change online status: "online", "idle", "dnd", "invisible"
```json
"status": "online"
```
&nbsp;
### Available commands
#### Info
```
/info user <user>
/info server
```
#### Administrative
```
/admin kick <user> <reason>
/admin ban <user> <reason>
/admin timeout <user> <length> <reason>
/admin unban <user> <reason>
```
#### Search
```
/search anime <title>
/search weather <city>
/search randcat
/search randdog
```
#### Miscellaneous
```
/ping
/roll <max> <min>
/split-teams <size>
/echo (locked to application owner)
/yvr
/give-me-a-quote
```
These are implemented as application commands (or "slash commands").<br>
`/yvr` and `/give-me-a-quote` are purpose-built for my own personal server.
