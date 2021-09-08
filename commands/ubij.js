const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ubij')
        .setDescription('Um samo da se zna ovo je lazna komanda, nece stvarno nekog da ubije.')
        .addUserOption(option => option.setName("korisnik").setDescription("Koga zelis da ubijes?").setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser("korisnik")

        if (user.id === interaction.user.id) {
            await interaction.reply({ content: `Ne mozes samog sebe da ubijes, to bi bilo samoubistvo.` })
            return
        }

        const poruke = [
            "je umro zbog moždanog udara.",
            "je umro prirodno.",
            "je gurnut sa litice",
            "je imao srčani udar",
            "je izboden",
            "je umro dok je mirno spavao",
            "je rekao N-reč",
            "je ubijen",
            "pojeo cijanid",
            "je otrovan",
            "nije pravilno jeo",
            "je bio dehidriran",
            "je pokušao da se igra na ulici",
            "debelo je postidilo dete, a onda se dogodilo nešto šokantno"
        ]

        const response = poruke[Math.floor(Math.random() * poruke.length)]
        const shouldDie = Math.random() < 0.20

        if (shouldDie) {
            await interaction.reply({ content: `<@${user.id}> nije umro, vec je <@${interaction.user.id}> ${response}`})
        } else {
            await interaction.reply({ content: `<@${user.id}> ${response}`})
        }
    },
};