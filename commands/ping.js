const {SlashCommandBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('checks the latency of the bot.'),

	async execute(interaction) {
		const sent = await interaction.reply({content: 'Pinging...', fetchReply: true});
		interaction.editReply(`Pong!\n\`\`\`\nAPI Latency: ${interaction.client.ws.ping}ms\nRoundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms\n\`\`\``);
	},
};
