const {Events} = require('discord.js');
const {EmbedBuilder, AttachmentBuilder} = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		// Regex is hardcoded as this is mainly for an april fools event.
		// filterRegex can be changed to something else (must be a regex).
		// Checking mentions is also part of the april fools event.
		// eslint-disable-next-line no-unused-vars
		function containsReferencesToLeague(inputString) {
			const filterRegex = new RegExp(/\b([Ll]([Ee]{1,2}|[Ee]?[Gg])([Uu][Ee])?(\s+[Oo][Ff]\s+[Ll][Ee][Gg][Ee][Nn][Dd][Ss])?|[Ll][Ee][Aa]*[Gg][Uu][Ee]|[Ll][Oo][Ll]|[Ll][Ee][Ee][Gg]|l(?:3[e3]g|3(?:[e3]|[a4]g|agu[e3])|[1i]33g)?|\b[Ll][Ee][Gg]?[Ee]?\b|\b[Ll][Gg][Ee]?\b|\blg of lgnds\b)\b/gm);
			const champions = [
				'Aatrox',
				'Ahri',
				'Akali',
				'Alistar',
				'Amumu',
				'Anivia',
				'Annie',
				'Aphelios',
				'Ashe',
				'Aurelion Sol',
				'Azir',
				'Bard',
				'Blitzcrank',
				'Brand',
				'Braum',
				'Caitlyn',
				'Camille',
				'Cassiopeia',
				'Cho\'Gath',
				'Corki',
				'Darius',
				'Diana',
				'Dr. Mundo',
				'Draven',
				'Ekko',
				'Elise',
				'Evelynn',
				'Ezreal',
				'Fiddlesticks',
				'Fiora',
				'Fizz',
				'Galio',
				'Gangplank',
				'Garen',
				'Gnar',
				'Gragas',
				'Graves',
				'Hecarim',
				'Heimerdinger',
				'Illaoi',
				'Irelia',
				'Ivern',
				'Janna',
				'Jarvan IV',
				'Jax',
				'Jayce',
				'Jhin',
				'Jinx',
				'Kai\'Sa',
				'Kalista',
				'Karma',
				'Karthus',
				'Kassadin',
				'Katarina',
				'Kayle',
				'Kayn',
				'Kennen',
				'Kha\'Zix',
				'Kindred',
				'Kled',
				'Kog\'Maw',
				'LeBlanc',
				'Lee Sin',
				'Leona',
				'Lillia',
				'Lissandra',
				'Lucian',
				'Lulu',
				'Lux',
				'Malphite',
				'Malzahar',
				'Maokai',
				'Master Yi',
				'Miss Fortune',
				'Mordekaiser',
				'Morgana',
				'Nami',
				'Nasus',
				'Nautilus',
				'Neeko',
				'Nidalee',
				'Nocturne',
				'Nunu & Willump',
				'Olaf',
				'Orianna',
				'Ornn',
				'Pantheon',
				'Poppy',
				'Pyke',
				'Qiyana',
				'Quinn',
				'Rakan',
				'Rammus',
				'Rek\'Sai',
				'Rell',
				'Renekton',
				'Rengar',
				'Riven',
				'Rumble',
				'Ryze',
				'Samira',
				'Sejuani',
				'Senna',
				'Seraphine',
				'Sett',
				'Shaco',
				'Shen',
				'Shyvana',
				'Singed',
				'Sion',
				'Sivir',
				'Skarner',
				'Sona',
				'Soraka',
				'Swain',
				'Sylas',
				'Syndra',
				'Tahm Kench',
				'Taliyah',
				'Talon',
				'Taric',
				'Teemo',
				'Thresh',
				'Tristana',
				'Trundle',
				'Tryndamere',
				'Twisted Fate',
				'Twitch',
				'Udyr',
				'Urgot',
				'Varus',
				'Vayne',
				'Veigar',
				'Vel\'Koz',
				'Vi',
				'Viktor',
				'Vladimir',
				'Volibear',
				'Warwick',
				'Wukong',
				'Xayah',
				'Xerath',
				'Xin Zhao',
				'Yasuo',
				'Yone',
				'Yorick',
				'Yuumi',
				'Zac',
				'Zed',
				'Ziggs',
				'Zilean',
				'Zoe',
				'Zyra',
			];
			const otherTerms = [
				'TFT',
				'ARAM',
				'Summoner\'s Rift',
				'Summoners Rift',
				'Howling Abyss',
				'Teamfight Tactics',
				'Riot Games',
				'Riot',
				'ADC',
				'Rift',
				'gank',
				'legends',
			];

			const booleanReturned =
        champions.some(champion => inputString.toLowerCase().includes(champion.toLowerCase()))
        || otherTerms.some(term => inputString.toLowerCase().includes(term.toLowerCase()))
        || filterRegex.test(inputString)
        || message.mentions.roles.has('704075301147115552');

			return booleanReturned;
		}

		// The filter is currently disabled in its present state, use the next line to enable the filter.
		// if (containsReferencesToLeague(message.content)) {

		// eslint-disable-next-line no-constant-condition
		if (false) {
			console.log(`[LOG] ${message.author.tag} triggered a regex filter or has mentioned a role covered by the regex.`);

			await message.client.application.fetch();
			if (!(message.member.id == '227554246822723595')) {
				try {
					const target = await message.guild.members.fetch(message.member);

					const icon = new AttachmentBuilder('./assets/icon.png');
					const embed = new EmbedBuilder()
						.setTitle(`${message.author.tag} has been timed-out for 60 seconds.`)
						.setThumbnail(target.user.avatarURL())
						.setDescription(`Discussion about League of Legends has been prohibited in this server as of 2023/04/01. Please read the announcements channel for more info.\n
                           This bot uses pre-configured filters to detect League terms, and may not be 100% accurate. If you believe your time-out was an error, please let the Cypress developer know.`)
						.addFields(
							{name: 'User ID', value: `\`${target.id}\``},
							{name: 'Message Contents:', value: `\`\`\`${message}\`\`\``})
						.setColor(0xB080FF)
						.setTimestamp()
						.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});


					message.guild.members.fetch(message.member)
						.then(member => member.timeout(60000, {reason: 'Using a filtered word.'}))
						.catch(function(err) {
							console.error(err);
						});

					message.delete();
					message.channel.send({embeds: [embed], files: [icon]});
				}
				catch (err) {
					console.error(err);
				}
			}
			else {
				console.log(`[LOG] ${message.author.tag} was the owner of the bot and the filter was not applied.`);
			}
		}
	},
};