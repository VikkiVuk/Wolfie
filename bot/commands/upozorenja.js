const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require("../utility/BotModule")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('upozorenja')
        .setDescription('Ovako moderatori mogu da vide koliko neko ima upozorenja.')
        .addUserOption(option => option.setName("korisnik").setDescription("Kome zelis da vidis upozorenja?").setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser("korisnik")
        const warns = await handler(user.id).then(async reply => { return reply.warns })

        await interaction.reply({ content: `Korisnik <@${user.id}> ima **${warns} upozorenja**.`});
    },
};