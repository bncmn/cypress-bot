<img src="https://user-images.githubusercontent.com/41103373/209212413-cf00931e-c7fe-43b9-b4e5-fcdf0d094010.png" width="200" height="200" align="right"/>

# Cypress, a general-purpose Discord bot
This is a work-in-progress Discord bot that has a few (mostly trivial) commands. This will be something I hope to work on as a side project, and will add more functionality (both simple and complex) while I try to get a hang of the Discord API, Discord.JS, and JavaScript in general.

## Dependencies 
Cypress uses [Discord.JS v14](https://discord.js.org/), which requires [Node.js v16.9](https://nodejs.org/en/) or higher. 

## Running the Bot
You will need to create your own Application through Discord's [Developer Portal](https://discord.com/developers/applications), and obtain a `token` and `clientId` which you can put in a `.env` file. More information [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and [here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html).

```bash
# Clone and enter the directory
git clone git@github.com:bncmn/cypress-bot.git
cd cypress-bot

# Install packages
npm i
```

Navigate into the `cypress-bot` folder and copy (or rename) `.env.example` to `.env`.
Change the fields in your `.env` file to **your bot token and client ID**. Some commands (usually `/search <...>` commands) may require an API key in order to function. You should also include these in the `.env` file.

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
### Available commands
Below are the commands that Cypress currently has. These are implemented as application commands (or "slash commands").<br>
The files that contain their definitions are also listed.
```bash
# Informational (in info.js)
/info user <user>
/info server
/info whois <role>

# Administrative (in admin.js)
/report <user> <reason>                       # (report.js)
/admin kick <user> <reason>
/admin ban <user> <reason>
/admin unban <user> <reason>
/admin purge <messages>
/admin timeout <user> <length> <reason>

# Search (in search.js)
/search anime <title>
/search weather <city>
/search wikipedia <term>
/search randdog
/search randcat

# Randomizers (in randomizer.js)
/roll <max> <min>
/magic8ball <question> 
/pickone <opt1> <opt2> <opt3> <opt4> <opt5>
/split-teams <size>                           # (splitteams.js)

# Miscellaneous
/ping                                         # (ping.js)
/echo (locked to application owner)           # (echo.js)
/yvr                                          # (yvr.js)
/give-me-a-quote                              # (fetchquote.js)
```
### Some notes
* The current implementation of `/magic8ball` can be skewed to favour certain types of responses. The comments for `roll8ball()` in `randomizer.js` describe this functionality in detail.
* `/yvr` and `/give-me-a-quote` are purpose-built for my own personal server.
* The current implementation of `/report` in `report.js` has a hard-coded channel ID and will need to be adapted to your own deployment in your server. I might consider implementing something that allows you to set the report channel within your server instead of having to set it within the code.
