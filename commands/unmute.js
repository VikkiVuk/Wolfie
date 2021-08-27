const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
       .setName('unmute')
       .setDescription('Ovako moderatori mogu unmute-aju ljude.')
       .addUserOption(option => option.setName("korisnik").setDescription("Koga da un-muteas??").setRequired(true)),
  
    async execute(interaction) {
        const member = interaction.options.getMember('korisnik')

        member.roles.remove(member.guild.roles.cache.get('878606227045756954')).catch(async (e) => {
            await interaction.reply({ content: `Korisnik nije ni bio mutav.` })
        })
        member.roles.add(member.guild.roles.cache.get('878606227045756952'))

        await interaction.reply({ content: `Korisnik <@${member.user.id}> vise nije mutav.` })
    },
};