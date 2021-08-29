const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sutni')
        .setDescription('Da... Kickujes nekog')
        .addUserOption(option => option.setName('korisnik').setDescription("Koga da kickujes/sutnes?").setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getMember('korisnik')

        await interaction.reply(`Ok covek je sutnut do marsa, idalje moze da se vrati.`);
        user.kick(`Kicked by: ${interaction.user.username}`).catch(async (e) => {
            await interaction.editReply({ content: "Doslo je do greske, najverovatnije bot nije iznad tog korisnika."})
        })
    },
};