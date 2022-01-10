const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const random = require("../utility/generateRandom")
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate-machine')
        .setDescription('How much are you ______.')
        .addSubcommand(command => command.setName("gay").setDescription("obvious enough"))
        .addSubcommand(command => command.setName("simp").setDescription("obvious enough."))
        .addSubcommand(command => command.setName("stupid").setDescription("obvious enough."))
        .addSubcommand(command => command.setName("toxic").setDescription("obvious enough.")),

    async execute(interaction) {
        const rate = interaction.options.getSubcommand()
        const randomRate = await random.randomNumber(0, 100)


        if (rate === "gay") {
            await interaction.reply({ content: `You are **${randomRate}% ${rate}**` });
        } else {
            await interaction.reply({ content: `You are **${randomRate}% ${rate}**` });
        }
    },
};