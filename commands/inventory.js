const { MessageEmbed,MessageAttachment, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")
const pagination = require('discordjs-button-pagination')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranac')
        .setDescription('Ovako mozete da vidite sta sve imate zaradjeno na botu.'),

    async execute(interaction) {
        const items = await handler.checkItems(interaction.user.id)
        const embedsArray = []

        var i,j, temporary, chunk = 4;
        for (i = 0,j = items.length; i < j; i += chunk) {
            temporary = items.slice(i, i + chunk);
            const newEmbed = new MessageEmbed().setTitle("Tvoj Ranac").setDescription("Ovde su tvoji itemi, iteme mozes da zaradis tako sto ides u shop ili koristis komande koje su podrzane.").setColor("GREEN").setTimestamp().setFooter(config.defaultFooter)
            for (const item of temporary) {
                const itemparts = item.split(":")
                const itemname = itemparts[0]
                const itemamnt = itemparts[1]

                newEmbed.addField(itemname, `Imas **${itemamnt}** ovog itema.`)
            }

            embedsArray.push(newEmbed)
        }

        let buttonList = [
            new MessageButton().setCustomId('previousbtn').setLabel('Nazad').setStyle('DANGER'),
            new MessageButton().setCustomId('nextbtn').setLabel('Sledece').setStyle('SUCCESS')
        ]

        if (embedsArray.length < 2) {
            await interaction.reply({ embeds: embedsArray })
        } else {
            await pagination(interaction, embedsArray, buttonList, 60000);
        }
    },
};