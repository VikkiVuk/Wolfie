const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const reconlx = require('reconlx')
const got = require("got");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('caskaj')
        .setDescription('Ovako mozete da pricate s botom. Za sad je samo engleski prihvacen.')
        .addStringOption(option => option.setName("tekst").setDescription("O cemu zelite da caskate?").setRequired(true)),

    async execute(interaction) {
        reconlx.chatBot()
        await interaction.deferReply()
        const text = interaction.options.getString("tekst")
        const api = 'https://api.monkedev.com/fun/chat?msg='
        got(api + text + "&uuid=" + interaction.user.id).then(async response => {
            let content = JSON.parse(response.body)
            await interaction.editReply({ content: content.response })
        })
    },
};