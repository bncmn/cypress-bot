const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('provides information about the server.'),

	async execute(interaction){
		const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Server Information')
                .setAuthor({name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}`})
                //.setDescription(`${interaction.guild.description}`)
                .addFields(
                    {name: 'Members:', value: `${interaction.guild.memberCount}`},
					{name: 'Created:', value: `${interaction.guild.createdAt}`},
					{name: 'Owner:', value: `<@${interaction.guild.ownerId}>`}
                )
                .setImage(`${interaction.guild.bannerURL()}`)
                .setTimestamp()
                .setFooter({text: 'Powered by Cypress', iconURL: 'https://cdn.discordapp.com/avatars/524785352247083029/6df9128c69fc53c37c723f8c20ec893f.webp'})

		await interaction.reply({embeds: [embed]});
	}
};