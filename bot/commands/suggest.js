const {MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest a feature or a fix for the bot!'),

    async execute(interaction) {
        let actionrow1 = new MessageActionRow().addComponents(
            new TextInputComponent().setLabel("Your Name").setPlaceholder("John Doe").setStyle("SHORT").setCustomId("name").setRequired(false)
        )

        let actionrow2 = new MessageActionRow().addComponents(
            new TextInputComponent().setLabel("Type").setPlaceholder("Feature / Fix / Other").setStyle("SHORT").setCustomId("type").setRequired(true).setMaxLength(7).setMinLength(3)
        )

        let actionrow3 = new MessageActionRow().addComponents(
            new TextInputComponent().setLabel("Request").setPlaceholder("Type your inquiry here").setStyle("PARAGRAPH").setCustomId("request").setRequired(true)
        )

        let modal = new Modal().addComponents(actionrow1, actionrow2, actionrow3).setTitle("Suggestion Form").setCustomId("suggestion")
        await interaction.showModal(modal)
    },
};