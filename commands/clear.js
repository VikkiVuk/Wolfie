const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Ovako ocistite poruke u channel.')
        .addIntegerOption(option => option.setName("koliko").setDescription("Koliko poruka zelite da ocistite? Limit: 100").setRequired(true)),

    async execute(interaction) {
        await interaction.reply({ content: "Ok." })

        const numberof = interaction.options.getInteger("koliko")
        let n
        if (numberof <= 100) {
            n = numberof
        } else {
            n = 100
        }

        interaction.channel.bulkDelete(n, true).catch(async (e) => {
            await interaction.channel.send({ content: `Doslo je do greske. Ne mogu da obrisem poruke koje su starije od 2 nedelje.`})
        }).then(async (messages) => {
            await interaction.channel.send({ content: `Ocistio sam: **${n} poruka**.` });
        })
    },
};