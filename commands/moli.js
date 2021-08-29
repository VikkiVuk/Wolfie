const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('moli')
      .setDescription('Ovako mozes da zaradis malo novca.'),

  async execute(interaction) {
    const economy = require('../utility/economy.js')
    const randomNum = Math.floor(Math.random() * 250)

    await economy.addCoins(interaction.guildId, interaction.user.id, randomNum)

    const embed = new MessageEmbed()
        .setTitle('MOLJENJE')
        .setDescription(`:dollar: | <@${interaction.user.id}>, Neko ti je dao **${randomNum} novca!**!`)
        .setColor('#8CFF00')
        .setTimestamp()
        .setFooter('Auto VikkiVuk')

    await interaction.reply({embeds: [embed]})
  },
};