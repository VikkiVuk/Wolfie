const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require('../utility/BotModule')
const handler = new BotModule.UserModule()
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('check how much money u have.'),
    async execute(interaction) {
        const user = await handler.getUser(interaction.user.id)

        const coins = await user.getkey("money")
        const embed = new MessageEmbed().setTitle(`MONEY`).setDescription(`:dollar: | You currently have **W$ ${coins}**!`).setColor('#32a852').setTimestamp().setFooter(config.defaultFooter)
        await interaction.reply({embeds: [embed], ephemeral: true})
    },
};