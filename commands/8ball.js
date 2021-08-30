const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ova komanda postoji da ti unisti zivot.')
        .addStringOption(option => option.setName("pitanje").setDescription("Sta zelis da pitas wolfie?").setRequired(true)),

    async execute(interaction) {
        const question = interaction.options.getString("pitanje")
        let serbianResponses = ["Sigurno je.", "To je definitivno tako.", "Bez sumnje.", "Da - definitivno.", "Možete se osloniti na to.", "Kako ja vidim, da.", "Najverovatnije.", "Outlook dobar.", "Da.", "Znakovi ukazuju na da.", "Odgovori maglovito, pokušajte ponovo.", "Pitajte ponovo kasnije.", "Bolje da vam ne kažem sada.", "Ne mogu sada predvidjati.", "Koncentriraj se i pitaj ponovo.", "Ne računaj na to.", "Moj odgovor je ne.", "Moji izvori kažu ne.", "Izgled nije tako dobar.", "Veoma sumnjivo."]
        const response = serbianResponses[Math.floor(Math.random() * serbianResponses.length)]
        await interaction.reply({ content: `Pitanje: ${question} \nOdgovor: ${response}`});
    },
};