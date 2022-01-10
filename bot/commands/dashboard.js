const { MessageEmbed,MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/BotModule')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('A ✨ Dashboard ✨, where you can configure me, you can also use /setup'),

    async execute(interaction) {
        if (interaction.inGuild()) {
            const row = new MessageActionRow().addComponents(new MessageButton().setLabel("Go to the dashboard").setStyle("LINK").setURL("https://wolfie.vikkivuk.xyz/main/dashboard?guildId=" + interaction.guild.id + "&source=guild"))
            await interaction.reply({ content: "Here's the dashboard!", components: [row] })
        } else {
            const row = new MessageActionRow().addComponents(new MessageButton().setLabel("Go to the dashboard").setStyle("LINK").setURL("https://wolfie.vikkivuk.xyz/main/dashboard?source=dms"))
            await interaction.reply({ content: "Here's the dashboard!", components: [row] })
        }
    }
}