const { MessageEmbed, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const {randomNumber} = require("../utility/generateRandom");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Ovako mozete da dobijete vase nagrade za danas.'),

    async execute(interaction) {
        await handler(interaction.user.id)

        const diffdays = await handler.checkDaily(interaction.user.id)

        if (diffdays < 1) {
            // A day hasnt passed yet.
            await interaction.reply({ content: "Jos uvek nije prosao dan od tvoje zadnje nagrade." })
        } else if (diffdays >= 1) {
            // A day or more has passed.
            await handler.updateDaily(interaction.user.id)
            const randMoney = await randomNumber(1000, 5000)
            const randXP = await randomNumber(10, 50)

            await handler.changeMoney(interaction.user.id, true, randMoney)
            await handler.changeXP(interaction.user.id, true, randXP)

            await interaction.reply({ content: `Uspesno si claimovao svoj daily reward od **W$ ${randMoney}** i **${randXP} xp-a**.` })
        }
    },
};