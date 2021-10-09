const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('novac')
        .setDescription('Proverite koliko vi ili neko drugi ima novca.')
        .addUserOption(option => option.setName('korisnik').setDescription("Kome zelite da vidite novac").setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('korisnik') || interaction.user

        const coins = await handler(user.id).then(result => { return result.money })

        if (user.id === interaction.user.id) {
            const embed = new MessageEmbed().setTitle(`NOVAC`).setDescription(`:dollar: | Trenutno imas **W$ ${coins}**!`).setColor('#32a852').setTimestamp().setFooter(config.defaultFooter)
            await interaction.reply({embeds: [embed]})
        } else {
            const embed = new MessageEmbed().setTitle(`NOVAC`).setDescription(`:dollar: | Korisnik <@${user.id}> ima **W$ ${coins}**!`).setColor('#32a852').setTimestamp().setFooter(config.defaultFooter)
            await interaction.reply({embeds: [embed]})
        }
    },
};