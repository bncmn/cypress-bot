const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require('discord.js');

function convert(timestamp) {
	return Math.round(timestamp / 1000);
}

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
			.setDescription('provides information about the server.')),

	async execute(interaction) {
		const icon = new AttachmentBuilder('./assets/icon.png');

		try {
			if (interaction.options.getSubcommand() == 'user') {
				let target;
				if (interaction.options.getUser('user')) {
					target = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
				}
				else {
					target = interaction.guild.members.cache.get(interaction.user.id);
				}

				const userRoles = target.roles.cache
					.map(role => `\`${role.name}\``)
					.join(', ');

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTitle('User Information')
					.setThumbnail(target.user.avatarURL())
					.addFields(
						{name: 'Name', value: `\`${target.user.tag}\` (ID: \`${target.user.id}\`)`},
						{name: 'Created', value: `<t:${convert(target.user.createdTimestamp)}:D> (<t:${convert(target.user.createdTimestamp)}:R>)`},
						{name: `Nickname in ${interaction.guild.name}`, value: `\`${target.displayName}\``},
						{name: `Joined ${interaction.guild.name}`, value: `<t:${convert(target.joinedTimestamp)}:D> (<t:${convert(target.joinedTimestamp)}:R>)`},
						{name: `Roles in ${interaction.guild.name}`, value: `${userRoles}`},
					)
					.setTimestamp()
					.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

				await interaction.reply({embeds: [embed], files: [icon]});
			}
			else if (interaction.options.getSubcommand() == 'server') {
				const vcs = interaction.guild.channels.cache.filter(channel => channel.type == 2).size;
				const tcs = interaction.guild.channels.cache.filter(channel => channel.type == 0).size;
				const categories = interaction.guild.channels.cache.filter(channel => channel.type == 4).size;
				const roles = interaction.guild.roles.cache.size;

				const embed = new EmbedBuilder()
					.setColor(0xB080FF)
					.setTitle('Server Information')
					.setThumbnail(interaction.guild.iconURL())
					.addFields(
						{name: 'Name', value: `${interaction.guild.name}`},
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

				await interaction.reply({embeds: [embed], files: [icon]});
			}
		}
		catch (err) {
			await interaction.editReply(`Fetching info failed. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};