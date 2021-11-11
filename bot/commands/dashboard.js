const { MessageEmbed,MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('A ✨ Dashboard ✨, where you can configure me.'),

    async execute(interaction) {
        const row = new MessageActionRow().addComponents(new MessageButton().setLabel("Go to the dashboard").setStyle("LINK").setURL("http://wolfie.vikkivuk.xyz/main/dashboard?guildId=" + interaction.guild.id))
        await interaction.reply({ content: "Here's the dashboard!", components: [row] })
    }
}