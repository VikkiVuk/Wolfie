const { MessageActionRow, MessageButton, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const botmodule = require("../utility/BotModule")
const configHand = new botmodule.GuildConfigurations()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages in a channel.')
        .addIntegerOption(option => option.setName("amount").setDescription("How many messages do you want to clear? Limit: <=99").setRequired(true)),

    async execute(interaction) {
        if (interaction.inGuild()) {
            const config = await configHand.configuration(`${interaction.guild.id}`)

            const numberof = interaction.options.getInteger("amount")
            let n
            if (numberof <= 100) {
                if (numberof + 1 !== 100) {
                    n = numberof + 1
                } else {
                    n = numberof
                }
            } else {
                n = 100
            }

            const filter = b => {
                b.deferUpdate();
                return b.user.id === interaction.user.id;
            };

            if (config.botmasters) {
                if (interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("yes").setLabel("Yes, I'm sure.").setStyle("DANGER"), new MessageButton().setCustomId("no").setLabel("No, take me back!").setStyle("PRIMARY"))
                    await interaction.reply({ content: "Are you sure you want to clear **" + (n - 1) + "** messages?", components: [row], fetchReply: true }).then(reply => {
                        reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(collected => {
                            interaction.editReply({ content: "Clearing...", components: [] })
                            interaction.channel.bulkDelete(n, true).catch(async (e) => {
                                await interaction.channel.send({ content: `An error has occured, I can't clear messages older than 2 weeks.`})
                            }).then(async (messages) => {
                                await interaction.channel.send({ content: `Cleared: **${n - 1} messages**.`, fetchReply: true }).then(reply => {
                                    setTimeout(() => {
                                        reply.delete()
                                    }, 5000)
                                })
                            })
                        }).catch(err => {
                            interaction.editReply({ content: "Your time has ran out, please re-run the command.", components: [] })
                        })
                    })
                }
            } else {
                if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("yes").setLabel("Yes, I'm sure.").setStyle("DANGER"), new MessageButton().setCustomId("no").setLabel("No, take me back!").setStyle("PRIMARY"))
                    await interaction.reply({ content: "Are you sure you want to clear **" + (n - 1) + "** messages?", components: [row], fetchReply: true }).then(reply => {
                        reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(collected => {
                            interaction.editReply({ content: "Clearing...", components: [] })
                            interaction.channel.bulkDelete(n, true).catch(async (e) => {
                                await interaction.channel.send({ content: `An error has occured, I can't clear messages older than 2 weeks.`})
                            }).then(async (messages) => {
                                await interaction.channel.send({ content: `Cleared: **${n - 1} messages**.`, fetchReply: true }).then(reply => {
                                    setTimeout(() => {
                                        reply.delete()
                                    }, 5000)
                                })
                            })
                        }).catch(err => {
                            interaction.editReply({ content: "Your time has ran out, please re-run the command.", components: [] })
                        })
                    })
                } else {
                    await interaction.reply({ content: "You do not have the sufficient permissions to do this." })
                }
            }
        }
    },
};