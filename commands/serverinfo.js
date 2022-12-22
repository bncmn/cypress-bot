const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

function convert(timestamp){
	return Math.round(timestamp / 1000);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('provides information about the server.'),

	async execute(interaction){
        const icon = new AttachmentBuilder('./assets/icon.png');
        const vcs = interaction.guild.channels.cache.filter(channel => channel.type == 2).size;
        const tcs = interaction.guild.channels.cache.filter(channel => channel.type == 0).size;
        const categories = interaction.guild.channels.cache.filter(channel => channel.type == 4).size;
        const roles = interaction.guild.roles.cache.size;

		const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Server Information')
                .setThumbnail(`${interaction.guild.iconURL()}`)
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
                .setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'})

		await interaction.reply({embeds: [embed], files: [icon]});
	}
};