const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageCollector} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {randomNumber} = require("../utility/generateRandom");
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fight')
        .setDescription('Fight against someone.')
        .addUserOption(option => option.setName("opponent").setDescription("Who will be your opponent?").setRequired(true)),

    async execute(interaction) {
        if (interaction.options.getUser("opponent").id === interaction.user.id) {
            await interaction.reply({ content: `You cant fight against yourself dummy` })
            return
        }

        let users = [interaction.user, interaction.options.getUser("opponent")]
        let health = { attacker: 100, defender: 100 }
        let defenses = { attacker: 0, defender: 0 } // max 4
        let userPlayed = interaction.user

        const buttons = [
            new MessageButton().setCustomId("udari").setLabel("Punch").setStyle("PRIMARY").setEmoji('<:pepefight:880113235435597864>'),
            new MessageButton().setCustomId("sutni").setLabel("Kick").setStyle("PRIMARY").setEmoji('<:drunk:879850300469567488>'),
            new MessageButton().setCustomId("stiti").setLabel("Flirt").setStyle("PRIMARY").setEmoji('<:sheeeeeeeeesh:880042842116997130>'),
            new MessageButton().setCustomId("pobegni").setLabel("🏳️ Run away").setStyle("DANGER")
        ]

        const row = new MessageActionRow().addComponents(buttons)
        const startingscreen = new MessageEmbed().setTitle("Battle").setDescription(`This is the start of a battle, ${users[1]} starts first!`).setTimestamp().setFooter(config.defaultFooter).setColor("DARK_RED")

        await interaction.reply({ content: null, embeds: [startingscreen], components: [row], fetchReply: true }).then(async reply => {
            const collector = reply.createMessageComponentCollector({ componentType: "BUTTON", time: 20000 })

            collector.on("collect", async (button) => {
                if (button.user.id === userPlayed.id || !users.includes(button.user)) { await button.reply({ content: `Wait for your turn, or dont ig`, ephemeral: true }) } else {
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
                                const upgradedEmbed = new MessageEmbed().setTitle("Upgrade Success!").setDescription(`${users[0]} you have upgraded your defenses! ${users[1]} its your turn now.`).setColor("DARK_GREEN").setFooter(config.defaultFooter).setTimestamp()
                                    .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                                    .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                                await button.update({ content: null, embeds: [upgradedEmbed] })
                                collector.resetTimer()
                            } else {
                                const failedUpgradeEmbed = new MessageEmbed().setTitle("Upgrade Failed").setDescription(`${users[0]} you are at max level! You cant upgrade more. ${users[1]} it's your turn now.`).setColor("DARK_RED").setFooter(config.defaultFooter).setTimestamp()
                                    .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                                    .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                                await button.update({ content: null, embeds: [failedUpgradeEmbed] })
                                collector.resetTimer()
                            }
                        } else if (button.user.id === users[1].id) {
                            if (defenses.defender <= 4) {
                                defenses.defender += 1
                                health.defender += await randomNumber(10, 40)
                                const upgradedEmbed = new MessageEmbed().setTitle("Upgrade Success").setDescription(`${users[1]} you have upgraded your defense! ${users[0]} its your turn now.`).setColor("DARK_GREEN").setFooter(config.defaultFooter).setTimestamp()
                                    .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                                    .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                                await button.update({ content: null, embeds: [upgradedEmbed] })
                                collector.resetTimer()
                            } else {
                                const failedUpgradeEmbed = new MessageEmbed().setTitle("Upgrade Failed").setDescription(`${users[1]} you are at max level! You cant upgrade more. ${users[0]} it's your turn now.`).setColor("DARK_RED").setFooter(config.defaultFooter).setTimestamp()
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
                        const attackEmbed = new MessageEmbed().setTitle("Attack").setDescription(`${users[0]} You ${button.customId}ed ${users[1]}. ${users[1]} your turn now~`).setColor("RED")
                            .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                            .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                        await button.update({ content: null, embeds: [attackEmbed] })
                        collector.resetTimer()
                    } else if (button.user.id === users[1].id) {
                        // defender
                        health.attacker -= await randomNumber(10, 40)
                        const attackEmbed = new MessageEmbed().setTitle("Attack").setDescription(`${users[1]} You ${button.customId}ed ${users[0]}. ${users[0]} your turn now~`).setColor("RED")
                            .addField(users[1].username, `${health.defender}❤ ${defenses.defender}🛡️`, true)
                            .addField(users[0].username, `${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                        await button.update({ content: null, embeds: [attackEmbed] })
                        collector.resetTimer()
                    }

                    if (health.attacker <= 0) {
                        // dead, lost
                        collector.stop()
                        await button.deferUpdate().catch(() => {return})
                    } else if (health.defender <= 0) {
                        // dead, lost
                        collector.stop()
                        await button.deferUpdate().catch(() => {return})
                    }
                }

            })

            collector.on('end', () => {
                for (const button of buttons) { button.setDisabled(true) }

                if (userPlayed.id === interaction.user.id) {
                    // attacker won
                    const secondrow = new MessageActionRow().addComponents(buttons)
                    const embed = new MessageEmbed().setTitle("Battle Finished").setDescription(`This battle is over, the results are down below!`)
                        .addField(userPlayed.username, `won with ${health.attacker}❤ ${defenses.attacker}🛡️`, true)
                        .addField(users[1].username, `lost with 0❤ ${defenses.defender}🛡️`, true)
                    interaction.editReply({ content: null, embeds: [embed], components: [secondrow] })
                } else {
                    // defender won
                    const secondrow = new MessageActionRow().addComponents(buttons)
                    const embed = new MessageEmbed().setTitle("Battle Finished").setDescription(`This battle is over, the results are down below!`)
                        .addField(userPlayed.username, `won with ${health.defender}❤ ${defenses.defender}🛡️`, true)
                        .addField(users[0].username, `lost with 0❤ ${defenses.attacker}🛡️`, true)
                    interaction.editReply({ content: null, embeds: [embed], components: [secondrow] })
                }
            })
        })
    },
};