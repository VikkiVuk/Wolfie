const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
       .setName('mute')
       .setDescription('Ovako moderatori mogu da utisaju ljude koji su bezobrazni.')
       .addUserOption(option => option.setName("korisnik").setDescription("Koga da muteas??").setRequired(true)),
  
    async execute(interaction) {
        const member = interaction.options.getMember('korisnik')

        member.roles.add(member.guild.roles.cache.get('690858597969690624'))
        member.roles.remove(member.guild.roles.cache.get('687599618002911239'))

        await interaction.reply({ content: `Korisnik <@${member.user.id}> je sad mutav.` })
    },
};