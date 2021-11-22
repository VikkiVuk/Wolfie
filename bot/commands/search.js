const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/BotModule')
const config = require("../config.json")
const {randomNumber} = require("../utility/generateRandom");
const talkedRecently = []

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Get money, from searching stuf....'),
    async execute(interaction) {
        if (talkedRecently.includes(interaction.user.id)) {
            interaction.reply({ content: `HAVE PATIENCE!`})
        } else {
            const locations = config.searchZones
            const chosenLocations = locations.sort(() => Math.random() - Math.random()).slice(0, 3)

            let buttons = []
            for (const location of chosenLocations) {
                buttons.push(new MessageButton().setCustomId(location).setLabel(location).setStyle("PRIMARY"))
            }

            const row = new MessageActionRow().addComponents(buttons)

            await interaction.reply({ content: `**Where do you want to search??** \n_Select one of the options below and start searching!_`, components: [row] })

            const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

            interaction.fetchReply().then(reply => {
                reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(async button => {
                    const received = await randomNumber(100, 3000)
                    await handler(interaction.user.id).then(async () => {
                        await handler.changeMoney(interaction.user.id, true, received)
                    })

                    const embed = new MessageEmbed().setTitle(`${interaction.user.username} searched ${button.customId}`).setDescription(`You searched ${button.customId}. You found **W$ ${received}**`).setTimestamp().setFooter(config.defaultFooter).setColor("GREEN")
                    await interaction.editReply({ content: null, embeds: [embed], components: [] })

                    talkedRecently.push(interaction.user.id);
                    setTimeout(() => {
                        const index = talkedRecently.indexOf(interaction.user.id)
                        talkedRecently.splice(index)
                    }, 20000);
                }).catch(async (err) => {
                    await interaction.editReply({ content: `time ran out.`, components: [] })
                })
            })
        }
    },
};