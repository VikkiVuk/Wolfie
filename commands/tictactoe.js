const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageCollector} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {randomNumber} = require("../utility/generateRandom");
const config = require('../config.json')
const reconlx = require('reconlx')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Ovako mozes da igras iks oks (x ox/tic tac toe/ttt) sa svojim drugarima.')
        .addUserOption(option => option.setName("protivnik").setDescription("Protiv koga zelis da igras?").setRequired(true)),

    async execute(interaction) {
        if (interaction.options.getUser("protivnik").id === interaction.user.id) {
            await interaction.reply({ content: `Ne mozes protiv samog sebe da se boris. Izaberi nekog drugog.` })
            return
        }

        let users = [interaction.user, interaction.options.getUser("protivnik")]
        let fields = {
            a1: false, a2: false, a3: false,
            b1: false, b2: false, b3: false,
            c1: false, c2: false, c3: false
        }

        let userPlayed = interaction.user

        const acolon = [
            new MessageButton().setCustomId("a1").setLabel("᲼᲼").setStyle("SECONDARY"),
            new MessageButton().setCustomId("a2").setLabel("᲼᲼").setStyle("SECONDARY"),
            new MessageButton().setCustomId("a3").setLabel("᲼᲼").setStyle("SECONDARY")
        ]
        const bcolon = [
            new MessageButton().setCustomId("b1").setLabel("᲼᲼").setStyle("SECONDARY"),
            new MessageButton().setCustomId("b2").setLabel("᲼᲼").setStyle("SECONDARY"),
            new MessageButton().setCustomId("b3").setLabel("᲼᲼").setStyle("SECONDARY"),
        ]
        const ccolon = [
            new MessageButton().setCustomId("c1").setLabel("᲼᲼").setStyle("SECONDARY"),
            new MessageButton().setCustomId("c2").setLabel("᲼᲼").setStyle("SECONDARY"),
            new MessageButton().setCustomId("c3").setLabel("᲼᲼").setStyle("SECONDARY"),
        ]

        const arow = new MessageActionRow().addComponents(acolon)
        const brow = new MessageActionRow().addComponents(bcolon)
        const crow = new MessageActionRow().addComponents(ccolon)
        const startingscreen = new MessageEmbed().setTitle("Tic Tac Toe").setDescription(`**${interaction.user.username} vs ${users[1].username}** \n \n${users[0]} = ❌\n${users[1]} = ⭕ \n${users[1]} krece prvi`).setTimestamp().setFooter(config.defaultFooter).setColor("DARK_RED")

        await interaction.reply({ content: null, embeds: [startingscreen], components: [arow, brow, crow], fetchReply: true }).then(async reply => {
            const collector = reply.createMessageComponentCollector({ componentType: "BUTTON", time: 20000 })

            collector.on("collect", async (button) => {
                await button.deferUpdate()
                if (button.user.id === userPlayed.id || !users.includes(button.user)) { await button.reply({ content: `Ovo dugme nije za tebe!`, ephemeral: true }) } else {
                    userPlayed = button.user
                    if (button.customId.startsWith("a")) {
                        for (const btn of acolon) {
                            if (btn.customId === button.customId) {
                                btn.setDisabled(true)
                                if (button.user.id === interaction.user.id) {
                                    // Attacker
                                    btn.setLabel("❌")
                                } else {
                                    btn.setLabel("⭕")
                                }
                            }
                        }
                    } else if(button.customId.startsWith("b")) {
                        for (const btn of bcolon) {
                            if (btn.customId === button.customId) {
                                btn.setDisabled(true)
                                if (button.user.id === users[0].id) {
                                    // Attacker
                                    btn.setLabel("❌")
                                } else {
                                    btn.setLabel("⭕")
                                }
                            }
                        }
                    } else if(button.customId.startsWith("c")) {
                        for (const btn of ccolon) {
                            if (btn.customId === button.customId) {
                                btn.setDisabled(true)
                                if (button.user.id === users[0].id) {
                                    // Attacker
                                    btn.setLabel("❌")
                                } else {
                                    btn.setLabel("⭕")
                                }
                            }
                        }
                    }

                    let whom
                    const index = users.indexOf(userPlayed)
                    if (index === 0) {
                        whom = users[1]
                    } else {
                        whom = users[0]
                    }

                    const secondscreen = new MessageEmbed().setTitle("Tic Tac Toe").setDescription(`**${interaction.user.username} vs ${users[1].username}** \n \n${users[0]} = ❌\n${users[1]} = ⭕ \n${whom} je na redu!`).setTimestamp().setFooter(config.defaultFooter).setColor("DARK_RED")

                    const arow = new MessageActionRow().addComponents(acolon)
                    const brow = new MessageActionRow().addComponents(bcolon)
                    const crow = new MessageActionRow().addComponents(ccolon)
                    await interaction.editReply({ embeds: [secondscreen], components: [arow, brow, crow] })
                    collector.resetTimer()
                }
            })

            collector.on('end', async() => {
                for (const button of acolon) { button.setDisabled(true) }
                for (const button of bcolon) { button.setDisabled(true) }
                for (const button of ccolon) { button.setDisabled(true) }
                const arow = new MessageActionRow().addComponents(acolon)
                const brow = new MessageActionRow().addComponents(bcolon)
                const crow = new MessageActionRow().addComponents(ccolon)

                await interaction.editReply({ components: [arow, brow, crow] })
            })
        })
    },
};