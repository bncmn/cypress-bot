const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const {PasteClient, Publicity, ExpireDate} = require('pastebin-api');
const client = new PasteClient(process.env.pastebin_key);

function convert(timestamp) {
	return Math.round(timestamp / 1000);
}

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('provides information about a user or a server.')

		.addSubcommand(subcommand => subcommand
			.setName('user')
			.setDescription('provides information about a user.')
			.addUserOption(option => option
				.setName('target')
				.setDescription('User to get information about. (Leave blank for yourself)')))

		.addSubcommand(subcommand => subcommand
			.setName('server')
			.setDescription('provides information about the server.'))

		.addSubcommand(subcommand => subcommand
			.setName('whois')
			.setDescription('lists users in the server with a role.')
			.addRoleOption(option => option
				.setName('role')
				.setDescription('The role to list.')
				.setRequired(true)))

		.addSubcommand(subcommand => subcommand
			.setName('aggregatedmembers')
			.setDescription('lists members in ascending order by join/creation date.')),

	async execute(interaction) {
		await interaction.deferReply();

		const icon = new AttachmentBuilder('./assets/icon.png');

		try {
			if (interaction.options.getSubcommand() == 'user') {
				await interaction.guild.fetch();

				let target;
				if (interaction.options.getUser('target')) {
					target = interaction.guild.members.cache.get(interaction.options.getUser('target').id);
				}
				else {
					target = interaction.guild.members.cache.get(interaction.user.id);
				}

				const userRoles = target.roles.cache
					.map(role => `\`${role.name}\``)
					.join('\n');

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTitle('User Information')
					.setThumbnail(target.user.avatarURL())
					.addFields(
						{name: 'Name', value: `\`${target.user.tag}\` (ID: \`${target.user.id}\`)`},
						{name: 'Created', value: `<t:${convert(target.user.createdTimestamp)}:D> (<t:${convert(target.user.createdTimestamp)}:R>)`},
						{name: `Nickname in ${interaction.guild.name}`, value: `\`${target.displayName}\``},
						{name: `Joined ${interaction.guild.name}`, value: `<t:${convert(target.joinedTimestamp)}:D> (<t:${convert(target.joinedTimestamp)}:R>)`},
						{name: `Roles in ${interaction.guild.name}`, value: userRoles},
					)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

				await interaction.editReply({embeds: [embed], files: [icon]});
			}

			if (interaction.options.getSubcommand() == 'server') {
				const vcs = interaction.guild.channels.cache.filter(channel => channel.type == 2).size;
				const tcs = interaction.guild.channels.cache.filter(channel => channel.type == 0).size;
				const categories = interaction.guild.channels.cache.filter(channel => channel.type == 4).size;
				const roles = interaction.guild.roles.cache.size;

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTitle('Server Information')
					.setThumbnail(interaction.guild.iconURL())
					.addFields(
						{name: 'Name', value: interaction.guild.name},
						{name: 'Owner', value: `<@${interaction.guild.ownerId}> (ID: \`${interaction.guild.ownerId}\`)`},
						{name: 'Created', value: `<t:${convert(interaction.guild.createdTimestamp)}> (<t:${convert(interaction.guild.createdTimestamp)}:R>)`},
						{name: 'Member Count', value: `\`${interaction.guild.memberCount}\``, inline: true},
						{name: 'Role Count', value: `\`${roles}\``, inline: true},
						{name: '\u200b', value: '\u200b', inline: true},
						{name: 'Boost Count', value: `\`${interaction.guild.premiumSubscriptionCount}\` (Boost Level ${interaction.guild.premiumTier})`},
						{name: 'Channel Count', value: `\`${vcs + tcs}\` total channels in \`${categories}\` categories\n\`${vcs}\` voice channels\n\`${tcs}\` text channels`},
					)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

				await interaction.editReply({embeds: [embed], files: [icon]});
			}

			if (interaction.options.getSubcommand() == 'whois') {
				const role = interaction.options.getRole('role');

				await interaction.guild.members.fetch();
				const roleMembers = interaction.guild.roles.cache.get(role.id)
					.members.map(member => `\`${member.user.tag}\``)
					.join('\n');

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

				if (roleMembers.length < 1024) {
					embed
						.setTitle(`Members of ${role.name}`)
						.setThumbnail(interaction.guild.iconURL())
						.addFields(
							{name: 'Role', value: `${role}`, inline: true},
							{name: 'Count', value: String(interaction.guild.roles.cache.get(role.id).members.size), inline: true},
							{name: 'Members', value: trim(roleMembers, 1024)});
				}
				else {
					try {
						const pasteLink = await client.createPaste({
							code: roleMembers,
							expireDate: ExpireDate.OneHour,
							format: 'gettext',
							name: 'Role Members List',
							publicity: Publicity.Unlisted,
						});

						embed
							.setTitle(`Members of ${role.name}`)
							.setThumbnail(interaction.guild.iconURL())
							.addFields(
								{name: 'Role', value: `${role}`, inline: true},
								{name: 'Count', value: String(interaction.guild.roles.cache.get(role.id).members.size), inline: true},
								{name: 'Members', value: pasteLink})
							.setFooter({text: 'Powered by Cypress and Pastebin', iconURL: 'attachment://icon.png'});
					}
					catch (err) {
						await interaction.editReply(`There was an error trying to fetch the members of this role. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
						console.error(err);
					}
				}

				await interaction.editReply({embeds: [embed], files: [icon]});
			}

			if (interaction.options.getSubcommand() == 'aggregatedmembers') {
				await interaction.guild.members.fetch();
				const membersByJoined = interaction.guild.members.cache
					.sort(function(a, b) {return a.joinedTimestamp - b.joinedTimestamp;})
					.map(member => `${member.user.tag} - ${new Date(member.joinedTimestamp)}`)
					.join('\n');

				const linkByJoined = await client.createPaste({
					code: membersByJoined,
					expireDate: ExpireDate.OneHour,
					format: 'gettext',
					name: 'Members by Join Date',
					publicity: Publicity.Unlisted,
				});

				const membersByCreated = interaction.guild.members.cache
					.sort(function(a, b) {return a.user.createdTimestamp - b.user.createdTimestamp;})
					.map(member => `${member.user.tag} - ${new Date(member.user.createdTimestamp)}`)
					.join('\n');

				const linkByCreated = await client.createPaste({
					code: membersByCreated,
					expireDate: ExpireDate.OneHour,
					format: 'gettext',
					name: 'Members by Account Age',
					publicity: Publicity.Unlisted,
				});

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress and Pastebin', iconURL: 'attachment://icon.png'})
					.setTitle('Aggregated List of Members')
					.setThumbnail(interaction.guild.iconURL())
					.addFields(
						{name: 'By Join Date', value: linkByJoined},
						{name: 'By Creation Date', value: linkByCreated});

				await interaction.editReply({embeds: [embed], files: [icon]});
			}
		}
		catch (err) {
			await interaction.editReply(`Fetching info failed. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};