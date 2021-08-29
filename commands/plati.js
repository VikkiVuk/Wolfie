const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const economy = require("../utility/economy.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plati')
        .setDescription('Ovo je komanda za testiranje uglavnom.')
        .addUserOption(option => option.setName("korisnik").setDescription("Kome zelis da das novac?").setRequired(true))
        .addIntegerOption(option => option.setName("koliko").setDescription("Koliko novca zelis da das?").setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser("korisnik")
        const amnt = interaction.options.getInteger("koliko")

        await economy.removeCoins(interaction.guildId, interaction.user.id, amnt)
        await economy.addCoins(interaction.guildId, user.id, amnt)

        await interaction.reply(`✅ Uspesno si poslao **${amnt} novca** korisniku <@${user.id}>.`);
    },
};