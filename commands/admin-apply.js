const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")

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

                interaction.user.send("Hvala sto si se applyovao za admina, vikkivuk ce uskoro da ti pregleda application. Dobices DM od mene ako si acceptan ili rejectan.").catch(() => {return})
                const appchannel = interaction.guild.channels.cache.get('881923593452281896')
                const embed = new MessageEmbed().setTitle(`${interaction.user.username}-ov admin apply`).setDescription(`Ovde su njegovi odgovori, da bi ga prihvatio samo ukucaj "accept <@${interaction.user.id}>"`).setFooter(config.defaultFooter).setTimestamp().setColor("RED")

                let counter = 0
                collected.forEach((value) => {
                    embed.addField(questions[counter++], value.content)
                })

                appchannel.send({ embeds: [embed] })
            })
        }).catch(() => {return})
    }
}