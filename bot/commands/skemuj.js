const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const handler = require("../utility/BotModule")
const {randomNumber} = require("../utility/generateRandom");
const recentlyTalked = []

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skemuj')
        .setDescription('Skemujte nekog.')
        .addUserOption(option => option.setName('korisnik').setDescription('Koga zelite da skemujete').setRequired(true)),
    async execute(interaction) {
        if (recentlyTalked.includes(interaction.user.id)) {
            await interaction.reply({ content: `Jednostavno sacekaj, vec si skemovao nekog sacekaj 30s da skemujes jos nekog.` })
        } else {
            const user = interaction.options.getUser('korisnik')
            recentlyTalked.push(interaction.user.id)

            if (user.id === interaction.user.id) {
                await interaction.reply({ content: `Ne mozes samog sebe da skemujes, izaberi nekog drugog.` })
                return
            }

            await interaction.reply({ content: `Pokusavam da skemujem <@${user.id}>...`});
            await wait(2000)
            await interaction.editReply({ content: `Zovem korisnika...`})
            await wait(1000)
            await interaction.editReply({ content: `Korisnik se javio. Trenutno pricam s njim...`})
            await wait(6000)
            await interaction.editReply({ content: 'Korisnik mi je dao pristup kompijuteru...'})
            await wait(4000)
            await interaction.editReply({ content: 'Skidam virus na kompijuter od korisnika...'})
            await wait(6000)
            await interaction.editReply({ content: 'Virus mi je poslao sve lozinke...'})
            await wait(3000)
            await interaction.editReply({ content: 'Ulazim u njegovu banku...'})
            await wait(5000)
            await interaction.editReply({ content: `Ukrao sam mu novac, saljem novac <@${interaction.user.id}>.`})
            await wait(3000)
            await interaction.editReply({ content: `Ovo totalno pravo skemovanje <@${user.id}> se zavrsilo, korisnik <@${interaction.user.id}> je dobio malo novca, dok je <@${user.id}> izgubio malo novca.`})

            await handler(interaction.user.id).then(async() => {
                await handler.changeMoney(interaction.user.id, true, await randomNumber(100, 1000))
            })

            await handler(user.id).then(async() => {
                await handler.changeMoney(user.id, false, await randomNumber(1, 50))
            })

            await wait(30000)
            const index = recentlyTalked.indexOf(interaction.user.id)
            recentlyTalked.splice(index)
        }
    },
};