const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Trello = require('trello')
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");

module.exports = {
    data: new SlashCommandBuilder()
       .setName('admin-apply')
       .setDescription('Ovako mozes da se applyas da budes prvo trial mod pa mod pa admin.'),
  
    async execute(interaction) {
        const questions = [
            'Kako se zoves:',
            'Koliko godina imas:',
            'Zasto zelis da budes admin:',
            'Zasto bi bas tebe stavili kao admina:',
            'Sta bi uradio ako bi se neko reklamirao?',
            'Sta bi uradio ako bi neko vredjao nekog drugog:',
            'Sta bi uradio ako bi video da se 2 ili vise coveka svadjaju:',
            'Sta bi uradio ako bi video da ljudi koriste bot komande u caskanje:',
            'Sta bi uradio ako bi te neko iz servera dm-ovao:',
            'Sta bi uradio ako bi neko spam pingovao @Admin:',
            'Sta bi uradio ako bi neko bypassovao filter na auto vikkivuku:',
            'Sta bi uradio ako bi neko poslao link negde:',
            'Da li razumes da moras da pitas @VikkiVuk (@NotVikki) pre nego sto nesto promenis na serveru:',
            'Da li razumes da ako prekrsis neko pravilo bices demotovan:',
            'Da li si procitao sva pravila:',
            'Da li si na sve odgovorio iskreno:',
            'Da li prihvatas uslove VikkiVuk Community:'
        ] 
        
        await interaction.reply({ content: 'Proveri DM, imas 10 minuta da na sva pitanja odgovoris.', ephemeral: true })
          
        interaction.user.createDM().then(async (channel) => {
            let counter = 0
      
            const filter = m => m.author.id === interaction.user.id            

            const collector = await channel.createMessageCollector({
              filter,  
              max: questions.length,
              time: 1000 * 600, // 15s
            })
        
            interaction.user.send(questions[counter++]).catch(() => {return})

            collector.on('collect', (m) => {
              if (counter < questions.length) {
                interaction.user.send(questions[counter++])
              }
            })
        
            collector.on('end', (collected) => {
              if (collected.size < questions.length) {
                  interaction.user.send('Nisi odgovorio na vreme').catch(() => { return })
              }
        
              let counter = 0
              let last = ""
              collected.forEach((value) => {
                last += `${questions[counter++]} ${value.content} \n \n`
              })

              trello.addCard(`${interaction.user.username} (${interaction.user.id})`, last, '61139c7450d95e703ee845eb');
            })  
        }).catch(() => {return})
    }
}