const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const notepad = require("../utility/notepad.js");
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
      .setName('beleske')
      .setDescription('Tvoj sopstevni discord notepad.'),

  async execute(interaction) {
    const notepad = require('../utility/notepad.js')

    var note = await notepad.getNote(interaction.user.id)

    if(!note) await interaction.reply({ content: 'Ti jos uvek nema nista u beleskama.', ephemeral: true })

    const avatarUrl = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.member.user.avatar}.png`
    const notembed = new MessageEmbed()
        .setAuthor(`${interaction.user.username} Beleske`, avatarUrl)
        .addField('Beleska: ', `\n\`Moja Beleska:\` **${note}**`)
        .setColor("#9e34eb")
        .setTimestamp()
        .setFooter(config.defaultFooter)

    await interaction.reply({embeds: [notembed]})
  },
};