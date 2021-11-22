const { MessageEmbed,MessageAttachment, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const botmodule = require('../utility/BotModule')
const handler = new botmodule.UserModule()
const config = require("../config.json")
const pagination = require('discordjs-button-pagination')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('See what have you earned on this bot.'),

    async execute(interaction) {
        const intuser = await handler.getUser(`${interaction.user.id}`)
        const items = await intuser.getkey("inventory")
        const embedsArray = []

        var i,j, temporary, chunk = 4;
        for (i = 0,j = items.length; i < j; i += chunk) {
            temporary = items.slice(i, i + chunk);
            const newEmbed = new MessageEmbed().setTitle("Your Inventory").setDescription("Down below are the items you have, to use them type `/use` and to buy more items type `/shop`.").setColor("DARK_GREEN").setTimestamp().setFooter(config.defaultFooter)
            for (const item of temporary) {
                const itemparts = item.split(":")
                const itemname = itemparts[0]
                const itemamnt = itemparts[1]

                newEmbed.addField(itemname, `<:reply:884528743673135144> You have **${itemamnt}** of this item.`)
            }

            embedsArray.push(newEmbed)
        }

        let buttonList = [
            new MessageButton().setCustomId('previousbtn').setLabel('Back').setStyle('DANGER'),
            new MessageButton().setCustomId('nextbtn').setLabel('Next').setStyle('SUCCESS')
        ]

        if (embedsArray.length < 2) {
            await interaction.reply({ embeds: embedsArray })
        } else {
            await pagination(interaction, embedsArray, buttonList, 60000);
        }
    },
};