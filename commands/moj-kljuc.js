const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const random = require('../utility/generateRandom.js')
const tvojbroj = require('../utility/tvojbroj.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moj-kljuc')
    .setDescription('Hmmmmm.... Jel si ti ili neko stvaran?'),
  
  async execute(interaction) {
      await interaction.deferReply()
      const randomString = await random.randomNumber(1,20) + await random.randomNumber(1,6) + await random.randomLetter() + await random.randomNumber(1,30) + await random.randomNumber(1,7) + await random.randomLetter() + await random.randomNumber(1,11) + await random.randomLetter() + await random.randomLetter() 
      const newString = await tvojbroj.noviBroj(interaction.guild_id, interaction.user.id, randomString)
            
      const embed = new Discord.MessageEmbed()
        .setTitle('TAJNI KLJUC')
        .setDescription('Zdravo <@' + interaction.user.id + '>, vidim da si pokrenuo ovu komandu. Pa evo tvog kljuca **' + newString + '**. Ovaj kljuc nemoj nikom da dajes. Ukoliko si rekao nekome ovaj kljuc, samo pokreni ponovo komandu, i moci ces da promenis kljuc. \n \n Ovaj kljuc sluzi za verifikaciju da si to ti. Ako te moderator ili admin pita, daj mu slobodno, ali ako je neko ispod moderatora ili admina i nije vlasnik, onda mu nemoj dati. Ovaj broj je **jako vazan**.')
        .setTimestamp()
        .setFooter('Auto VikkiVuk')
        .setColor('#0091ff')

      interaction.user.send({ embeds: [embed] }).catch(() => {
          interaction.editReply({ content: `❌ Izvini nisam mogao da ti posaljem dm!`, ephemeral: true })
      }).then(() => {
          interaction.editReply({ content: '✅ Pogledaj dm!', ephemeral: true })
      })
    },
};