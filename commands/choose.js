const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('izaberi')
        .setDescription('Nek ja izaberem nesto od 2 opcije.')
        .addStringOption(option => option.setName("opcija1").setDescription("Opcija 1").setRequired(true))
        .addStringOption(option => option.setName("opcija2").setDescription("Opcija 2").setRequired(true)),

    async execute(interaction) {
        const option1 = interaction.options.getString("opcija1")
        const option2 = interaction.options.getString("opcija2")

        let options = []
        options.push(option1)
        options.push(option2)

        const chosen = options[Math.floor(Math.random() * options.length)]

        await interaction.reply({ content: `Od te dve opcije biram: **${chosen}**`});
    },
};