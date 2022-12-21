const { SlashCommandBuilder } = require('discord.js');

function roll(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('picks a number between two given numbers (or 1 to a maximum).')
        .addStringOption(option => 
            option
                .setName('max')
                .setDescription('The upper bound.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('min')
                .setDescription('The lower bound.')
        ),

    async execute(interaction){
        await interaction.reply({ content: 'Rolling...', fetchReply: true });

        const min = interaction.options.getString('min') ?? '1';
        const max = interaction.options.getString('max');

		await interaction.editReply(`Rolling ${min} to ${max} resulted in ${roll(min, max)}.`);
    }
}