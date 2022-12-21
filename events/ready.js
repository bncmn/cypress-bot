const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true, // Event only runs once
    execute(client){
        console.log(`[ONLINE] >> ${client.user.tag} << is online.`);
    }
}