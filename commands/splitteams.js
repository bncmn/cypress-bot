const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');

// A JavaScript implementation of the Fisher-Yates Shuffle
// Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Minor modifications were made to implement a split for the purposes of this command.
function split(roster, splits) {
	let currentIndex = roster.length, randomIndex;
	const resSplits = [];

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[roster[currentIndex], roster[randomIndex]] = [roster[randomIndex], roster[currentIndex]];
	}

	while (roster.length > 0) {
		const splice = roster.splice(0, splits);
		resSplits.push(splice);
	}

	return resSplits;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('split-teams')
		.setDescription('splits the people in your voice call into teams of a given number (Default is 5).')
		.addIntegerOption(option => option
			.setName('size')
			.setDescription('Number of people in each team.')),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const icon = new AttachmentBuilder('./assets/icon.png');

			const vcMembers = interaction.member.voice.channel.members
				.map(member => member.displayName);
			const teams = interaction.options.getInteger('size') ?? 5;
			const res = split(vcMembers, teams);

			const embed = new EmbedBuilder()
				.setColor(0xB080FF)
				.setAuthor({name: interaction.member.voice.channel.name, iconURL: interaction.guild.iconURL()})
				.setTitle('Generated Teams')
				.setTimestamp()
				.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

			res.forEach(element => embed.addFields(
				// eslint-disable-next-line no-shadow
				{name: `Team ${res.indexOf(element) + 1}`, value: element.map(element => `\`${element}\``).join(', ')},
			));

			await interaction.editReply({embeds: [embed], files: [icon]});
		}
		catch (err) {
			if (!interaction.member.voice.channel) {
				await interaction.editReply('You need to be in a voice channel to use this command. Join a voice channel and try again.');
			}
			else {
				await interaction.editReply(`There was an error trying to generate teams. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			}
			console.error(err);
		}
	},
};
