const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const handler = new BotModule.UserModule()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-note')
        .setDescription('set your note.')
        .addStringOption(option => option.setName('note').setDescription('what do you want to be your note').setRequired(true)),

    async execute(interaction) {
        const note = interaction.options.getString('note')
        const intuser = await handler.getUser(`${interaction.user.id}`)

        if(note.length > 1000) await interaction.reply({ content: 'your note cannot be larger than **1000** characters!' })
        if(note.length < 5) await interaction.reply({ content: 'your note needs to be atleast **5** chaarcters!' })

        await intuser.modify("note", note, "SET")

        await interaction.reply({ content: `Your note is now: \n\`${note}!\`` })
    },
};