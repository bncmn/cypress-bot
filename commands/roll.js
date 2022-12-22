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
        .addIntegerOption(option => 
            option
                .setName('max')
                .setDescription('The upper bound.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('min')
                .setDescription('The lower bound.')
        ),

    async execute(interaction){
        await interaction.reply({ content: 'Rolling...', fetchReply: true });

        try{
            const min = interaction.options.getInteger('min') ?? '1';
            const max = interaction.options.getInteger('max');

            await interaction.editReply(`I rolled a ${roll(min, max)}. (${min} to ${max})`);
        } 
        catch(err){
            await interaction.editReply(`There was an error trying to roll. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
            console.error(err);
        }

    }
}