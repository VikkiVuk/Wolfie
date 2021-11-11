const { MessageEmbed,MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Trello = require('trello')
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('suggest smth for the bot.'),

    async execute(interaction) {
        const row = new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("http://wolfie.vikkivuk.xyz/main/suggest").setLabel("Suggestion site"))
        await interaction.reply({ content: "Click on the button below to go to the suggestion website.", components: [row] })
    },
};