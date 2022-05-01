const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resources')
        .setDescription('Every single resource that you can use for the bot.'),

    async execute(interaction) {
        await interaction.reply({ embeds: [
            new MessageEmbed()
                .setTitle("Resources")
                .setDescription("All of the resources for the bot are below this text.")
                .addField("Suggestion Form", "https://forms.gle/a9ddSQSrfARbVcfZ9")
                .addField("Official Discord Server", "https://discord.gg/djfGfHYCdw")
                .addField("Official Guilded Server", "https://guilded.gg/rain")
                .addField("Bot Website", "https://wolfie.pro")
                .addField("Bot Creator", "https://vikkivuk.xyz")
                .addField("APIs", "https://status.vikkivuk.xyz")
                .setFooter({text:require("../config.json").defaultFooter})
                .setTimestamp()
                .setURL("https://wolfie.pro")
                .setColor("GREEN")
        ]});
    },
};