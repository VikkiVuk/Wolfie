const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: {
        name: "Unmute",
        type: 2
    },

    async execute(interaction) {
        const member = interaction.options.getMember('user')

        if (!member.roles.cache.has('878606227045756954')) {
            await interaction.reply({ content: `Korisnik <@${member.user.id}> nije ni bio mutav.` })
        } else {
            await member.roles.remove(member.guild.roles.cache.get('878606227045756954'))
            await member.roles.add(member.guild.roles.cache.get('878606227045756952'))

            await interaction.reply({ content: `Korisnik <@${member.user.id}> vise nije mutav.` })
        }
    },
};