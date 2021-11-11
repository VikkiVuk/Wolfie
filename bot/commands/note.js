const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
      .setName('mnote')
      .setDescription('Your own and personal note that no one except you can read.'),

  async execute(interaction) {
    await handler(interaction.user.id)

    const note = await handler(interaction.user.id).then(result => { return result.note })

    if(!note) {
      await interaction.reply({ content: 'You havent sent your note. \n \nPlease use `/set-note` to set a note..', ephemeral: true })
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