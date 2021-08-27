const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
       .setName('banuj')
       .setDescription('Da... banujes nekog')
       .addUserOption(option => option.setName('korisnik').setDescription("Koga da banujes?").setRequired(true)),
  
    async execute(interaction) {
        const user = interaction.options.getMember('korisnik')

        await interaction.reply(`Hmmmmm, ok da covek je otisao u drugu galaxiju. Siguran sam da nece da se vrati.`);
        user.ban().catch(async (e) => {
            await interaction.editReply({ content: "Doslo je do greske, najverovatnije bot nije iznad tog korisnika."})
        })
    },
};