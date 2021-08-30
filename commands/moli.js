const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const handler = require('../utility/user-handler')

module.exports = {
  data: new SlashCommandBuilder()
      .setName('moli')
      .setDescription('Ovako mozes da zaradis malo novca.'),

  async execute(interaction) {
    const randomNum = Math.floor(Math.random() * 250)

    await handler.changeMoney(interaction.user.id, true, randomNum)

    const embed = new MessageEmbed()
        .setTitle('MOLJENJE')
        .setDescription(`:dollar: | <@${interaction.user.id}>, Neko ti je dao **${randomNum} novca!**!`)
        .setColor('#8CFF00')
        .setTimestamp()
        .setFooter(config.defaultFooter)

    await interaction.reply({embeds: [embed]})
  },
};