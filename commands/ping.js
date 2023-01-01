const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('checks the latency and uptime of the bot.'),

	async execute(interaction) {
		const icon = new AttachmentBuilder('./assets/icon.png');
		console.log(`[LOG] ${interaction.user.tag} used ${interaction.commandName}.`);

		try {
			const sent = await interaction.reply({content: 'Pinging...', fetchReply: true});

			const embed = new EmbedBuilder()
				.setColor(0xB080FF)
				.addFields(
					{name: 'Uptime', value: dayjs.duration(interaction.client.uptime).format('D[d] H[h] m[m] s[s]')},
					{name: 'API Latency', value: `${interaction.client.ws.ping}ms`, inline: true},
					{name: 'Roundtrip Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true})
				.setTimestamp()
				.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

			await interaction.editReply({embeds: [embed], files: [icon]});
		}
		catch (err) {
			console.error(err);
		}
	},
};
