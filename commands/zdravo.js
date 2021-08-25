const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
       .setName('zdravo')
       .setDescription('Ovo je komanda za testiranje uglavnom.'),
  
    async execute(interaction) {
        await interaction.reply('Zdravo!');
    },
};