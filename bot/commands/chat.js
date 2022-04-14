const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chat with Wolfie!')
        .addStringOption(option => option.setName("chat").setDescription("About what do you want to chat?").setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()
        const text = interaction.options.getString("chat")

        let response = await fetch(`https://api-monkedev.herokuapp.com/fun/chat?msg=${text}&uid=${interaction.user.id}&key=uXlaMpi3zUgonsZVgncHLIW47`, {method: 'GET', redirect: 'follow'})
        let content = await response.json()
        await interaction.editReply({ content: (content) ? content.response : "what?" })
    },
};