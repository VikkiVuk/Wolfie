const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Make your custom discord embed!')
        .addStringOption(option => option.setName('title').setDescription('What title do you want?').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('What will be the embed description?').setRequired(true))
        .addStringOption(option => option.setName('hexcolor').setDescription('The color of your embed, this should be a hex color.').setRequired(false)),

    async execute(interaction) {
        const title = interaction.options.getString('title')
        const description = interaction.options.getString('description')
        const color = interaction.options.getString('hexcolor')

        let c
        if (color) {
            if (color.includes('#')) {
                c = color
            } else {
                c = "#0077ff"
            }
        } else {
            c = "#0077ff"
        }

        const embed = new MessageEmbed().setTitle(title).setDescription(description).setTimestamp().setFooter("Custom Embed Factory").setColor(c)

        await interaction.reply({ embeds: [embed] });
    },
};