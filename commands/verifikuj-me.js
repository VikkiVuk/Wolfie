const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verifikuj-se')
    .setDescription('Um, verifikuj se? Sta drugo ti kazem.'),
  
  async execute(interaction) {
    if (interaction.member.roles.cache.has('687599618002911239')) {
        await interaction.reply({content: '❌ Vec si verifikovan!', ephemeral: true})
    } else {
        const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('verify').setLabel('Ja sam covek').setStyle('PRIMARY'));
        await interaction.reply({ content: `Hej! Samo klikni dugme dole da bi se verifikovao, da bi smo znali da si covek.`, ephemeral: true, components: [row] })
    }
  },
};