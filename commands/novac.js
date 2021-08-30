const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const economy = require("../utility/economy.js");
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('novac')
        .setDescription('Proverite koliko vi ili neko drugi ima novca.')
        .addUserOption(option => option.setName('korisnik').setDescription("Kome zelite da vidite novac").setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('korisnik') || interaction.user
        const economy = require('../utility/economy.js')

        const coins = await economy.getCoins(interaction.guildId, user.id);

        if (user.id === interaction.user.id) {
            const embed = new MessageEmbed().setTitle(`NOVAC`).setDescription(`:dollar: | Trenutno imas **${coins} novca**!`).setColor('#32a852').setTimestamp().setFooter(config.defaultFooter)
            await interaction.reply({embeds: [embed]})
        } else {
            const embed = new MessageEmbed().setTitle(`NOVAC`).setDescription(`:dollar: | Korisnik <@${user.id}> ima **${coins} novca**!`).setColor('#32a852').setTimestamp().setFooter(config.defaultFooter)
            await interaction.reply({embeds: [embed]})
        }
    },
};