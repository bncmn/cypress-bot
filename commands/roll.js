const {SlashCommandBuilder} = require('discord.js');

const randNum = (min, max) => {Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1));};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('picks a number between two given numbers (or 1 to a maximum).')
		.addIntegerOption(option => option
			.setName('max')
			.setDescription('The upper bound.')
			.setRequired(true))
		.addIntegerOption(option => option
			.setName('min')
			.setDescription('The lower bound.')),

	async execute(interaction) {
		await interaction.reply({content: 'Rolling...', fetchReply: true});

		try {
			const min = interaction.options.getInteger('min') ?? '1';
			const max = interaction.options.getInteger('max');

			if (min > max) {
				await interaction.editReply('`min` must be less than `max`. Please fix your inputs and try again.');
			}
			else {
				await interaction.editReply(`I rolled ${randNum}. (${min} to ${max})`);
			}
		}
		catch (err) {
			await interaction.editReply(`There was an error trying to roll. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}

	},
};