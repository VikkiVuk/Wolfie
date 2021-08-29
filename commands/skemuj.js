const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skemuj')
        .setDescription('Skemujte nekog.')
        .addUserOption(option => option.setName('korisnik').setDescription('Koga zelite da skemujete').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('korisnik')
        try {

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
        } catch {
            return
        }
    },
};