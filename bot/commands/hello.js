const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Hello world!'),

    async execute(interaction) {
        await interaction.reply('Hello!');
    },
};