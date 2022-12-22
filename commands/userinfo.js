const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

function convert(timestamp){
	return Math.round(timestamp / 1000);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('provides information about the user.'),

    async execute(interaction){
        const icon = new AttachmentBuilder('./assets/icon.png');
        const userRoles = interaction.member.roles.cache
                            .map(role => `\`${role.name}\``)
                            .join(", ");

        const embed = new EmbedBuilder()
				.setColor(0x0099FF)
                .setTitle('User Information')
                .setThumbnail(`${interaction.user.avatarURL()}`)
                .addFields(
					{name: 'Name', value: `\`${interaction.user.tag}\` (ID: \`${interaction.user.id}\`)`},
					{name: 'Created', value: `<t:${convert(interaction.user.createdTimestamp)}:D> (<t:${convert(interaction.user.createdTimestamp)}:R>)`},
					{name: `Nickname in ${interaction.guild.name}`, value: `\`${interaction.member.nickname}\``},
					{name: `Joined ${interaction.guild.name}`, value: `<t:${convert(interaction.member.joinedTimestamp)}:D> (<t:${convert(interaction.member.joinedTimestamp)}:R>)`},
					{name: `Roles in ${interaction.guild.name}`, value: `${userRoles}`},
                )
                .setTimestamp()
                .setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'})

		await interaction.reply({embeds: [embed], files: [icon]});
    }
}