const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const config = require("../config.json")
const {randomNumber} = require("../utility/generateRandom");
const talkedRecently = []

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trazi')
        .setDescription('Ovako mozes da trazis za novac, daje malo vise od moljenja.'),
    async execute(interaction) {
        if (talkedRecently.includes(interaction.user.id)) {
            interaction.reply({ content: `Alou! Stop it, chill outaj. Znaci P L Z, sacekaj tvojih 20 sekundi pre nego sto ponovo komandu pokrenes.`})
        } else {
            const locations = config.searchZones
            const chosenLocations = locations.sort(() => Math.random() - Math.random()).slice(0, 3)

            let buttons = []
            for (const location of chosenLocations) {
                buttons.push(new MessageButton().setCustomId(location).setLabel(location).setStyle("PRIMARY"))
            }

            const row = new MessageActionRow().addComponents(buttons)

            await interaction.reply({ content: `**Gde zelis da trazis?** \n_Izaberi jednu od opcija dole i pocni da trazis!_`, components: [row] })

            const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

            interaction.fetchReply().then(reply => {
                reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(async button => {
                    const received = await randomNumber(100, 3000)
                    await handler(interaction.user.id).then(async () => {
                        await handler.changeMoney(interaction.user.id, true, received)
                    })

                    const embed = new MessageEmbed().setTitle(`${interaction.user.username} je pretrazio ${button.customId}`).setDescription(`Ti si pretrazio ${button.customId}. Nasao si **W$ ${received}**`).setTimestamp().setFooter(config.defaultFooter).setColor("GREEN")
                    await interaction.editReply({ content: null, embeds: [embed], components: [] })

                    talkedRecently.push(interaction.user.id);
                    setTimeout(() => {
                        const index = talkedRecently.indexOf(interaction.user.id)
                        talkedRecently.splice(index)
                    }, 20000);
                }).catch(async (err) => {
                    await interaction.editReply({ content: `Wow, zasto si pokrenuo komandu a nisi izabrao nista, bezobrazno od tebe necu da lazem.`, components: [] })
                })
            })
        }
    },
};