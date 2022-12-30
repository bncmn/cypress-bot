const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Collection} = require('discord.js');

// Source: https://stackoverflow.com/questions/66281939/discordjs-fetching-more-then-100-messages
async function fetchMore(channel, limit = 500) {
	if (!channel) {
		throw new Error(`Expected channel, got ${typeof channel}.`);
	}
	if (limit <= 100) {
		return channel.messages.fetch({limit});
	}

	let collection = new Collection();
	let lastId = null;
	const options = {};
	let remaining = limit;

	while (remaining > 0) {
		options.limit = remaining > 100 ? 100 : remaining;
		remaining = remaining > 100 ? remaining - 100 : 0;

		if (lastId) {
			options.before = lastId;
		}

		const messages = await channel.messages.fetch(options);

		if (!messages.last()) {
			break;
		}

		collection = collection.concat(messages);
		lastId = messages.last().id;
	}

	return collection;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give-me-a-quote')
		.setDescription('fetches a quote from #quotes.'),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const channel = interaction.guild.channels.cache.get('930231319663882292');
			const messages = await fetchMore(channel);

			const msgIDs = Array.from(messages.keys());
			const randMsgID = msgIDs[Math.floor(Math.random() * msgIDs.length)];
			const randMsg = messages.get(randMsgID);

			if (randMsg.attachments.size > 0) {
				const icon = new AttachmentBuilder('./assets/icon.png');

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTitle('Link to Original Post')
					.setURL(`https://discord.com/channels/353248925832052737/930231319663882292/${randMsgID}`)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

				if (randMsg.content == '') {
					embed.addFields(
						{name: 'Text', value: '`No Text Content`'});
				}
				else {
					embed.addFields(
						{name: 'Text', value: randMsg.content});
				}

				await interaction.editReply({embeds: [embed], files: [randMsg.attachments.first().url, icon]});
			}
			else {
				const icon = new AttachmentBuilder('./assets/icon.png');

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTitle('Link to Original Post')
					.setURL(`https://discord.com/channels/353248925832052737/930231319663882292/${randMsgID}`)
					.setDescription(randMsg.content)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

				await interaction.editReply({embeds: [embed], files: [icon]});
			}
		}
		catch (err) {
			await interaction.editReply(`There was an error trying to fetch a quote. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};