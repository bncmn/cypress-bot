const {SlashCommandBuilder} = require('discord.js');

module.exports = {
	data : new SlashCommandBuilder()
		.setName('pickone')
		.setDescription('picks a random option from a provided list (Minimum of 2 options, maximum of 5).')
		.addStringOption(option => option
			.setName('option1')
			.setDescription('The first option.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('option2')
			.setDescription('The second option.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('option3')
			.setDescription('A third option.'))
		.addStringOption(option => option
			.setName('option4')
			.setDescription('A fourth option.'))
		.addStringOption(option => option
			.setName('option5')
			.setDescription('A fifth option.')),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const options = interaction.options.data.map(option => option.value);
			await interaction.editReply(`${interaction.user} needs help picking from: \`${options}\`\n\n I pick: \`${options[Math.floor(Math.random() * options.length)]}\``);
		}
		catch (err) {
			await interaction.editReply(`There was an error trying to pick. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};