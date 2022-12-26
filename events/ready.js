const {Events, ActivityType} = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true, // Event only runs once
	execute(client) {
		console.log(`[ONLINE] >> ${client.user.tag} << is online.`);
		client.user.setActivity('diego wonder why im broken haha', {type: ActivityType.Watching});
	},
};