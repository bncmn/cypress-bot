const {Events, ActivityType} = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true, // Event only runs once
	execute(client) {
		console.log(`[ONLINE] >> ${client.user.tag} << is online.`);
		client.user.setActivity('diego wondering why im broken lol', {type: ActivityType.Watching});
	},
};