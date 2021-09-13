const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require("../utility/user-handler")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('napravi-item')
        .setDescription('Ovako admini mogu da dodaju iteme u prodavnicu.')
        .addStringOption(option => option.setName("ime").setDescription("Ime itema").setRequired(true))
        .addIntegerOption(option => option.setName("cena").setDescription("Cena Itema").setRequired(true)),

    async execute(interaction) {
        const itemname = interaction.options.getString("ime")
        const itemcost = interaction.options.getInteger("cena")

        await handler.addCustomShopItem(itemname, itemcost)
        await interaction.reply({content: `Uspesno si dodao item: **${itemname}** koji kosta **${itemcost} novca**.`})
    },
};