const { MessageEmbed, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/BotModule')
const {randomNumber} = require("../utility/generateRandom");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward.'),

    async execute(interaction) {
        await handler(interaction.user.id)

        const diffdays = await handler.checkDaily(interaction.user.id)

        if (diffdays < 1) {
            // A day hasnt passed yet.
            await interaction.reply({ content: "Don't be so greedy, a day still hasn't passed from the last daily reward." })
        } else if (diffdays >= 1 && diffdays < 2) {
            // A day has passed.
            await handler.updateDaily(interaction.user.id)
            const randMoney = await randomNumber(1000, 5000)
            const randXP = await randomNumber(10, 50)

            await handler.changeMoney(interaction.user.id, true, randMoney)
            await handler.changeXP(interaction.user.id, true, randXP)

            await interaction.reply({ content: `You have claimed your daily reward of **W$ ${randMoney}** and **${randXP} xp**. \n \nSince it hasn't been more than a day, your streak is still intact!` })
        } else {
            // 2 days or more has passed.
            await handler.updateDaily(interaction.user.id)
            const randMoney = await randomNumber(1000, 5000)
            const randXP = await randomNumber(10, 50)

            await handler.changeMoney(interaction.user.id, true, randMoney)
            await handler.changeXP(interaction.user.id, true, randXP)

            await interaction.reply({ content: `You have claimed your daily reward of **W$ ${randMoney}** and **${randXP} xp**. \n \nYour streak has been lost.` })
        }
    },
};