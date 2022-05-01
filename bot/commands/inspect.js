const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
      .setName('scan')
      .setDescription('medbay scan sus amogus')
      .addUserOption(option => option.setName('target').setDescription('who do you want to um... scan?').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply()
    await wait(4000);
    const user = interaction.options.getUser('target') || interaction.member.user
    const normalResponses = [
      '**is NOT SUS**',
      '**is SUS**'
    ];

    if (user.id === interaction.member.user.id) {
      const response = "you already know if you're sus, like wtf"
      await interaction.editReply({content: response})
    } else {
      const response = normalResponses[Math.floor(Math.random() * normalResponses.length)];
      await interaction.editReply({content: `<@${user.id}> ${response}`})
    }
  },
};