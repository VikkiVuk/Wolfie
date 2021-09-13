const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ismevaj')
        .setDescription('Da li te neko nervira, pa sa ovom komandom mozes i njih da nerviras!')
        .addStringOption(option => option.setName("tekst").setDescription("Sta zelis da ismevas?").setRequired(true)),

    async execute(interaction) {
        const str = interaction.options.getString("tekst").toLowerCase()

        function toUpperCase(str) {
            return str.split('').map((v, i) => i % 2 == 0 ? v.toLowerCase() : v.toUpperCase()).join('');
        }

        await interaction.reply({ content: toUpperCase(str) })
    },
};