const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

// A JavaScript implementation of the Fisher-Yates Shuffle
// Code below is obtained from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Minor modifications were made to implement a split for the purposes of this command.
function split(roster, splits){
    let currentIndex = roster.length, randomIndex;
    let resSplits = [];

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [roster[currentIndex], roster[randomIndex]] = [roster[randomIndex], roster[currentIndex]];
    }

    while (roster.length > 0) {
        const split = roster.splice(0, splits);
        resSplits.push(split);
    }

    return resSplits;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('teamsplit')
		.setDescription('splits the people in your voice call into teams of a given number. (Default is 5)')
        .addIntegerOption(option => 
            option
                .setName('teams')
                .setDescription('Number of teams to make.')
        ),

	async execute(interaction){ 
        await interaction.reply({ content: 'Generating teams...', fetchReply: true });

        try{
            const icon = new AttachmentBuilder('./assets/icon.png');

            const vcMembers = interaction.member.voice.channel.members
                                .map(member => member.displayName);
            const teams = interaction.options.getInteger('teams') ?? 5;
            const res = split(vcMembers, teams);

            const embed = new EmbedBuilder()
				.setColor(0x0099FF)
                .setTitle('Generated Teams')
                .setThumbnail(`${interaction.guild.iconURL()}`)
                .setTimestamp()
                .setFooter({text: 'Powered by Cypress', iconURL: 'attachment://icon.png'})
            
            res.forEach(element => embed.addFields(
                {name: `Team ${res.indexOf(element) + 1}`, value: element.map(element => `\`${element}\``).join(', ')}
            ))
            
            await interaction.editReply({embeds: [embed], files: [icon]});
        }
        catch(err){
            await interaction.editReply(`There was an error trying to generate teams. Please try again.\n\`\`\`\n${err.message}\n\`\`\``);
            console.error(err);
        }
    }
}
