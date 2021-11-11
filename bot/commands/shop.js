const { MessageEmbed,MessageAttachment, MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")
const pagination = require('discordjs-button-pagination')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('discord walmart.'),

    async execute(interaction) {
        const items = await handler.getShopItems()
        let options = []
        let embedsArray = []

        var i,j, temporary, chunk = 4;
        for (i = 0,j = items.length; i < j; i += chunk) {
            temporary = items.slice(i, i + chunk);
            const newEmbed = new MessageEmbed().setTitle("Shop").setDescription("see all of the items in the shop.").setColor("BLURPLE").setTimestamp().setFooter(config.defaultFooter)
            for (const item of temporary) {
                const itemparts = item.split(":")
                const itemname = itemparts[0]
                const itemcost = itemparts[1]

                newEmbed.addField(`**${itemname}**`, `<:reply:884528743673135144> This item costs **W$ ${itemcost}**.`)
                const option = {label: itemname, description: null, value: itemname}
                options.push(option)
            }

            embedsArray.push(newEmbed)
        }

        let buttonList = [
            new MessageButton().setCustomId('previousbtn').setLabel('Back').setStyle('DANGER'),
            new MessageButton().setCustomId('nextbtn').setLabel('Next').setStyle('SUCCESS')
        ]

        await pagination(interaction, embedsArray, buttonList, 60000);

        /*
            --------------------------------------------------------
                                    Wolfie

            Dole ispod je kod za kupovinu, nemoj nista dole da diras.
            ---------------------------------------------------------
         */

        const selectMenu = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select').setPlaceholder('Choose something.').addOptions(options))

        const mesage = await interaction.followUp({ content: `Select an item you want to buy down below.`, components: [selectMenu] });

        const collector = mesage.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60000 });

        collector.on('collect', async(selected) => {
            if (selected.user.id === interaction.user.id) {
                for (const item of items) {
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    if (name === selected.values[0]) {
                        const usercoins = handler(interaction.user.id).then(result => { return result.money })

                        if (usercoins >= cost) {
                            await handler.changeMoney(interaction.user.id, false, cost)
                            await handler.addItem(interaction.user.id, 1, selected.values[0])

                            await selected.update({content: `<@${interaction.user.id}> you bought: **${selected.values[0]}** for **W$ ${cost}**.`, components: []})
                        } else {
                            await selected.update({content: `<@${interaction.user.id}> you dont have enough money for: **${selected.values[0]}**.`})
                        }
                    }
                }
            } else {
                await selected.update({content: `this select menu isnt for you.`, ephemeral: true});
            }
        });

        collector.on('end', async(collected) => {
            await mesage.edit({ content: "time ran out.", components: [] })
        })
    },
};