const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/BotModule')

module.exports = {
    data: {
        name: "Ban",
        type: 2
    },

    async execute(interaction) {
        await interaction.deferReply()
        const auth = await handler.has2FA(interaction.user)
        if (auth) {
            await interaction.user.send({content: "Posalji poruku sa tvojim kodom s google authenticatora da bi banovao korisnika." }).then(async() => {
                interaction.user.createDM(true).then(channel => {
                    channel.awaitMessages({max: 1, time: 30000}).then(async messages => {
                        const message = messages.first()
                        const validated = await handler.validate2FA(interaction.user, message.content)
                        if (validated) {
                            await interaction.user.send({ content: `Uspesno si se verifikovao, vrati se u server da nastavis dalje.` }).catch(e => {return})
                            const user = interaction.options.getMember('user')

                            const row = new MessageActionRow().addComponents([
                                new MessageButton().setLabel("Da, banuj korisnika.").setStyle("DANGER").setCustomId("yes"),
                                new MessageButton().setLabel("Ne, vrati me nazad.").setStyle("PRIMARY").setCustomId("no")
                            ])

                            const filter = b => {
                                b.deferUpdate();
                                return b.user.id === interaction.user.id;
                            };

                            await interaction.editReply({ content: `Da li si siguran da zelis da banujes korisnika: **${user.user.username}#${user.user.discriminator}**?`, components: [row], fetchReply: true }).then(reply => {
                                reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(async button => {
                                    if (button.customId === "yes") {
                                        user.kick().then(async () => {
                                            await interaction.editReply({ content: `Uspesno sam banovao korisnika: **${user.user.username}#${user.user.discriminator}**`})
                                        }).catch(async (e) => {
                                            await interaction.editReply({ content: "Ne mogu da banujem tog korisnika.", components: [] })
                                        })
                                    } else if (button.customId === "no") {
                                        await interaction.editReply({ content: `Ok, nisam banovao korisnika.`, components: [] })
                                    }
                                }).catch(async err => {
                                    await interaction.editReply({ content: `Vreme ti je isteklo.`, components: [] })
                                })
                            })
                        } else {
                            await interaction.user.send({ content: `Verifikacija nije uspela.` }).catch(err => { return })
                            await interaction.editReply({ content: "Verifikacija nije uspela!" })
                        }
                    })
                })
            }).catch(async err => {
                console.log(err)
                await interaction.editReply({content: `❌ Nisam mogao da ti posaljem DM.`})
            })
        } else {
            await interaction.editReply({ content: `Iz bezbednosnih razloga, ne mozes da banujes korisnike ako nemas 2FA Verifikaciju. Da namestis 2FA Verifikaciju molim te ukucaj \`/2fa\``})
        }
    },
};