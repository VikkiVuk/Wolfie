const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const handler = new BotModule.UserModule()
const confighand = new BotModule.GuildConfigurations()
const config = require("../config.json")
const pagination = require('discordjs-button-pagination')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wolfmart')
        .setDescription('wolfie walmart.'),

    async execute(interaction) {
        const jsonitems = await confighand.GetGuildItems(`${interaction.guild.id}`)
        const items = Object.entries(jsonitems)
        let options = []
        let embedsArray = []

        var i,j, temporary, chunk = 4;
        for (i = 0,j = items.length; i < j; i += chunk) {
            temporary = items.slice(i, i + chunk);
            const newEmbed = new MessageEmbed().setTitle("Wolfmart").setDescription("See all of the items in the shop. There will be different items for each guild due to the ability to add custom items.").setColor("BLURPLE").setTimestamp().setFooter(config.defaultFooter)
            for (const item of temporary) {
                const itemname = item[0]
                const itemcost = item[1]

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
                    const name = item[0]
                    const cost = item[1]

                    if (name === selected.values[0]) {
                        const intuser = await handler.getUser(`${interaction.user.id}`)
                        const usercoins = await intuser.getkey("money")

                        if (usercoins >= cost) {
                            await intuser.modify("money", cost, "REMOVE")
                            await intuser.addItem(selected.values[0], 1)

                            await selected.update({content: `<@${interaction.user.id}> you bought the item **${selected.values[0]}** for **W$ ${cost}**.`, components: []})
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