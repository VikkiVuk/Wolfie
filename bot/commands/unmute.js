const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Ovako moderatori mogu da unmuteaju ljude.")
        .addUserOption(option => option.setName("korisnik").setDescription("Koga?").setRequired(true)),

    async execute(interaction) {
        const member = interaction.options.getMember('korisnik')

        if (!member.roles.cache.has('878606227045756954')) {
            await interaction.reply({ content: `Korisnik <@${member.user.id}> nije ni bio mutav.` })
        } else {
            await member.roles.remove(member.guild.roles.cache.get('878606227045756954'))
            await member.roles.add(member.guild.roles.cache.get('878606227045756952'))

            await interaction.reply({ content: `Korisnik <@${member.user.id}> vise nije mutav.` })
        }
    },
};