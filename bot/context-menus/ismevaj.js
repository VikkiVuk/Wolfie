const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")

module.exports = {
    data: {
        name: "Ismevaj",
        type: 3
    },

    async execute(interaction) {
        const message = interaction.options.getMessage("message")
        if (message.author.bot) {
            await interaction.reply({ content: "Ne mozes da ismevas poruke botova."});
            return;
        }

        function toUpperCase(str) {
            return str.split('').map((v, i) => i % 2 == 0 ? v.toLowerCase() : v.toUpperCase()).join('');
        }

        await interaction.reply({ content: toUpperCase(message.content.toLowerCase()) })
    },
};