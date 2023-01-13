const {SlashCommandBuilder} = require('discord.js');

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

// roll8ball() implements an extremely rudimentary way of picking, with weights, a random answer.
function roll8ball() {
	// The number of [0/1/2]s in the array determines the probability that one of [Yes/Maybe/No] is selected,
	// where 0 == Yes, 1 == Maybe, and 2 == No.
	// i.e. eight zeroes == 80% chance of a 'Yes' answer.
	const n = [0, 0, 0, 0, 0, 1, 1, 1, 2, 2][Math.floor(Math.random() * 10)];

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
		.setName('magic8ball')
		.setDescription('answers life\'s most difficult questions. (\'Yes\' or \'No\' questions only)')
		.addStringOption(option => option
			.setName('question')
			.setDescription('The question to ask Cypress.')
			.setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			await interaction.editReply(`${interaction.user} asked: \`${interaction.options.getString('question')}\`\n\n${roll8ball()}`);
		}
		catch (err) {
			await interaction.editReply(`There was an error trying to roll. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};