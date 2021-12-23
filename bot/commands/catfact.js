const { MessageEmbed, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const got = require("got");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catfact')
        .setDescription('Get a random cat fact with this command!'),

    async execute(interaction) {
        got(`https://api.monkedev.com/facts/cat&key=uXlaMpi3zUgonsZVgncHLIW47`).then(async response => {
            let content = JSON.parse(response.body)

            await interaction.editReply({ content: (content) ? content.response : "I dont have one." })
        })
    },
};