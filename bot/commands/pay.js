const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/BotModule')
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('give someone MONEY MONEY MONEY.')
        .addUserOption(option => option.setName("user").setDescription("who do you want to give money?").setRequired(true))
        .addIntegerOption(option => option.setName("amount").setDescription("how much do you want to give them?").setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser("user")
        if (user.id === interaction.user.id) {
            await interaction.reply({ content: `ugh, we've been over this, YOU CANT GIVE YOURSELF MONEY.` })
            return
        }


        const amnt = interaction.options.getInteger("amount")

        await handler(interaction.user.id).then(async () => {
            await handler.modify(interaction.user.id, "money", amnt, "remove")
        })

        await handler(user.id).then(async() => {
            await handler.modify(user.id, "money", amnt, "add")
        })

        await interaction.reply(`✅ You sent **W$ ${amnt}** to <@${user.id}>.`);
    },
};