const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

function convert(timestamp){
	return Math.round(timestamp / 1000);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('provides information about the user.')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('User to get information about.')),

    async execute(interaction){
        const icon = new AttachmentBuilder('./assets/icon.png');

        var target;
        if(interaction.options.getUser('user')){
            target = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
        }
        else{ 
            target = interaction.guild.members.cache.get(interaction.user.id)
        }
        
        const userRoles = target.roles.cache
                            .map(role => `\`${role.name}\``)
                            .join(", ");

        const embed = new EmbedBuilder()
				.setColor(0x0099FF)
                .setTitle('User Information')
                .setThumbnail(`${target.user.avatarURL()}`)
                .addFields(
					{name: 'Name', value: `\`${target.user.tag}\` (ID: \`${target.user.id}\`)`},
					{name: 'Created', value: `<t:${convert(target.user.createdTimestamp)}:D> (<t:${convert(target.user.createdTimestamp)}:R>)`},
					{name: `Nickname in ${interaction.guild.name}`, value: `\`${target.displayName}\``},
					{name: `Joined ${interaction.guild.name}`, value: `<t:${convert(target.joinedTimestamp)}:D> (<t:${convert(target.joinedTimestamp)}:R>)`},
					{name: `Roles in ${interaction.guild.name}`, value: `${userRoles}`},
                )
                .setTimestamp()
                .setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'})

		await interaction.reply({embeds: [embed], files: [icon]});
    }
}