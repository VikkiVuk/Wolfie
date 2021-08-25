const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('proveri-kljuc')
    .setDescription('Ovako se proverava kljuc nekom memberu.')
    .addUserOption(option => option.setName('korisnik').setDescription('Kome zelite da proverite kljuc').setRequired(true))
    .addStringOption(option => option.setName('kljuc').setDescription("Ovde ukucaj te kljuc koji zelite da proverite.").setRequired(true)),
  
  async execute(interaction) {
    const tvojbroj = require('../utility/tvojbroj.js')
    const user = interaction.options.getUser('korisnik')
    const number = interaction.options.getString('kljuc')
        
    const broj = await tvojbroj.dobijBroj(interaction.guildId, user.id)

    if(!broj == '00000' && broj == number) {
        // tacan broj
        const tacanBrojEmbed = new MessageEmbed()
        .setTitle(`TVOJ BROJ`)
        .setDescription(`Broj **${number}** jeste broj korisnika <@${user.id}>!`)
        .setColor('#0091ff')
        .setTimestamp()
        .setFooter('Auto VikkiVuk')

        await interaction.reply({ embeds: [tacanBrojEmbed] })
    } else if (!broj == '00000') {
        // nije tacan broj
        const netacanBrojEmbed = new MessageEmbed()
        .setTitle(`TVOJ BROJ`)
        .setDescription(`Broj **${number}** nije broj korisnika <@${user.id}>!`)
        .setColor('#0091ff')
        .setTimestamp()
        .setFooter('Auto VikkiVuk')

        await interaction.reply({ embeds: [netacanBrojEmbed] })
    } else {
        // nema broj
        const nemaBrojEmbed = new MessageEmbed()
        .setTitle(`TVOJ BROJ`)
        .setDescription(`Korisnik <@${user.id}> nema broj trenutno!`)
        .setColor('#0091ff')
        .setTimestamp()
        .setFooter('Auto VikkiVuk')

        await interaction.reply({ embeds: [nemaBrojEmbed] })
    }
  },
};