const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('check how much money u have.'),
    async execute(interaction) {
        const user = interaction.user

        const coins = await handler(user.id).then(result => { return result.money })
        const embed = new MessageEmbed().setTitle(`NOVAC`).setDescription(`:dollar: | you currently have **W$ ${coins}**!`).setColor('#32a852').setTimestamp().setFooter(config.defaultFooter)
        await interaction.reply({embeds: [embed], ephemeral: true})
    },
};