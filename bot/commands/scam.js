const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const BotModule = require("../utility/BotModule")
const handler = new BotModule.UserModule()
const {randomNumber} = require("../utility/generateRandom");
const recentlyTalked = []

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scam')
        .setDescription('Scam someone.')
        .addUserOption(option => option.setName('target').setDescription('Who do you want to scam?').setRequired(true)),
    async execute(interaction) {
        if (recentlyTalked.includes(interaction.user.id)) {
            await interaction.reply({ content: `hey bro, there is a cooldown on the scam command.` })
        } else {
            const user = interaction.options.getUser('target')
            recentlyTalked.push(interaction.user.id)

            if (user.id === interaction.user.id) {
                await interaction.reply({ content: `You cant scam yourself like wtf` })
                return
            }

            await interaction.reply({ content: `Getting <@${user.id}>'s phone number...`});
            await wait(2000)
            await interaction.editReply({ content: `📞 Calling user...`})
            await wait(1000)
            await interaction.editReply({ content: `📞 User has picked up, trying to get access to his pc...`})
            await wait(6000)
            if (+await randomNumber(1,2) === +1) {
                await interaction.editReply({ content: '📞 User gave me access to his computer...'})
                await wait(4000)
                await interaction.editReply({ content: '⬇ Downloading virus onto targets PC...'})
                await wait(6000)
                await interaction.editReply({ content: '☑ Virus downloaded...'})
                await wait(3000)
                await interaction.editReply({ content: '🚪 Entering targets bank account...'})
                await wait(5000)
                await interaction.editReply({ content: `Stole targets money, sending it to <@${interaction.user.id}>.`})
                await wait(3000)
                await interaction.editReply({ content: `This totally real scamming of <@${user.id}> has been completed successfully. <@${interaction.user.id}> got some money and <@${user.id}> lost some money.`})
            } else {
                await interaction.editReply({ content: "📴 Call disconnected"})
            }

            const intuser = await handler.getUser(`${interaction.user.id}`)
            await intuser.modify("money", await randomNumber(50,200), "ADD")
            await wait(30000)
            const index = recentlyTalked.indexOf(interaction.user.id)
            recentlyTalked.splice(index)
        }
    },
};