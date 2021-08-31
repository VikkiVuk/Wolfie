const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
      .setName('beleske')
      .setDescription('Tvoj sopstevni discord notepad.'),

  async execute(interaction) {
    const note = await handler(interaction.user.id).then(result => { return result.note })

    if(!note) {
      await interaction.reply({ content: 'Ti jos uvek nema nista u beleskama.', ephemeral: true })
      return
    }

    const notembed = new MessageEmbed()
        .addField('Beleska: ', `\n\`Moja Beleska:\` **${note}**`)
        .setColor("#9e34eb")
        .setTimestamp()
        .setFooter(config.defaultFooter)

    await interaction.reply({embeds: [notembed]})
  },
};