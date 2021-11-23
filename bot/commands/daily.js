const { MessageEmbed, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const botmodule = require('../utility/BotModule')
const {randomNumber} = require("../utility/generateRandom");
const handler = new botmodule.UserModule()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward.'),

    async execute(interaction) {
        const intuser = await handler.getUser(`${interaction.user.id}`)

        const diffdays = await intuser.checkDaily()

        if (diffdays < 1) {
            // A day hasnt passed yet.
            await interaction.reply({ content: "Don't be so greedy, a day still hasn't passed from the last daily reward." })
        } else if (diffdays >= 1 && diffdays < 2) {
            // A day has passed.
            await intuser.modify("daily", Date.now(), "SET")
            const randMoney = await randomNumber(1000, 5000)
            const randXP = await randomNumber(10, 50)

            await intuser.modify("money", randMoney, "ADD")
            await intuser.modify("xp", randXP, "ADD")

            await interaction.reply({ content: `You have claimed your daily reward of **W$ ${randMoney}** and **${randXP} xp**. \n \nSince it hasn't been more than a day, your streak is still intact!` })
        } else {
            // 2 days or more has passed.
            await intuser.modify("daily", Date.now(), "SET")
            const randMoney = await randomNumber(1000, 5000)
            const randXP = await randomNumber(10, 50)

            await intuser.modify("money", randMoney, "ADD")
            await intuser.modify("xp", randXP, "ADD")

            await interaction.reply({ content: `You have claimed your daily reward of **W$ ${randMoney}** and **${randXP} xp**. \n \nYour streak has been lost.` })
        }
    },
};