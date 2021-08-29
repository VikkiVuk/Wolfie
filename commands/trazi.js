const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const economy = require("../utility/economy.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trazi')
        .setDescription('Ovako mozes da trazis za novac, daje malo vise od moljenja.'),
    async execute(interaction) {
        const economy = require('../utility/economy.js')
        const random = require('../utility/generateRandom.js')

        const isLucky = Math.random() < 0.6
        if (isLucky == 1) {
            const randomNum = Math.floor(Math.random() * (2500 - 300) + 300)

            await economy.addCoins(interaction.guildId, interaction.user.id, randomNum)

            const embed = new MessageEmbed()
                .setTitle('TRAZENJE')
                .setDescription(`:dollar: | <@${interaction.user.id}>, Posrecilo ti se i dobio si **${randomNum} novca**!`)
                .setColor('#2FFF0F')
                .setTimestamp()
                .setFooter('Auto VikkiVuk')

            await interaction.reply({embeds: [embed]})
        } else {
            const randomNum = Math.floor(Math.random() * (1500 - 300) + 300)

            await economy.removeCoins(interaction.guildId, interaction.user.id, randomNum)

            const embed = new MessageEmbed()
                .setTitle('TRAZENJE')
                .setDescription(`:dollar: | <@${interaction.user.id}>, Nisi bio srecan i izgubio si **${randomNum} novca**!`)
                .setColor('#fc0303')
                .setTimestamp()
                .setFooter('Auto VikkiVuk')

            await interaction.reply({embeds: [embed]})
        }

    },
};