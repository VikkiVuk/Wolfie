const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Ovako mozete da napravite vas sopstveni embed.')
        .addStringOption(option => option.setName('naslov').setDescription('Koji naslov zelite na vasem embedu').setRequired(true))
        .addStringOption(option => option.setName('opis').setDescription('Sta ce da vam bude opis?').setRequired(true))
        .addStringOption(option => option.setName('boja').setDescription('Boja vaseg embeda, ovo bi trebalo da bude u hex boji a ne u obicnoj.').setRequired(false)),
    async execute(interaction) {
        const title = interaction.options.getString('naslov')
        const description = interaction.options.getString('opis')
        const color = interaction.options.getString('boja')

        let c
        if (color.includes('#')) {
            c = color
        } else {
            c = "#0077ff"
        }

        const embed = new MessageEmbed().setTitle(title).setDescription(description).setTimestamp().setFooter("Custom Embed Factory").setColor(c)

        await interaction.reply({ embeds: [embed] });
    },
};