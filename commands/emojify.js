const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Pretvori obican text u emodzije')
        .addStringOption(option => option.setName("text").setDescription("sta zelis da pretvoris").setRequired(true)),

    async execute(interaction) {
        const text = interaction.options.getString("text").toLowerCase().split('')

        let emojified = ""
        for (const t of text) {
            if (t === " ") {
                emojified += "    "
            } else {
                emojified += ` :regional_indicator_`.concat(`${t}:`)
            }
        }

        await interaction.reply(emojified);
    },
};