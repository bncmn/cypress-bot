const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('performs administrative actions.')

		.addSubcommand(subcommand => subcommand
			.setName('kick')
			.setDescription('kicks a user from the server.')
			.addUserOption(option => option
				.setName('user')
				.setDescription('The member to kick.')
				.setRequired(true))
			.addStringOption(option => option
				.setName('reason')
				.setDescription('The reason for the kick.')))

		.addSubcommand(subcommand => subcommand
			.setName('ban')
			.setDescription('bans a user from the server.')
			.addUserOption(option => option
				.setName('user')
				.setDescription('The member to ban.')
				.setRequired(true))
			.addStringOption(option => option
				.setName('reason')
				.setDescription('The reason for the ban.')))

		.addSubcommand(subcommand => subcommand
			.setName('timeout')
			.setDescription('mutes the user for a specified amount of time.')
			.addUserOption(option => option
				.setName('user')
				.setDescription('The user to timeout.')
				.setRequired(true))
			.addIntegerOption(option => option
				.setName('length')
				.setDescription('The length (in seconds) of the user\'s timeout. (Setting to 0 removes an existing timeout.)')
				.setRequired(true))
			.addStringOption(option => option
				.setName('reason')
				.setDescription('The reason for the mute.')))

		.addSubcommand(subcommand => subcommand
			.setName('unban')
			.setDescription('removes a ban from a user.')
			.addUserOption(option => option
				.setName('user')
				.setDescription('The member to unban.')
				.setRequired(true))
			.addStringOption(option => option
				.setName('reason')
				.setDescription('The reason for the unban.')))

		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers && PermissionFlagsBits.BanMembers && PermissionFlagsBits.ModerateMembers),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const icon = new AttachmentBuilder('./assets/icon.png');

			const target = interaction.options.getUser('user');
			const reason = interaction.options.getString('reason') ?? 'No reason specified.';
			const length = interaction.options.getInteger('length');

			const embed = new EmbedBuilder()
				.setColor(0xB080FF)
				.setTimestamp()
				.setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'});

			if (interaction.options.getSubcommand() == 'kick') {
				embed
					.setTitle(`${target.tag} has been kicked.`)
					.setThumbnail(target.avatarURL())
					.addFields(
						{name: 'User ID', value: `\`${target.id}\``},
						{name: 'Reason', value: `\`${reason}\``},
						{name: 'Issued by', value: `\`${interaction.user.tag}\``});

				interaction.guild.members.kick(target, {reason: reason});
			}

			if (interaction.options.getSubcommand() == 'ban') {
				embed
					.setTitle(`${target.tag} has been banned.`)
					.setThumbnail(target.avatarURL())
					.addFields(
						{name: 'User ID', value: `\`${target.id}\``},
						{name: 'Reason', value: `\`${reason}\``},
						{name: 'Issued by', value: `\`${interaction.user.tag}\``});

				interaction.guild.members.ban(target, {reason: reason});
			}

			if (interaction.options.getSubcommand() == 'timeout') {
				if (length == '0') {
					embed
						.setTitle(`${target.tag} has been unmuted.`)
						.setThumbnail(target.avatarURL())
						.addFields(
							{name: 'Issued by', value: `\`${interaction.user.tag}\``});

					interaction.guild.members.fetch(target)
						.then(member => member.timeout(null));
				}
				else {
					embed
						.setTitle(`${target.tag} has been muted.`)
						.setThumbnail(target.avatarURL())
						.addFields(
							{name: 'User ID', value: `\`${target.id}\``},
							{name: 'Reason', value: `\`${reason}\``},
							{name: 'Timeout Length (in s)', value: `\`${length}\``},
							{name: 'Issued by', value: `\`${interaction.user.tag}\``});

					interaction.guild.members.fetch(target)
						.then(member => member.timeout(parseInt(length * 1000), {reason: reason}));
				}
			}
			if (interaction.options.getSubcommand() == 'unban') {
				embed
					.setTitle(`${target.tag} has been unbanned.`)
					.setThumbnail(target.avatarURL())
					.addFields(
						{name: 'User ID', value: `\`${target.id}\``},
						{name: 'Reason', value: `\`${reason}\``},
						{name: 'Issued by', value: `\`${interaction.user.tag}\``});

				interaction.guild.members.unban(target, {reason: reason});
			}

			await interaction.editReply({embeds: [embed], files: [icon]});
		}
		catch (err) {
			await interaction.editReply(`There was an error trying to issue administrative action. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};