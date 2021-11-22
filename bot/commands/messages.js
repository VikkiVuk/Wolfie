const { MessageEmbed,MessageAttachment, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()
const config = require("../config.json")
const pagination = require('discordjs-button-pagination')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('messages')
        .setDescription('check your message inbox.'),

    async execute(interaction) {
        const intuser = await handler.getUser(`${interaction.user.id}`)

        const items = await intuser.getkey("messages")
        const embedsArray = []

        var i,j, temporary, chunk = 5;
        for (i = 0,j = items.length; i < j; i += chunk) {
            temporary = items.slice(i, i + chunk);
            const newEmbed = new MessageEmbed().setTitle("Your Messages").setDescription("all of your messages in one place.").setColor("GOLD").setTimestamp().setFooter(config.defaultFooter)
            for (const item of temporary) {
                const itemparts = item.split(":")
                const sender = itemparts[0]
                const message = itemparts[1]

                newEmbed.addField(`${sender}`, `<:reply:884528743673135144> ${message}`)
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