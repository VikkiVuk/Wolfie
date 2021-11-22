const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfig()
const handler = new BotModule.Users()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("People with sufficient permissions can use this to ban members.")
        .addUserOption(option => option.setName("user").setDescription("Who do you want to ban?").setRequired(true)),

    async execute(interaction) {
        if (interaction.inGuild()) {
            const config = await configHand.getGuildConfig(interaction.guild.id)

            if (config.botmasters) {
                if (interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0) || interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                    await interaction.deferReply()
                    const auth = await handler.has2FA(interaction.user)
                    if (auth) {
                        await interaction.user.send({content: "Send a message with your code from google auth to ban this person." }).then(async() => {
                            interaction.user.createDM(true).then(channel => {
                                channel.awaitMessages({max: 1, time: 30000}).then(async messages => {
                                    const message = messages.first()
                                    const validated = await handler.validate2FA(interaction.user, message.content)
                                    if (validated) {
                                        await interaction.user.send({ content: `You have successfully verified yourself, please return to the server to continue.` }).catch(e => {return})
                                        const user = interaction.options.getMember('user')

                                        const row = new MessageActionRow().addComponents([
                                            new MessageButton().setLabel("Yes, ban this person!").setStyle("DANGER").setCustomId("yes"),
                                            new MessageButton().setLabel("No, take me back!").setStyle("PRIMARY").setCustomId("no")
                                        ])

                                        const filter = b => {
                                            b.deferUpdate();
                                            return b.user.id === interaction.user.id;
                                        };

                                        await interaction.editReply({ content: `Are you sure you want to ban the user: **${user.user.username}#${user.user.discriminator}**?`, components: [row], fetchReply: true }).then(reply => {
                                            reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(async button => {
                                                if (button.customId === "yes") {
                                                    user.kick().then(async () => {
                                                        await interaction.editReply({ content: `The user: **${user.user.username}#${user.user.discriminator}** is now banned **permanently**`})
                                                    }).catch(async (e) => {
                                                        await interaction.editReply({ content: "Sorry I can't ban that person.", components: [] })
                                                    })
                                                } else if (button.customId === "no") {
                                                    await interaction.editReply({ content: `Okay, I won't ban the person.`, components: [] })
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
                        await interaction.editReply({ content: `Due to security reasons, you cannot ban users if you do not have 2FA turned on. To set up 2FA please type \`/2fa\``})
                    }
                } else {
                    await interaction.reply({ content: "Sorry, you dont have the sufficient permissions to do this."})
                }
            } else {
                if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                    await interaction.deferReply()
                    const auth = await handler.has2FA(interaction.user)
                    if (auth) {
                        await interaction.user.send({content: "Send a message with your code from google auth to ban this person." }).then(async() => {
                            interaction.user.createDM(true).then(channel => {
                                channel.awaitMessages({max: 1, time: 30000}).then(async messages => {
                                    const message = messages.first()
                                    const validated = await handler.validate2FA(interaction.user, message.content)
                                    if (validated) {
                                        await interaction.user.send({ content: `You have successfully verified yourself, please return to the server to continue.` }).catch(e => {return})
                                        const user = interaction.options.getMember('user')

                                        const row = new MessageActionRow().addComponents([
                                            new MessageButton().setLabel("Yes, ban this person!").setStyle("DANGER").setCustomId("yes"),
                                            new MessageButton().setLabel("No, take me back!").setStyle("PRIMARY").setCustomId("no")
                                        ])

                                        const filter = b => {
                                            b.deferUpdate();
                                            return b.user.id === interaction.user.id;
                                        };

                                        await interaction.editReply({ content: `Are you sure you want to ban the user: **${user.user.username}#${user.user.discriminator}**?`, components: [row], fetchReply: true }).then(reply => {
                                            reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(async button => {
                                                if (button.customId === "yes") {
                                                    user.ban().then(async () => {
                                                        await interaction.editReply({ content: `The user: **${user.user.username}#${user.user.discriminator}** is now banned **permanently**`})
                                                    }).catch(async (e) => {
                                                        await interaction.editReply({ content: "Sorry I can't ban that person.", components: [] })
                                                    })
                                                } else if (button.customId === "no") {
                                                    await interaction.editReply({ content: `Okay, I won't ban the person.`, components: [] })
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
                        await interaction.editReply({ content: `Due to security reasons, you cannot ban users if you do not have 2FA turned on. To set up 2FA please type \`/2fa\``})
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