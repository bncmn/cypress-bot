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

// Helper function used to determine probability of [Yes / Maybe / No] answers.
// The array has 10 elements, which determines the probability of each outcome.
// 0 = Affirmative, 1 = Non-committal, 2 = Negative.
function weightedRandom() {
	return [0, 0, 0, 0, 0, 0, 0, 0, 1, 2][Math.floor(Math.random() * 10)];
}

function roll8ball() {
	const n = weightedRandom();

	switch (n) {
	case 0:
		return ansAffirm[Math.floor(Math.random() * ansAffirm.length)];
	case 1:
		return ansNonCommit[Math.floor(Math.random() * ansNonCommit.length)];
	case 2:
		return ansNegate[Math.floor(Math.random() * ansNegate.length)];
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('magic8ball')
		.setDescription('answers life\'s most difficult questions.')
		.addStringOption(option => option
			.setName('question')
			.setDescription('The question to ask to the magic 8-ball.')
			.setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			if (interaction.user.id == '288115243790499840') {
				await interaction.editReply(`${interaction.user} asked: \`${interaction.options.getString('question')}\`\n\nI think: \`${ansNegate[Math.floor(Math.random() * ansNegate.length)]}\``);
			}
			else {
				await interaction.editReply(`${interaction.user} asked: \`${interaction.options.getString('question')}\`\n\nI think: \`${roll8ball()}\``);
			}
		}
		catch (err) {
			await interaction.editReply(`There was an error trying to roll. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};