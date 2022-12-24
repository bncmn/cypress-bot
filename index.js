// fs -> Node's native file system module; reads ~/commands
// path -> Node's native path utility module;
const fs = require('node:fs');
const path = require('node:path');

// Required discord.js classes
// eslint-disable-next-line no-unused-vars
const {Client, Events, GatewayIntentBits, Collection} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates]});

// Extends Map(); store and retrieve commands
client.commands = new Collection();

// path.join() constructs path to ~/commands (or ~/events)
// readdirSync() returns array of filenames in ~/commands (or ~/events)
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log('[WARNING] Command at >> ${filePath} << missing a required "data" or "execute" property.');
	}
}

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);