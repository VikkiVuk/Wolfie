const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")

module.exports = {
    data: {
        name: "Mute",
        type: 2
    },

    async execute(interaction) {
        const member = interaction.options.getMember('user')

        member.roles.add(member.guild.roles.cache.get('878606227045756954'))
        member.roles.remove(member.guild.roles.cache.get('878606227045756952'))

        await interaction.reply({ content: `Korisnik <@${member.user.id}> je sad mutav.` })
    },
};