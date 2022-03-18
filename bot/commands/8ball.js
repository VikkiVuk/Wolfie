const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const wait = require("util").promisify(setTimeout)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Yeah, well Wolfie will predict you future with this command.')
        .addStringOption(option => option.setName("question").setDescription("What do you want to ask Wolfie?").setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()
        const question = interaction.options.getString("question")

        const response = await fetch(`https://api.monkedev.com/fun/8ball?key=uXlaMpi3zUgonsZVgncHLIW47`, {method:"GET",redirect:"follow"})
        let content = await response.json()
        const embed = new MessageEmbed().setTitle(question + "?").setDescription("<:reply:884528743673135144> " + (content) ? content["answer"] : "I dont know...")
        await wait(3000)
        await interaction.editReply({ embeds: [embed] })
    },
};