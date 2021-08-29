const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
      .setName('jel-stvaran')
      .setDescription('Hmmmmm.... Jel si ti ili neko stvaran?')
      .addUserOption(option => option.setName('korisnik').setDescription('Ko?').setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply()
    await wait(4000);
    const user = interaction.options.getUser('korisnik') || interaction.member.user
    const normalResponses = [
      '**JE STVARAN**',
      '**NIJE STVARAN**'
    ];

    const youResponses = [
      'Ti si **STVARAN**',
      'Ti **NISI STVARAN**'
    ];

    if (user.id == interaction.member.user.id) {
      const response = youResponses[Math.floor(Math.random() * youResponses.length)];
      await interaction.editReply({content: response})
    } else {
      const response = normalResponses[Math.floor(Math.random() * normalResponses.length)];
      await interaction.editReply({content: `<@${user.id}> ${response}`})
    }
  },
};