const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription('bro you are a psychopath... and i like it.')
        .addUserOption(option => option.setName("target").setDescription("who do you want to kill?").setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser("target")

        if (user.id === interaction.user.id) {
            await interaction.reply({ content: `I do not condone suicide.` })
            return
        }

        const poruke = [
            "had a stroke",
            "died peacefully in his sleep",
            "was pushed off a cliff",
            "had a heart attack",
            "has been poked to death",
            "said the N-word",
            "died",
            "ate cyanide",
            "was poisoned",
            "didnt eat properly",
            "was dehydrated",
            "tried to play in the streets",
            "fat shamed a kid, and then something shocking happened"
        ]

        const response = poruke[Math.floor(Math.random() * poruke.length)]
        const shouldDie = Math.random() < 0.20

        if (shouldDie) {
            await interaction.reply({ content: `<@${user.id}> didnt die, but <@${interaction.user.id}> ${response}`})
        } else {
            await interaction.reply({ content: `<@${user.id}> ${response}`})
        }
    },
};