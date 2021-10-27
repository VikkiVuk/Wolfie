const Discord = require('discord.js')
const config = require('../config.json')
const wait = require('util').promisify(setTimeout);

module.exports = async (client) => {
    const channelId = "878606227414868034"

    const channel = await client.channels.fetch(channelId)
    const embed = new Discord.MessageEmbed().setTitle("Dobij pomoc").setDescription("Koristite dugme ispod ove poruke da otvorite tiket sa nekim iz naseg staff tima.").addField("Trebate kontaktirati moderatora?", "Otvori tiket ovde! Kliknite na dugme ispod ove poruke da biste otvorili tiket za podršku sa timom osoblja iz ovog servera. Koristite ovo samo ako trebate da kontaktirate staff tim u vezi nečega na serveru. Izveštaji o prevarama o događajima u igri će odmah biti odbačeni, a ponovljeni prestupnici će biti stavljeni na crnu listu za korišćenje sistema tiketa. Ako treba da dodate dodatne informacije nakon što ste poslali svoju prvu poruku, pošaljite poruku u tiket channel.").setFooter(config.defaultFooter).setColor("GREEN").setTimestamp()
    const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('support-open').setStyle("PRIMARY").setLabel("🎫 Otvori ticket"))

    channel.messages.fetch().then((messages) => {
      if (messages.size === 0) {
          channel.send({ embeds: [embed], components: [row] })
      } else {
        //for (const message of messages) {
          messages.first().edit({ embeds: [embed], components: [row] })
        //}
      }
    })

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId == 'support-open') {
                await interaction.deferUpdate()

                if(interaction.guild.channels.cache.some(channel => channel.name === `ticket-${interaction.user.id}`)) {
                    await interaction.user.send({ content: `Izvini, vec imas otvoren ticket, molim te ga zatvori pre nego sto nastavis.` })
                    return
                }
    
                const user = interaction.user
                const guild = interaction.guild
    
                guild.channels.create(`ticket-${user.id}`, {
                    type: "GUILD_TEXT"
                }).then(async (channel) => {
                    await channel.setParent('878606227414868033');
                    await wait(1000)
    
                    await channel.permissionOverwrites.create(guild.id, {VIEW_CHANNEL: false});
                    await channel.permissionOverwrites.create(user.id, {VIEW_CHANNEL: true, SEND_MESSAGES: true});

                    await channel.permissionOverwrites.create("878606227058335827", {VIEW_CHANNEL: true, SEND_MESSAGES: true});
                    await channel.permissionOverwrites.create("878606227058335828", {VIEW_CHANNEL: true, SEND_MESSAGES: true});
                    await channel.permissionOverwrites.create("878606227058335831", {VIEW_CHANNEL: true, SEND_MESSAGES: true});
                    await channel.permissionOverwrites.create("878606227058335826", {VIEW_CHANNEL: true, SEND_MESSAGES: false});


                    const row2 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('support-close').setStyle("DANGER").setLabel("🗑️ Zatvori ticket"))

                    await channel.send({ content: `Zdravo! Korisnik <@${user.id}> je otvorio ovaj support ticket. Da bi ga zatvorili, samo kliknite na dugme ispod.`, components: [row2]})
                }).catch(console.error);
            } else if (interaction.customId == 'support-close') {
                if (interaction.member.roles.cache.has('878606227058335828')) {
                    if (interaction.channel.name.includes(`ticket-`)) {
                        await interaction.reply({ content: 'Ok, ovaj ticket ce se zatvoriti u roku od 5 sekundi.' })
                        await wait(5000)
                        interaction.channel.delete()
                    }
                } else {
                    if (interaction.channel.name.includes(interaction.user.id)) {
                        await interaction.reply({ content: 'Ok, ovaj ticket ce se zatvoriti u roku od 5 sekundi.' })
                        await wait(5000)
                        interaction.channel.delete()
                    }
                }
            }
        }
    })
}