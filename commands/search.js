const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const {request} = require('undici');
const wiki = require('wikipedia');
require('dotenv').config();

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

function degToCompass(num) {
	const val = Math.floor((num / 22.5) + 0.5);
	const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	return arr[(val % 16)];
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('makes an API request from a website.')

		.addSubcommand(subcommand => subcommand
			.setName('anime')
			.setDescription('retrieves the MyAnimeList entry for an anime.')
			.addStringOption(option => option
				.setName('title')
				.setDescription('The title of the anime.')
				.setRequired(true)))

		.addSubcommand(subcommand => subcommand
			.setName('weather')
			.setDescription('retrieves the weather for a city.')
			.addStringOption(option => option
				.setName('city')
				.setDescription('The city to be searched.')
				.setRequired(true)))

		.addSubcommand(subcommand => subcommand
			.setName('wikipedia')
			.setDescription('retrieves a Wikipedia listing.')
			.addStringOption(option => option
				.setName('term')
				.setDescription('The term to search in Wikipedia.')
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

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTitle(data[0].title)
					.setURL(data[0].url)
					.addFields(
						{name: 'MyAnimeList Score', value: String(data[0].score ?? 'No data found'), inline: true},
						{name: 'Runtime', value: data[0].duration ?? 'No data found', inline: true},
						{name: 'Synopsis', value: trim(data[0].synopsis ?? 'No data found', 1024)},
						{name: 'Type', value: data[0].type ?? 'No data found', inline: true},
						{name: 'Episodes', value: String(data[0].episodes ?? 'No data found'), inline: true},
					)
					.setImage(data[0].images.jpg.image_url)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress and MyAnimeList', iconURL: 'attachment://icon.png'});

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

			if (interaction.options.getSubcommand() == 'weather') {
				const openweatherlogo = new AttachmentBuilder('./assets/openweatherlogo.png');
				const city = interaction.options.getString('city');

				const query = new URLSearchParams([
					['q', city],
					['appid', process.env.openweather_key],
				]);
				const result = await request(`https://api.openweathermap.org/data/2.5/weather?${query}`);
				const data = await result.body.json();

				if (data.cod == 200) {
					const embed = new EmbedBuilder()
						.setColor(0xB080FF)
						.setTitle(data.name)
						.setURL(`https://openweathermap.org/city/${data.id}`)
						.setThumbnail('attachment://openweatherlogo.png')
						.addFields(
							{name: 'Current Conditions', value: `**${data.weather[0].main}.** ${data.weather[0].description}.`},
							{name: 'Temperature', value: `${String(Math.round(data.main.temp - 273.15))}\u00B0C (${String(Math.round(((data.main.temp - 273.15) * 1.8) + 32))}\u00B0F)`, inline: true},
							{name: 'Feels Like', value: `${String(Math.round(data.main.feels_like - 273.15))}\u00B0C (${String(Math.round(((data.main.feels_like - 273.15) * 1.8) + 32))}\u00B0F)`, inline: true},
							{name: '\u200b', value: '\u200b', inline: true},
							{name: 'Daily Low', value: `${String(Math.round(data.main.temp_min - 273.15))}\u00B0C (${String(Math.round(((data.main.temp_min - 273.15) * 1.8) + 32))}\u00B0F)`, inline: true},
							{name: 'Daily High', value: `${String(Math.round(data.main.temp_max - 273.15))}\u00B0C (${String(Math.round(((data.main.temp_max - 273.15) * 1.8) + 32))}\u00B0F)`, inline: true},
							{name: '\u200b', value: '\u200b', inline: true},
							{name: 'Visibility', value: `${data.visibility / 1000}km`},
							{name: 'Wind', value: `${data.wind.speed}m/s ${degToCompass(data.wind.deg)}`},
							{name: 'Humidity', value: `${data.main.humidity}%`})
						.setTimestamp()
						.setFooter({text: 'Powered by Cypress and OpenWeather', iconURL: 'attachment://icon.png'});

					if (data.rain) {
						embed.addFields({name: 'Rain (hourly)', value: `${data.rain['1h'] ?? 0}mm`});
					}
					if (data.snow) {
						embed.addFields({name: 'Snow (hourly)', value: `${data.snow['1h'] ?? 0}mm`});
					}

					await interaction.editReply({embeds: [embed], files: [icon, openweatherlogo]});
				}
				else {
					await interaction.editReply('No data found for this location. To make a search more precise, put the city\'s name and the 2-letter country code (ISO3166), separated by a comma.');
				}
			}

			if (interaction.options.getSubcommand() == 'wikipedia') {
				const term = interaction.options.getString('term');

				try {
					const summary = await wiki.summary(term);

					const embed = new EmbedBuilder()
						.setAuthor({name: 'Wikipedia'})
						.setTitle(summary.title)
						.setURL(summary.content_urls.desktop.page)
						.setImage(summary.originalimage.source)
						.setDescription(summary.extract)
						.setTimestamp()
						.setFooter({text: 'Powered by Cypress and Wikipedia', iconURL: 'attachment://icon.png'});

					await interaction.editReply({embeds: [embed], files: [icon]});
				}
				catch (err) {
					await interaction.editReply('error');
					console.error(err);
				}
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