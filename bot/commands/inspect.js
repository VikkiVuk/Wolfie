const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
      .setName('scan')
      .setDescription('medbay scan sus amogus')
      .addUserOption(option => option.setName('target').setDescription('who do you want to um... scan?').setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply()
    await wait(4000);
    const user = interaction.options.getUser('target') || interaction.member.user
    const normalResponses = [
      '**is a crewmate**',
      '**is an impostor**'
    ];

    if (user.id === interaction.member.user.id) {
      const response = "you already know your role like the heck?"
      await interaction.editReply({content: response})
    } else {
      const response = normalResponses[Math.floor(Math.random() * normalResponses.length)];
      await interaction.editReply({content: `<@${user.id}> ${response}`})
    }
  },
};