const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const BotModule = require('../utility/BotModule')
const handler = new BotModule.UserModule()
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
      const intuser = await handler.getUser(interaction.user.id)
      await intuser.modify("money", randomNum, "ADD")


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