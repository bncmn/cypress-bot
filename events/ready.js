const {Events} = require('discord.js');
const {activity, activityType, status} = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true, // Event only runs once
	execute(client){
		console.log(`[ONLINE] >> ${client.user.tag} << is online.`);

    client.user.setPresence({
      activities: [{
        name: activity,
        type: activityType
      }],
      status: status});
	}
};