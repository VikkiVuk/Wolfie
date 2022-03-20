const { MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require('../utility/BotModule')
const handler = new BotModule.UserModule()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('2fa')
        .setDescription('Used to verify user ownership of the account.'),

    async execute(interaction) {
        await interaction.deferReply()
        const botuser = await handler.getUser(`${interaction.user.id}`, null, interaction.user)
        const result = await handler.setup2fa(interaction.user)

        if (result === "ALREADY_REGISTERED") {
            await interaction.user.send({content: "Send a message with your google auth code to verify yourself." }).then(async() => {
                interaction.user.createDM(true).then(channel => {
                    channel.awaitMessages({max: 1, time: 30000}).then(async messages => {
                        const message = messages.first()
                        const verified = await handler.verify2fa(interaction.user, message.content)
                        if (verified) {
                            await interaction.editReply({ content: `You have successfully verified yourself!` })
                        } else {
                            const validated = await botuser.validate2fa(message.content)
                            if (validated) {
                                await interaction.user.send({ content: `Your code was correct.` }).catch(e => {return})
                                await interaction.editReply({ content: `That code was correct!` })
                            } else {
                                await interaction.user.send({ content: `That code is invalid.` }).catch(e => {return})
                                await interaction.editReply({ content: "Sorry, i couldn't verify you." })
                            }
                        }
                    })
                })
            }).catch(async err => {
                console.log(err)
                await interaction.editReply({content: `❌ I can't send you a DM, did you block me?`})
            })
        } else {
            const x = await new MessageAttachment(result.qrcode, "QRCode.png")
            await interaction.user.send({content: "Scan this QRCode in **Google Authenticator** or **Authy**. \n \n**This message will be deleted in 20 seconds due to security reasons.**", files: [x], ephemeral: false, fetchReply: true}).then(async() => {
                await interaction.editReply({ content: `✅ Check your DMs.`})
                setTimeout(async () => {
                    await interaction.deleteReply()
                }, 20000)
            }).catch(async err => {
                console.log(err)
                await interaction.editReply({content: `❌ I can't send you a DM, did you block me?`})
            })
        }
    }
}