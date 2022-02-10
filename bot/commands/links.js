const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('The bot connections.'),

    async execute(interaction) {
        await interaction.reply({ embeds: [
            new MessageEmbed().setTitle("Bot Links").setDescription("All of the resources for the bot!").addField("Official Discord Server", "https://discord.gg/djfGfHYCdw").addField("Official Guilded Server", "https://www.guilded.gg/i/2ye4VdL2").addField("Bot Documentation", "https://docs.wolfie.pro").addField("Bot Website", "https://wolfie.pro").setFooter(require("../config.json").defaultFooter).setTimestamp().setURL("https://docs.wolfie.pro").setColor("GREEN")
        ]});
    },
};