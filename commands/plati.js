const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plati')
        .setDescription('Ovo je komanda za testiranje uglavnom.')
        .addUserOption(option => option.setName("korisnik").setDescription("Kome zelis da das novac?").setRequired(true))
        .addIntegerOption(option => option.setName("koliko").setDescription("Koliko novca zelis da das?").setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser("korisnik")
        const amnt = interaction.options.getInteger("koliko")

        await handler.changeMoney(interaction.user.id, false, amnt)
        await handler.changeMoney(user.id, true, amnt)

        await interaction.reply(`✅ Uspesno si poslao **${amnt} novca** korisniku <@${user.id}>.`);
    },
};