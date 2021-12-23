const { MessageEmbed, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const got = require("got");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Yeah, well Wolfie will predict you future with this command.')
        .addStringOption(option => option.setName("question").setDescription("What do you want to ask Wolfie?").setRequired(true)),

    async execute(interaction) {
        const question = interaction.options.getString("question")

        got(`https://api.monkedev.com/fun/8ball&key=uXlaMpi3zUgonsZVgncHLIW47`).then(async response => {
            let content = JSON.parse(response.body)
            const embed = new MessageEmbed().setTitle(question + "?").setDescription("<:reply:884528743673135144> " + (content) ? content.response : "I dont know...")

            await interaction.editReply({ embeds: [embed] })
        })
    },
};