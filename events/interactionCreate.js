const {Events} = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`[ERROR] No command found matching ${interaction.CommandName}`);
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (err) {
			await interaction.reply({content: `Cypress has encountered an error while executing this command. Please try again.\n\`\`\`\n${err.message}\n\`\`\``, ephemeral: true});
			console.error(err);
		}
	},
};