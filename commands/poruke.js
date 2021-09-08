const { MessageEmbed,MessageAttachment, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")
const pagination = require('discordjs-button-pagination')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poruke')
        .setDescription('Pogledaj sve tvoje poruke.'),

    async execute(interaction) {
        await handler(interaction.user.id)

        const items = await handler.checkMessages(interaction.user.id)
        const embedsArray = []

        var i,j, temporary, chunk = 5;
        for (i = 0,j = items.length; i < j; i += chunk) {
            temporary = items.slice(i, i + chunk);
            const newEmbed = new MessageEmbed().setTitle("Tvoje Poruke").setDescription("Ovde su sve poruke koje su ti stigle.").setColor("GOLD").setTimestamp().setFooter(config.defaultFooter)
            for (const item of temporary) {
                const itemparts = item.split(":")
                const sender = itemparts[0]
                const message = itemparts[1]

                newEmbed.addField(`${sender}`, `<:reply:884528743673135144> ${message}`)
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