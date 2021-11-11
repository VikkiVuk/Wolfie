const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription(`Can't decide? Use this command, Wolfie will randomly pick something for you.`)
        .addStringOption(option => option.setName("option1").setDescription("Option 1").setRequired(true))
        .addStringOption(option => option.setName("option2").setDescription("Option 2").setRequired(true)),

    async execute(interaction) {
        const option1 = interaction.options.getString("option1")
        const option2 = interaction.options.getString("option2")

        let options = []
        options.push(option1)
        options.push(option2)

        const chosen = options[Math.floor(Math.random() * options.length)]

        await interaction.reply({ content: `I choose... **${chosen}**!`});
    },
};