const { MessageEmbed,MessageAttachment, ClientVoiceManager} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const DisTube = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('muzika')
        .setDescription('Ovo je komanda za testiranje uglavnom.')
        .addSubcommand(command => command.setName("pusti").setDescription("Pusti neku pesmu u voice channel.").addStringOption(option => option.setName("ime").setDescription("Ime pesme").setRequired(true))),

    async execute(interaction, client) {
        const distube = new DisTube.default(client)
        const command = interaction.options.getSubcommand()
        await interaction.reply({ content: `Pustam pesmu...` }, { fetchReply: true })

        if (command === "pusti") {
            const name = interaction.options.getString("ime")
            if (interaction.member.voice) {
                await distube.playVoiceChannel(interaction.member.voice.channel, name).then(async () => {
                    await interaction.editReply({content: `▶️ | Pustio sam ${name} pesmu.`})
                }).catch(async error => {
                    await interaction.editReply({content: `Doslo je do greske.`})
                })
            }
        }
    },
};