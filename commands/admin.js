const {SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, PermissionFlagsBits} = require('discord.js');
const hastebin = require('hastebin-gen');

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('performs administrative actions.')

		.addSubcommand(subcommand => subcommand
			.setName('kick')
			.setDescription('kicks a user from the server.')
			.addUserOption(option => option
				.setName('user')
				.setDescription('The user to kick.')
				.setRequired(true))
			.addStringOption(option => option
				.setName('reason')
				.setDescription('The reason for the kick.')))

		.addSubcommand(subcommand => subcommand
			.setName('ban')
			.setDescription('bans a user from the server.')
			.addUserOption(option => option
				.setName('user')
				.setDescription('The user to ban.')
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
				.setDescription('The user to unban.')
				.setRequired(true))
			.addStringOption(option => option
				.setName('reason')
				.setDescription('The reason for the unban.')))

		.addSubcommand(subcommand => subcommand
			.setName('whois')
			.setDescription('lists users with the role.')
			.addRoleOption(option => option
				.setName('role')
				.setDescription('The role to list.')
				.setRequired(true)))

		.addSubcommand(subcommand => subcommand
			.setName('addrole')
			.setDescription('adds a role to a user.')
			.addUserOption(option => option
				.setName('user')
				.setDescription('The user to add the role to.')
				.setRequired(true))
			.addRoleOption(option => option
				.setName('role')
				.setDescription('The role to be added.')
				.setRequired(true)))

		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers && PermissionFlagsBits.BanMembers && PermissionFlagsBits.ModerateMembers),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const icon = new AttachmentBuilder('./assets/icon.png');

			const target = interaction.options.getUser('user');
			const reason = interaction.options.getString('reason') ?? 'No reason specified.';

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

				await interaction.editReply({embeds: [embed], files: [icon]});
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

				await interaction.editReply({embeds: [embed], files: [icon]});
			}

			if (interaction.options.getSubcommand() == 'timeout') {
				const length = interaction.options.getInteger('length');

				if (length == '0') {
					embed
						.setTitle(`${target.tag} has been unmuted.`)
						.setThumbnail(target.avatarURL())
						.addFields(
							{name: 'Issued by', value: `\`${interaction.user.tag}\``});

					interaction.guild.members.fetch(target)
						.then(member => member.timeout(null))
						.catch(function(err) {
							interaction.editReply(`There was an error trying to issue administrative action. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
							console.error(err);
						});
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
						.then(member => member.timeout(parseInt(length * 1000), {reason: reason}))
						.catch(function(err) {
							interaction.editReply(`There was an error trying to issue administrative action. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
							console.error(err);
						});

				}

				await interaction.editReply({embeds: [embed], files: [icon]});
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

				await interaction.editReply({embeds: [embed], files: [icon]});
			}

			if (interaction.options.getSubcommand() == 'whois') {
				const role = interaction.options.getRole('role');

				await interaction.guild.members.fetch();

				const roleMembers = interaction.guild.roles.cache.get(role.id)
					.members.map(member => `\`${member.user.tag}\``)
					.join('\n');

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
					const hasteLink = await hastebin(roleMembers, 'txt');

					embed
						.setTitle(`Members of ${role.name}`)
						.setThumbnail(interaction.guild.iconURL())
						.addFields(
							{name: 'Role', value: `${role}`, inline: true},
							{name: 'Count', value: String(interaction.guild.roles.cache.get(role.id).members.size), inline: true},
							{name: 'Members', value: hasteLink})
						.setFooter({text: 'Powered by Cypress and Hastebin', iconURL: 'attachment://icon.png'});
				}


				/* const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('rolesPreviousPage')
							.setLabel('Previous Page')
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('rolesNextPage')
							.setLabel('Next Page')
							.setStyle(ButtonStyle.Primary),
					); */

				await interaction.editReply({embeds: [embed], files: [icon]/* , components: [row] */});

				/* // eslint-disable-next-line no-shadow
				interaction.client.on(Events.InteractionCreate, interaction => {
					if (!interaction.isButton()) return;
					console.log(interaction);
				}); */
			}

			if (interaction.options.getSubcommand() == 'addrole') {
				const role = interaction.options.getRole('role');

				if (role.editable) {
					embed
						.setTitle(`A role has been given to ${target.tag}.`)
						.setThumbnail(target.avatarURL())
						.addFields(
							{name: 'User ID', value: `\`${target.id}\``},
							{name: 'Role', value: `${role}`},
							{name: 'Issued by', value: `\`${interaction.user.tag}\``});

					interaction.guild.members.fetch(target)
						.then(member => member.roles.add(role));
				}
				else {
					throw new Error('Bot\'s role is lower than the role being assigned.');
				}

				await interaction.editReply({embeds: [embed], files: [icon]});
			}
		}
		catch (err) {
			await interaction.editReply(`There was an error while trying to execute this command. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
			console.error(err);
		}
	},
};