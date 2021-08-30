const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranac')
        .setDescription('Ovako mozete da vidite sta sve imate zaradjeno na botu.'),

    async execute(interaction) {
        const items = await handler.checkItems(interaction.user.id)
        const embed = new MessageEmbed().setTitle("Tvoj Ranac").setDescription("Ovde su tvoji itemi, iteme mozes da zaradis tako sto ides u shop ili koristis komande koje su podrzane.").setColor("GREEN").setTimestamp().setFooter(config.defaultFooter)

        items.forEach(function (item, index) {
            const itemparts = item.split(":")
            const itemamnt = itemparts[1]
            const itemname = itemparts[0]

            embed.addField(itemname, `Imas **${itemamnt}** ovog itema.`)
        });

        await interaction.reply({ embeds: [embed] });
    },
};