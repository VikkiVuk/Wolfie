const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const handler = new BotModule.UserModule()
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
      .setName('note')
      .setDescription('share your deepest and darkest secrets in here'),

  async execute(interaction) {
    const user = await handler.getUser(`${interaction.user.id}`)
    const note = await user.getkey("note")

    if(!note) {
      await interaction.reply({ content: 'You havent set your note. \n \nPlease use `/set-note` to set a note..', ephemeral: true })
      return
    }

    const notembed = new MessageEmbed()
        .addField('Note: ', `\n\`My Note:\` **${note}**`)
        .setColor("#9e34eb")
        .setTimestamp()
        .setFooter(config.defaultFooter)

    await interaction.reply({embeds: [notembed]})
  },
};