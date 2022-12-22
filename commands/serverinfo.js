const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

function convert(timestamp){
	return Math.round(timestamp / 1000);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('provides information about the server.'),

	async execute(interaction){
        const vcs = interaction.guild.channels.cache.filter(channel => channel.type == 2).size;
        const tcs = interaction.guild.channels.cache.filter(channel => channel.type == 0).size;
        const categories = interaction.guild.channels.cache.filter(channel => channel.type == 4).size;
        const roles = interaction.guild.roles.cache.size;

		const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Server Information')
                .setAuthor({name: `${interaction.guild.name}`})
                .setThumbnail(`${interaction.guild.iconURL()}`)
                .addFields(
					{name: 'Owner:', value: `<@${interaction.guild.ownerId}> (ID: \`${interaction.guild.ownerId}\`)`},
                    {name: 'Created:', value: `<t:${convert(interaction.guild.createdTimestamp)}> (<t:${convert(interaction.guild.createdTimestamp)}:R>)`},
                    {name: 'Member Count:', value: `\`${interaction.guild.memberCount}\``, inline: true},
                    {name: 'Role Count:', value: `\`${roles}\``, inline: true},
                    {name: '\u200b', value: '\u200b', inline: true},
                    {name: 'Boost Count:', value: `\`${interaction.guild.premiumSubscriptionCount}\` (Boost Level ${interaction.guild.premiumTier})`},
                    {name: 'Channel Count:', value: `\`${vcs + tcs}\` total channels in \`${categories}\` categories\n\`${vcs}\` voice channels\n\`${tcs}\` text channels`},
                )
                .setTimestamp()
                .setFooter({text: 'Powered by Cypress', iconURL: 'https://cdn.discordapp.com/avatars/524785352247083029/6df9128c69fc53c37c723f8c20ec893f.webp'})

		await interaction.reply({embeds: [embed]});
	}
};