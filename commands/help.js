const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('readme')
		.setDescription('describes the features and functions that are included with Cypress.'),

	async execute(interaction) {
		const icon = new AttachmentBuilder('./assets/icon.png');

		const embed = new EmbedBuilder()
			.setColor(0xB080FF)
			.setTitle('Cypress, a general-purpose Discord bot')
			.setURL('https://github.com/bncmn/cypress-bot#readme')
			// eslint-disable-next-line no-useless-escape
			.setDescription('Hi! I am Cypress, a Discord bot owned, developed, and maintained by Diego (\`0df\`). Here are all of the commands that I have:');
	},
};