const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const random = require("../utility/generateRandom")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate-masina')
        .setDescription('Izmerite koliko ste vi ______.')
        .addSubcommand(command => command.setName("gay").setDescription("Ja cu vas oceniti koliko ste vi gay."))
        .addSubcommand(command => command.setName("simp").setDescription("Ja cu vas oceniti koliko ste vi simp."))
        .addSubcommand(command => command.setName("stupid").setDescription("Ja cu vas oceniti koliko ste vi glupi."))
        .addSubcommand(command => command.setName("toxic").setDescription("Ja cu vas oceniti koliko ste vi toxic.")),

    async execute(interaction) {
        const rate = interaction.options.getSubcommand()
        const randomRate = await random.randomNumber(0, 100)

        await interaction.reply({ content: `Ti si **${randomRate}% ${rate}**` });
    },
};