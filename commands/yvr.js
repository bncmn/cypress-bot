const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yvr')
        .setDescription('sends a link to the Vancouver Traveller\'s Guide.'),

    async execute(interaction){
        const icon = new AttachmentBuilder('./assets/icon.png');
        
        const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Vancouver Visitor\'s Guide')
                .setURL('https://tiffxo.notion.site/Vancouver-1930c79e4cf649938fb47156f9d8a06d')
                .setDescription(`Hey <@${interaction.user.id}>! Visiting Vancouver soon? Already here and don't know what to do?\n
                                We have carefully curated a guide in order to make the most out of your stay here in Vancouver!\n
                                The guide is (somewhat) regularly maintained, so keep checking back in for any new activities and places!\n`)
                .addFields(
                    {name: 'Visit the guide:', value: 'https://tiffxo.notion.site/Vancouver-1930c79e4cf649938fb47156f9d8a06d'},
                )
                .setImage('https://i.redd.it/1df66lbrmbw31.jpg')
                .setTimestamp()
                .setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'})

		await interaction.reply({embeds: [embed], files: [icon]});
    }
    
}