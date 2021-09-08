const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const handler = require('../utility/user-handler')
const talkedRecently = []

module.exports = {
  data: new SlashCommandBuilder()
      .setName('moli')
      .setDescription('Ovako mozes da zaradis malo novca.'),

  async execute(interaction) {
    if (talkedRecently.includes(interaction.user.id)) {
      interaction.reply({ content: `Alou! Stop it, chill outaj. Znaci P L Z, sacekaj tvojih 10 sekundi pre nego sto ponovo komandu pokrenes.`})
    } else {
      const randomNum = Math.floor(Math.random() * 250)

      await handler(interaction.user.id).then(async () => { await handler.changeMoney(interaction.user.id, true, randomNum) })

      const embed = new MessageEmbed()
          .setTitle('MOLJENJE')
          .setDescription(`:dollar: | <@${interaction.user.id}>, Neko ti je dao **${randomNum} novca!**!`)
          .setColor('#8CFF00')
          .setTimestamp()
          .setFooter(config.defaultFooter)

      await interaction.reply({embeds: [embed]})

      talkedRecently.push(interaction.user.id);
      setTimeout(() => {
        const index = talkedRecently.indexOf(interaction.user.id)
        talkedRecently.splice(index)
      }, 10000);

    }
  },
};