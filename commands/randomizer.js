const {SlashCommandBuilder} = require('discord.js');

function randNum(min, max) {
	return Math.floor(Math.random() * (Math.floor(max) - Math.floor(min) + 1));
}

// roll8ball() implements an extremely rudimentary way of picking, with weights, a random answer.
function roll8ball() {
	// The number of [0/1/2]s in the array determines the probability that one of [Yes/Maybe/No] is selected,
	// where 0 == Yes, 1 == Maybe, and 2 == No.
	// i.e. eight zeroes == 80% chance of a 'Yes' answer.
	const n = [0, 0, 0, 0, 0, 0, 0, 1, 2, 2][Math.floor(Math.random() * 10)];

	const ansAffirm = [
		'It is certain.',
		'It is decidedly so.',
		'Without a doubt.',
		'Yes, definitely.',
		'You may rely on it.',
		'As I see it, yes.',
		'Most likely.',
		'Outlook good.',
		'Yes.',
		'Signs point to yes.',
	];

	const ansNonCommit = [
		'Reply hazy, try again.',
		'Ask again later.',
		'Better not tell you now.',
		'Cannot predict now.',
		'Concentrate and ask again.',
	];

	const ansNegate = [
		'Don\'t count on it.',
		'My reply is no.',
		'My sources say no.',
		'Outlook not so good.',
		'Very doubtful.',
	];

	switch (n) {
	case 0: // Affirmative answer
		return ansAffirm[Math.floor(Math.random() * ansAffirm.length)];
	case 1: // Non-committal answer
		return ansNonCommit[Math.floor(Math.random() * ansNonCommit.length)];
	case 2: // Negative answer
		return ansNegate[Math.floor(Math.random() * ansNegate.length)];
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('provides a randomly generated answer for whatever you need.')

		.addSubcommand(subcommand => subcommand
			.setName('number')
			.setDescription('picks a number between two given numbers (or 1 to a maximum).')
			.addIntegerOption(option => option
				.setName('max')
				.setDescription('The upper bound.')
				.setRequired(true))
			.addIntegerOption(option => option
				.setName('min')
				.setDescription('The lower bound.')))

		.addSubcommand(subcommand => subcommand
			.setName('picker')
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
				.setDescription('A fifth option.')))

		.addSubcommand(subcommand => subcommand
			.setName('8ball')
			.setDescription('answers life\'s most difficult questions (\'Yes\' or \'No\' questions only).')
			.addStringOption(option => option
				.setName('question')
				.setDescription('The question to ask Cypress.')
				.setRequired(true))),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			if (interaction.options.getSubcommand() == 'number') {
				try {
					const min = interaction.options.getInteger('min') ?? '1';
					const max = interaction.options.getInteger('max');

					if (min > max) {
						await interaction.editReply('`min` must be less than `max`. Please fix your inputs and try again.');
					}
					else {
						await interaction.editReply(`${interaction.user} asked me to roll a number from \`${min}\` to \`${max}\`.\n\nI rolled \`${randNum(min, max)}\`.`);
					}
				}
				catch (err) {
					await interaction.editReply(`There was an error trying to roll. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
					throw new Error(err.message);
				}
			}
			if (interaction.options.getSubcommand() == 'picker') {
				try {
					const options = interaction.options.data[0].options.map(option => option.value);
					await interaction.editReply(`${interaction.user} needs help picking from: \`${options}\`\n\n I pick: \`${options[Math.floor(Math.random() * options.length)]}\``);
				}
				catch (err) {
					await interaction.editReply(`There was an error trying to pick. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
					throw new Error(err.message);
				}
			}
			if (interaction.options.getSubcommand() == '8ball') {
				try {
					await interaction.editReply(`${interaction.user} asked: \`${interaction.options.getString('question')}\`\n\n${roll8ball()}`);
				}
				catch (err) {
					await interaction.editReply(`There was an error trying to roll. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
					throw new Error(err.message);
				}
			}
		}
		catch (err) {
			console.error(err);
		}
	},
};