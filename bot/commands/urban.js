const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('search the urban dictionary')
        .addStringOption(option => option.setName("term").setDescription("what do you want to search on urban dictionary?").setRequired(true)),

    async execute(interaction) {
        const what = interaction.options.getString("term")
        const response = await fetch("https://api.urbandictionary.com/v0/define?term=" + what, {method:"GET",redirect:"follow"})
        const results = await response.json()
        const randomResult = results.list[Math.floor(Math.random() * results.list.length)]

        if (randomResult) {
            const embed = new MessageEmbed()
                .setTitle(`Definition of ${randomResult.word}`)
                .setDescription(randomResult.definition)
                .addField("Example", randomResult.example)
                .setFooter(randomResult.author)
                .setTimestamp(randomResult.written_on)
                .setColor('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'))

            await interaction.reply({ embeds: [embed] })
        } else {
            await interaction.reply({ content: "uh what are you talking about? that doesnt exist on urban dictionary." })
        }
    },
};