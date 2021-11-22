const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const handler = require('../utility/BotModule')
const talkedRecently = []

module.exports = {
  data: new SlashCommandBuilder()
      .setName('beg')
      .setDescription('Beg people for money, since obviously you dont have any.'),

  async execute(interaction) {
    if (talkedRecently.includes(interaction.user.id)) {
      interaction.reply({ content: `chill out there bruh, wait for the cooldown to end.`})
    } else {
      const randomNum = Math.floor(Math.random() * 250)

      await handler(interaction.user.id).then(async () => { await handler.changeMoney(interaction.user.id, true, randomNum) })

      const embed = new MessageEmbed()
          .setTitle('BEGGING')
          .setDescription(`:dollar: | <@${interaction.user.id}>, someone gave you **W$ ${randomNum}!**!`)
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