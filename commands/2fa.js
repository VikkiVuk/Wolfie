const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('2fa')
        .setDescription('Za sad ovo je samo zamena /moj-kljuc ili /tvojbroj komandi.'),

    async execute(interaction) {
        await interaction.deferReply()
        const result = await handler.register2FA(interaction.user)

        if (result === "ALREADY_REGISTERED") {
            await interaction.user.send({content: "Posalji poruku sa tvojim kodom s google authenticatora da bi se verifikovao." }).then(async() => {
                interaction.user.createDM(true).then(channel => {
                    channel.awaitMessages({max: 1, time: 30000}).then(async messages => {
                        const message = messages.first()
                        const verified = await handler.verify2FA(interaction.user, message.content)
                        if (verified) {
                            await interaction.editReply({ content: `Uspesno si se verifikovao!` })
                        } else {
                            const validated = await handler.validate2FA(interaction.user, message.content)
                            if (validated) {
                                await interaction.editReply({ content: `Tvoj kod je bio tacan!` })
                            } else {
                                await interaction.editReply({ content: "To nije tvoj kod!" })
                            }
                        }
                    })
                })
            }).catch(async err => {
                console.log(err)
                await interaction.editReply({content: `❌ Nisam mogao da ti posaljem DM.`})
            })
        } else {
            const x = await new MessageAttachment(result.qrcode, "QRCode.png")
            await interaction.user.send({content: "Skeniraj ovaj QR Kod dole u **Google Authenticator** ili **Authy**!", files: [x], ephemeral: false, fetchReply: true}).then(async() => {
                await interaction.editReply({ content: `✅ Proveri DM.`})
            }).catch(async err => {
                await interaction.editReply({content: `❌ Nisam mogao da ti posaljem DM.`})
            })
        }
    }
}