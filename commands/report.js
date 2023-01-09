const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('reports a user to the server moderators.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The user to report.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('reason')
			.setDescription('The reason for the report,')
			.setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			await interaction.client.application.fetch();
			const reportChannel = interaction.client.channels.cache.get('1002462031036813322');

			const icon = new AttachmentBuilder('./assets/icon.png');

			const embed = new EmbedBuilder()
				.setColor(0xB080FF)
				.setTitle('Report Received')
				.setThumbnail(interaction.options.getUser('user').avatarURL())
				.addFields(
					{name: 'Sender', value: `<@${interaction.user.id}>`},
					{name: 'Reported', value: `<@${interaction.options.getUser('user').id}>`},
					{name: 'Channel', value: `<#${interaction.channelId}>`},
					{name: 'Reason', value: interaction.options.getString('reason')},
				)
				.setTimestamp()
				.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

			reportChannel.send({embeds: [embed], files: [icon]});
			await interaction.editReply(`<@${interaction.options.getUser('user').id}> was reported.`);
		}
		catch (err) {
			await interaction.editReply(`There was an error trying to send the report. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};