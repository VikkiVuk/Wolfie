const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('The bot connections.'),

    async execute(interaction) {
        await interaction.reply({ embeds: [
            new MessageEmbed().setTitle("Bot Links").setDescription("All of the resources for the bot!").addField("Official Discord Server", "https://discord.gg/djfGfHYCdw").addField("Official Guilded Server", "https://www.guilded.gg/i/2ye4VdL2").addField("Bot Documentation", "https://docs.wolfie.vikkivuk.xyz").addField("Bot Website", "https://wolfie.vikkivuk.xyz").setFooter(require("../config.json").defaultFooter).setTimestamp().setURL("https://docs.wolfie.vikkivuk.xyz").setColor("GREEN")
        ]});
    },
};