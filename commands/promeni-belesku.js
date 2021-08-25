const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('promeni-belesku')
    .setDescription('Promeni svoju belesku.')
    .addStringOption(option => option.setName('beleska').setDescription('U sta da promenis belesku').setRequired(true)),
  
  async execute(interaction) {
      const note = interaction.options.getString('beleska')
      const notepad = require('../utility/notepad.js')

      if(note.length > 2048) return 'Tvoja beleska ne moze biti veca od **2048** slova!'
      if(note.length < 5) return 'Tvoja beleska mora da sadrzi barem **5** slova!'

      await notepad.setNote(interaction.user.id, note)

      return `Uspesno sam stavio tvoju belesku kao: \n\`${note}!\``   
    },
};