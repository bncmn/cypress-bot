const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('replies with pong.'),

	async execute(interaction){
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`Pong! Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	}
}
