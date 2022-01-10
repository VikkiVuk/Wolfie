const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const got = require("got");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chat with Wolfie!')
        .addStringOption(option => option.setName("chat").setDescription("About what do you want to chat?").setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()
        const text = interaction.options.getString("chat")

        got(`https://api.monkedev.com/fun/chat?msg=${text}&uid=${interaction.user.id}&key=uXlaMpi3zUgonsZVgncHLIW47`).then(async response => {
            let content = JSON.parse(response.body)
            await interaction.editReply({ content: (content) ? content.response : "..." })
        })
    },
};