const {Events} = require('discord.js');
const {EmbedBuilder, AttachmentBuilder} = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		function containsChampion(inputString) {
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

			return champions.some(champion => inputString.toLowerCase().includes(champion.toLowerCase()));
		}

		// Regex is hardcoded as this is mainly for an april fools event.
		// filterRegex can be changed to something else (must be a regex).
		// eslint-disable-next-line no-control-regex, no-useless-escape
		const filterRegex = new RegExp(/\b([Ll]([Ee]{1,2}|[Ee]?[Gg])([Uu][Ee])?(\s+[Oo][Ff]\s+[Ll][Ee][Gg][Ee][Nn][Dd][Ss])?|[Ll][Ee][Aa]*[Gg][Uu][Ee]|[Ll][Oo][Ll]|[Ll][Ee][Ee][Gg]|l(?:3[e3]g|3(?:[e3]|[a4]g|agu[e3])|[1i]33g)?|\b[Ll][Ee][Gg]?[Ee]?\b|\b[Ll][Gg][Ee]?\b|\blg of lgnds\b)\b/gm);

		// Checking mentions is also part of the april fools event.
		if (filterRegex.test(message.content) || message.mentions.roles.has('704075301147115552') || containsChampion(message.content)) {
			console.log(`[LOG] ${message.author.tag} triggered a regex filter or has mentioned a role covered by the regex.`);

			try {
				const target = await message.guild.members.fetch(message.member);

				const icon = new AttachmentBuilder('./assets/icon.png');
				const embed = new EmbedBuilder()
					.setTitle(`${message.author.tag} has been muted for 60 seconds.`)
					.setThumbnail(target.user.avatarURL())
					.setDescription(`As of April 1, 2023, discussion about League of Legends has been prohibited in this server. Please read the announcements channel for more info.\n
                           This bot operates based on pre-configured filters, and may not be 100% accurate. If you believe this was an error, please let the bot's developer know.`)
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
	},
};