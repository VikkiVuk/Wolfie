const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Ovako moderatori mogu da muteaju ljude, da nebi pricali.")
        .addUserOption(option => option.setName("korisnik").setDescription("Koga?").setRequired(true)),

    async execute(interaction) {
        const member = interaction.options.getMember('korisnik')

        if (member.roles.cache.has('878606227045756954')) {
            await interaction.reply({ content: `Korisnik <@${member.user.id}> je vec mutav.` })
        } else {
            await member.roles.add(member.guild.roles.cache.get('878606227045756954'))
            await member.roles.remove(member.guild.roles.cache.get('878606227045756952'))

            await interaction.reply({ content: `Korisnik <@${member.user.id}> je sad mutav.` })
        }
    },
};