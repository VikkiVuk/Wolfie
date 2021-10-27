const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promeni-belesku')
        .setDescription('Promeni svoju belesku.')
        .addStringOption(option => option.setName('beleska').setDescription('U sta da promenis belesku').setRequired(true)),

    async execute(interaction) {
        const note = interaction.options.getString('beleska')

        if(note.length > 2048) await interaction.reply({ content: 'Tvoja beleska ne moze biti veca od **2048** slova!' })
        if(note.length < 5) await interaction.reply({ content: 'Tvoja beleska mora da sadrzi barem **5** slova!' })

        await handler(interaction.user.id).then(async () => {
            await handler.changeNote(interaction.user.id, note)
        })

        await interaction.reply({ content: `Uspesno sam stavio tvoju belesku kao: \n\`${note}!\`` })
    },
};