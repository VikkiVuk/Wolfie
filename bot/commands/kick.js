const { MessageEmbed,MessageAttachment, MessageActionRow, MessageButton, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require("../utility/BotModule")
const configHand = undefined

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("This is how people with sufficient permissions can kick someone.")
        .addUserOption(option => option.setName("user").setDescription("Who should be kicked?").setRequired(true)),

    async execute(interaction) {
        if (interaction.inGuild()) {
            const config = await configHand.getGuildConfig(interaction.guild.id)

            if (config.botmasters) {
                if (interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0) || interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                    await interaction.deferReply()
                    const auth = await handler.has2FA(interaction.user)
                    if (auth) {
                        await interaction.user.send({content: "Send a message with your code from google auth to kick this person." }).then(async() => {
                            interaction.user.createDM(true).then(channel => {
                                channel.awaitMessages({max: 1, time: 30000}).then(async messages => {
                                    const message = messages.first()
                                    const validated = await handler.validate2FA(interaction.user, message.content)
                                    if (validated) {
                                        await interaction.user.send({ content: `You have successfully verified yourself, please return to the server to continue.` }).catch(e => {return})
                                        const user = interaction.options.getMember('user')

                                        const row = new MessageActionRow().addComponents([
                                            new MessageButton().setLabel("Yes, kick this person!").setStyle("DANGER").setCustomId("yes"),
                                            new MessageButton().setLabel("No, take me back!").setStyle("PRIMARY").setCustomId("no")
                                        ])

                                        const filter = b => {
                                            b.deferUpdate();
                                            return b.user.id === interaction.user.id;
                                        };

                                        await interaction.editReply({ content: `Are you sure you want to kick the user: **${user.user.username}#${user.user.discriminator}**?`, components: [row], fetchReply: true }).then(reply => {
                                            reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(async button => {
                                                if (button.customId === "yes") {
                                                    user.kick().then(async () => {
                                                        await interaction.editReply({ content: `The user: **${user.user.username}#${user.user.discriminator}** is now no longer in this server.`})
                                                    }).catch(async (e) => {
                                                        await interaction.editReply({ content: "Sorry I can't kick that person.", components: [] })
                                                    })
                                                } else if (button.customId === "no") {
                                                    await interaction.editReply({ content: `Okay, I won't kick the person.`, components: [] })
                                                }
                                            }).catch(async err => {
                                                await interaction.editReply({ content: `Your time ran out.`, components: [] })
                                            })
                                        })
                                    } else {
                                        await interaction.user.send({ content: `That code is invalid.` }).catch(err => { return })
                                        await interaction.editReply({ content: "Sorry, I couldn't verify you!" })
                                    }
                                })
                            })
                        }).catch(async err => {
                            console.log(err)
                            await interaction.editReply({content: `❌ I can't DM you, please open your DMs or unblock me.`})
                        })
                    } else {
                        await interaction.editReply({ content: `Due to security reasons, you cannot kick users if you do not have 2FA turned on. To set up 2FA please type \`/2fa\``})
                    }
                } else {
                    await interaction.reply({ content: "Sorry, you dont have the sufficient permissions to do this."})
                }
            } else {
                if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                    await interaction.deferReply()
                    const auth = await handler.has2FA(interaction.user)
                    if (auth) {
                        await interaction.user.send({content: "Send a message with your code from google auth to kick this person." }).then(async() => {
                            interaction.user.createDM(true).then(channel => {
                                channel.awaitMessages({max: 1, time: 30000}).then(async messages => {
                                    const message = messages.first()
                                    const validated = await handler.validate2FA(interaction.user, message.content)
                                    if (validated) {
                                        await interaction.user.send({ content: `You have successfully verified yourself, please return to the server to continue.` }).catch(e => {return})
                                        const user = interaction.options.getMember('user')

                                        const row = new MessageActionRow().addComponents([
                                            new MessageButton().setLabel("Yes, kick this person!").setStyle("DANGER").setCustomId("yes"),
                                            new MessageButton().setLabel("No, take me back!").setStyle("PRIMARY").setCustomId("no")
                                        ])

                                        const filter = b => {
                                            b.deferUpdate();
                                            return b.user.id === interaction.user.id;
                                        };

                                        await interaction.editReply({ content: `Are you sure you want to kick the user: **${user.user.username}#${user.user.discriminator}**?`, components: [row], fetchReply: true }).then(reply => {
                                            reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(async button => {
                                                if (button.customId === "yes") {
                                                    user.kick().then(async () => {
                                                        await interaction.editReply({ content: `The user: **${user.user.username}#${user.user.discriminator}** is now no longer in this server.`})
                                                    }).catch(async (e) => {
                                                        await interaction.editReply({ content: "Sorry I can't kick that person.", components: [] })
                                                    })
                                                } else if (button.customId === "no") {
                                                    await interaction.editReply({ content: `Okay, I won't kick the person.`, components: [] })
                                                }
                                            }).catch(async err => {
                                                await interaction.editReply({ content: `Your time ran out.`, components: [] })
                                            })
                                        })
                                    } else {
                                        await interaction.user.send({ content: `That code is invalid.` }).catch(err => { return })
                                        await interaction.editReply({ content: "Sorry, I couldn't verify you!" })
                                    }
                                })
                            })
                        }).catch(async err => {
                            console.log(err)
                            await interaction.editReply({content: `❌ I can't DM you, please open your DMs or unblock me.`})
                        })
                    } else {
                        await interaction.editReply({ content: `Due to security reasons, you cannot kick users if you do not have 2FA turned on. To set up 2FA please type \`/2fa\``})
                    }
                } else {
                    await interaction.reply({ content: "Sorry, you dont have the sufficient permissions to do this."})
                }
            }
        } else {
            await interaction.reply({ content: `Sorry, this command is guild-only!` })
        }
    },
};