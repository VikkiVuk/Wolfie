const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require('../utility/BotModule')
const handler = new BotModule.UserModule()
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Almost all of your account stats in one place.'),
    async execute(interaction) {
        const user = await handler.getUser(interaction.user.id)

        const coins = await user.getkey("money")
        const level = await user.getkey("level")
        const xp = await user.getkey("xp")
        const reqxp = level * 40 + 15
        const daily = await user.checkDaily()

        const embed = new MessageEmbed().setTitle(`STATS`).setDescription(`Almost all of your stats in one place.`).setColor('BLURPLE').setTimestamp().setFooter({text: config.defaultFooter})
            .addField("MONEY", `You have **W$ ${coins}**`, true)
            .addField("LEVEL", `You're at **LVL ${level}**`, true)
            .addField("XP", `You have **${xp}/${reqxp}**`, true)
            .addField("DAILY", `You've **${(daily < 1) ? "CLAIMED" : "NOT CLAIMED"}** your reward for today.`, true)
            .addField("OTHER", `Everything else has it's separate command, you can find them easily.`, true)

        await interaction.reply({embeds: [embed], ephemeral: true})
    },
};