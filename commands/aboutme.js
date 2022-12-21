const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aboutme')
        .setDescription('provides information about the user.'),

    async execute(interaction){
        await interaction.reply(`${interaction.user.username} triggered this command. They joined this server on ${interaction.member.joinedAt}.`);
    }
}