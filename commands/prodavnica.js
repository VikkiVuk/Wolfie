const { MessageEmbed,MessageAttachment, MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")
const pagination = require('discordjs-button-pagination')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prodavnica')
        .setDescription('Ovde mozete da kupite stvari.'),

    async execute(interaction) {
        const items = config.shopItems
        let options = []

        const embedsArray = [new MessageEmbed().setTitle("Prodavnica").setDescription("Dole imas sve iteme koje mozes da uzmes.").setColor("BLURPLE").setTimestamp().setFooter(config.defaultFooter)]

        items.forEach(function (item, index) {
            if(index <= 2) {
                const itemparts = item.split(':')
                const name = itemparts[0]
                const cost = itemparts[1]

                embedsArray[0].addField(name, `Ovaj item kosta **${cost}** novca.`)
                const option = {label: name, description: null, value: name}
                options.push(option)
            } else if (index >= 2 && index <= 5) {
                if (embedsArray[1]) {
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    embedsArray[1].addField(name, `Ovaj item kosta **${cost}** novca.`)
                    const option = {label: name, description: null, value: name}
                    options.push(option)
                } else {
                    embedsArray.push(new MessageEmbed().setTitle("Prodavnica").setDescription("Dole imas sve iteme koje mozes da uzmes.").setColor("BLURPLE").setTimestamp().setFooter(config.defaultFooter))
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    embedsArray[1].addField(name, `Ovaj item kosta **${cost}** novca.`)
                    const option = {label: name, description: null, value: name}
                    options.push(option)
                }
            } else if (index >= 6 && index <= 9) {
                if (embedsArray[2]) {
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    embedsArray[2].addField(name, `Ovaj item kosta **${cost}** novca.`)
                    const option = {label: name, description: null, value: name}
                    options.push(option)
                } else {
                    embedsArray.push(new MessageEmbed().setTitle("Prodavnica").setDescription("Dole imas sve iteme koje mozes da uzmes.").setColor("BLURPLE").setTimestamp().setFooter(config.defaultFooter))
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    embedsArray[2].addField(name, `Ovaj item kosta **${cost}** novca.`)
                    const option = {label: name, description: null, value: name}
                    options.push(option)
                }
            } else if (index >= 9) {
                if (embedsArray[3]) {
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    embedsArray[3].addField(name, `Ovaj item kosta **${cost}** novca.`)
                    const option = {label: name, description: null, value: name}
                    options.push(option)
                } else {
                    embedsArray.push(new MessageEmbed().setTitle("Prodavnica").setDescription("Dole imas sve iteme koje mozes da uzmes.").setColor("BLURPLE").setTimestamp().setFooter(config.defaultFooter))
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    embedsArray[3].addField(name, `Ovaj item kosta **${cost}** novca.`)
                    const option = {label: name, description: null, value: name}
                    options.push(option)
                }
            }
        })

        const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('Proslo')
            .setStyle('DANGER');

        const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('Sledece')
            .setStyle('SUCCESS');

        let buttonList = [
            button1,
            button2
        ]

        await pagination(interaction, embedsArray, buttonList, 60000);

        /*
            --------------------------------------------------------
                                    Wolfie

            Dole ispod je kod za kupovinu, nemoj nista dole da diras.
            ---------------------------------------------------------
         */

        const selectMenu = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select').setPlaceholder('Izaberi nesto da kupis.').addOptions(options))

        const mesage = await interaction.followUp({ content: `Dole izaberi koj item zelis da kupis.`, components: [selectMenu] });

        const collector = mesage.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60000 });

        collector.on('collect', async(selected) => {
            if (selected.user.id === interaction.user.id) {
                for (const item of items) {
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    if (name === selected.values[0]) {
                        const usercoins = handler(interaction.user.id).money

                        if (usercoins >= cost) {
                            await handler.changeMoney(interaction.user.id, false, cost)
                            await handler.addItem(interaction.user.id, 1, selected.values[0])

                            await selected.update({content: `<@${interaction.user.id}> uspesno si kupio item: **${selected.values[0]}** za **${cost} novca**.`, components: []})
                        } else {
                            await selected.update({content: `<@${interaction.user.id}> nemas dovoljno novca za item: **${selected.values[0]}**.`})
                        }
                    }
                }
            } else {
                await selected.update({content: `Ovaj select menu nije za tebe.`, ephemeral: true});
            }
        });

        collector.on('end', async(collected) => {
            await mesage.edit({ content: "Vreme ti je isteklo.", components: [] })
        })
    },
};