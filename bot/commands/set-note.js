const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-note')
        .setDescription('set your note.')
        .addStringOption(option => option.setName('note').setDescription('what do you want to be your note').setRequired(true)),

    async execute(interaction) {
        const note = interaction.options.getString('beleska')

        if(note.length > 1000) await interaction.reply({ content: 'your note cannot be larger than **1000** characters!' })
        if(note.length < 5) await interaction.reply({ content: 'your note needs to be atleast **5** chaarcters!' })

        await handler(interaction.user.id).then(async () => {
            await handler.changeNote(interaction.user.id, note)
        })

        await interaction.reply({ content: `Your note is now: \n\`${note}!\`` })
    },
};