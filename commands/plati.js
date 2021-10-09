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
        if (user.id === interaction.user.id) {
            await interaction.reply({ content: `Ne mozes samom sebi da das novac.` })
            return
        }


        const amnt = interaction.options.getInteger("koliko")

        await handler(interaction.user.id).then(async () => {
            await handler.changeMoney(interaction.user.id, false, amnt)
        })

        await handler(user.id).then(async() => {
            await handler.changeMoney(user.id, true, amnt)
        })

        await interaction.reply(`✅ Uspesno si poslao **W$ ${amnt}** korisniku <@${user.id}>.`);
    },
};