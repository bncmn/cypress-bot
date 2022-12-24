const {SlashCommandBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('broadcasts a message to a channel. (Restricted to devs only)')
		.addStringOption(option => option
			.setName('message')
			.setDescription('~')
			.setRequired(true))
		.addChannelOption(option => option
			.setName('channel')
			.setDescription('~')
			.setRequired(true)),

	async execute(interaction) {
		await interaction.reply({content: 'Sending...', fetchReply: true});

		try {
			await interaction.client.application.fetch();
			if (interaction.user.id === interaction.client.application.owner.id) {
				const channel = interaction.client.channels.cache.get(interaction.options.getChannel('channel').id);
				channel.send(interaction.options.getString('message'));
				await interaction.editReply({content: `Message sent to ${channel}.`});
			}
			else {
				await interaction.editReply({content: `This command can only be used by <@${interaction.client.application.owner.id}>.`});
			}
		}
		catch (err) {
			await interaction.editReply({content: `Sending failed. Please try again.\n\`\`\`\n${err.message}\n\`\`\``});
		}
	},
};