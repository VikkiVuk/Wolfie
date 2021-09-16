const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")

module.exports = {
    data: {
        name: "Prijavi Poruku",
        type: 3
    },

    async execute(interaction) {
        const message = interaction.options.getMessage("message")
        if (message.author.bot) {
            await interaction.reply({ content: "Ne mozes da prijavis poruke botova."});
            return;
        }

        await message.guild.channels.cache.find(c => c.name.includes("prijavljene-poruke")).send({ content: `Korisnik ${interaction.user} je prijavio ovu poruku korisnika ${message.author}: \`\`\`${message.content}\`\`\``})
        await interaction.reply({ content: `Uspesno si prijavio poruku` })
    },
};