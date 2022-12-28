const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const {request} = require('undici');

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('makes an API request from a website.')

		.addSubcommand(subcommand => subcommand
			.setName('anime')
			.setDescription('retrieves the MyAnimeList entry for an anime.')
			.addStringOption(option => option
				.setName('title')
				.setDescription('The title of the anime')
				.setRequired(true)))

		.addSubcommand(subcommand => subcommand
			.setName('randdog')
			.setDescription('Fetches a random dog picture.'))

		.addSubcommand(subcommand => subcommand
			.setName('randcat')
			.setDescription('fetches a random cat picture.')),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const icon = new AttachmentBuilder('./assets/icon.png');

			if (interaction.options.getSubcommand() == 'anime') {
				const title = interaction.options.getString('title');
				const query = new URLSearchParams({title});

				const result = await request(`https://api.jikan.moe/v4/anime?q=${query}`);
				const {data} = await result.body.json();

				// console.log(data[0]);

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTitle(data[0].title)
					.setURL(data[0].url)
					.addFields(
						{name: 'MyAnimeList Score', value: String(data[0].score) ?? 'No data found', inline: true},
						{name: 'Runtime', value: data[0].duration, inline: true},
						{name: 'Synopsis', value: trim(data[0].synopsis, 1024) ?? 'No data found'},
						{name: 'Type', value: data[0].type ?? 'No data found', inline: true},
						{name: 'Episodes', value: String(data[0].episodes) ?? 'No data found', inline: true},
					)
					.setImage(data[0].images.jpg.image_url)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress and MyAnimeList.net', iconURL: 'attachment://icon.png'});

				if (data[0].genres.length > 0) {
					embed.addFields(
						{name: 'Genre(s)', value: data[0].genres.map(genres => genres.name).join(', '), inline: true},
					);
				}
				else {
					embed.addFields(
						{name: 'Genre(s)', value: 'No data found', inline: true},
					);
				}

				await interaction.editReply({embeds: [embed], files: [icon]});
			}

			if (interaction.options.getSubcommand() == 'randdog') {
				const result = await request('https://random.dog/woof.json');
				const data = await result.body.json();

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setImage(data.url)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress and random.dog', iconURL: 'attachment://icon.png'});

				await interaction.editReply({embeds: [embed], files: [icon]});
			}

			if (interaction.options.getSubcommand() == 'randcat') {
				const result = await request('https://shibe.online/api/cats?count=1');
				const data = await result.body.json();

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setImage(data[0])
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress and shibe.online', iconURL: 'attachment://icon.png'});

				await interaction.editReply({embeds: [embed], files: [icon]});
			}
		}
		catch (err) {
			await interaction.editReply(`Cypress encountered an error while handling this request. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};