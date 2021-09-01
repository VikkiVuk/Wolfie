const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageCollector} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {randomNumber} = require("../utility/generateRandom");
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bori-se')
        .setDescription('Ovako mozes da se boris protiv nekog.')
        .addUserOption(option => option.setName("protivnik").setDescription("Protiv koga zelis da se boris?").setRequired(true)),

    async execute(interaction) {
        let users = [interaction.user, interaction.options.getUser("protivnik")]
        let health = { attacker: 100, defender: 100 }
        let defenses = { attacker: 0, defender: 0 } // max 4
        let userPlayed = interaction.user

        const buttons = [
            new MessageButton().setCustomId("udari").setLabel("Udari").setStyle("PRIMARY").setEmoji('<:pepefight:880113235435597864>'),
            new MessageButton().setCustomId("sutni").setLabel("Sutni").setStyle("PRIMARY").setEmoji('<:drunk:879850300469567488>'),
            new MessageButton().setCustomId("stiti").setLabel("Flertuj").setStyle("PRIMARY").setEmoji('<:sheeeeeeeeesh:880042842116997130>'),
            new MessageButton().setCustomId("pobegni").setLabel("🏳️ Pobegni").setStyle("DANGER")
        ]

        const row = new MessageActionRow().addComponents(buttons)
        const startingscreen = new MessageEmbed().setTitle("Borba").setDescription(`Ovo je pocetak borbe, ${users[1]} krece prvi!`).setTimestamp().setFooter(config.defaultFooter).setColor("DARK_RED")

        await interaction.reply({ content: null, embeds: [startingscreen], components: [row], fetchReply: true }).then(async reply => {
            const collector = reply.createMessageComponentCollector({ componentType: "BUTTON", time: 20000 })

            collector.on("collect", async (button) => {
                if (button.user.id === userPlayed.id || !users.includes(button.user)) { await button.reply({ content: `Ovo dugme nije za tebe!`, ephemeral: true }) } else {
                    userPlayed = button.user

                    if (button.customId === "pobegni") {
                        collector.stop("cancelled"); await button.deferUpdate()
                        return
                    }

                    if (button.customId === "stiti") {
                        if (button.user.id === interaction.user.id) {
                            if (defenses.attacker <= 4) {
                                defenses.attacker += 1
                                health.attacker += await randomNumber(10, 40)
                                const upgradedEmbed = new MessageEmbed().setTitle("Unapredjenje Uspelo").setDescription(`${users[0]} uspesno si unapredio zastitu! ${users[1]} sad je tvoj red.`).setColor("DARK_GREEN").setFooter(config.defaultFooter).setTimestamp()
                                    .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                                    .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                                await button.update({ content: null, embeds: [upgradedEmbed] })
                                collector.resetTimer()
                            } else {
                                const failedUpgradeEmbed = new MessageEmbed().setTitle("Unapredjenje Neuspelo").setDescription(`${users[0]} previse puta si se unapredio, ne mozes vise. ${users[1]} sad je tvoj red.`).setColor("DARK_RED").setFooter(config.defaultFooter).setTimestamp()
                                    .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                                    .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                                await button.update({ content: null, embeds: [failedUpgradeEmbed] })
                                collector.resetTimer()
                            }
                        } else if (button.user.id === users[1].id) {
                            if (defenses.defender <= 4) {
                                defenses.defender += 1
                                health.defender += await randomNumber(10, 40)
                                const upgradedEmbed = new MessageEmbed().setTitle("Unapredjenje Uspelo").setDescription(`${users[1]} uspesno si unapredio zastitu! ${users[0]} sad je tvoj red.`).setColor("DARK_GREEN").setFooter(config.defaultFooter).setTimestamp()
                                    .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                                    .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                                await button.update({ content: null, embeds: [upgradedEmbed] })
                                collector.resetTimer()
                            } else {
                                const failedUpgradeEmbed = new MessageEmbed().setTitle("Unapredjenje Neuspelo").setDescription(`${users[1]} previse puta si se unapredio, ne mozes vise. ${users[0]} sad je tvoj red.`).setColor("DARK_RED").setFooter(config.defaultFooter).setTimestamp()
                                    .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                                    .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                                await button.update({ content: null, embeds: [failedUpgradeEmbed] })
                                collector.resetTimer()
                            }
                        }

                        return;
                    }

                    if (button.user.id === interaction.user.id) {
                        // attacker
                        health.defender -= await randomNumber(10, 40)
                        const attackEmbed = new MessageEmbed().setTitle("Napadanje").setDescription(`${users[0]} ${button.customId}o si protivnika. ${users[1]} sad je tvoj red.`).setColor("RED")
                            .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                            .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                        await button.update({ content: null, embeds: [attackEmbed] })
                        collector.resetTimer()
                    } else if (button.user.id === users[1].id) {
                        // defender
                        health.attacker -= await randomNumber(10, 40)
                        const attackEmbed = new MessageEmbed().setTitle("Napadanje").setDescription(`${users[1]} ${button.customId}o si protivnika. ${users[0]} sad je tvoj red.`).setColor("RED")
                            .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                            .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                        await button.update({ content: null, embeds: [attackEmbed] })
                        collector.resetTimer()
                    }

                    if (health.attacker <= 0) {
                        // dead, lost
                        collector.stop()
                        await button.deferUpdate()
                    } else if (health.defender <= 0) {
                        // dead, lost
                        collector.stop()
                        await button.deferUpdate()
                    }
                }

            })

            collector.on('end', () => {
                for (const button of buttons) { button.setDisabled(true) }

                if (userPlayed.id === interaction.user.id) {
                    // attacker won
                    const secondrow = new MessageActionRow().addComponents(buttons)
                    const embed = new MessageEmbed().setTitle("Zavrsetak Borbe").setDescription(`Ova borba se zavrsila, dole su rezultati, kao i hp.`)
                        .addField(userPlayed.username, `Je pobedio sa ${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                        .addField(users[1].username, `Je izgubio sa ${health.defender}❤ ${defenses.defender}🛡️`, true)
                    interaction.editReply({ content: null, embeds: [embed], components: [secondrow] })
                } else {
                    // defender won
                    const secondrow = new MessageActionRow().addComponents(buttons)
                    const embed = new MessageEmbed().setTitle("Zavrsetak Borbe").setDescription(`Ova borba se zavrsila, dole su rezultati, kao i hp.`)
                        .addField(userPlayed.username, `Je pobedio sa ${health.defender}❤ ${defenses.defender}🛡️`, true)
                        .addField(users[0].username, `Je izgubio sa ${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                    interaction.editReply({ content: null, embeds: [embed], components: [secondrow] })
                }
            })
        })
    },
};