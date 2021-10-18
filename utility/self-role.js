const firstmessage = require('./first-message.js')
const Discord = require('discord.js')

module.exports = async (client) => {
    const channelId = "879842580907585596"

    const getEmoji = key => client.emojis.cache.find(emoji => emoji.name === key)

    const emojies = {
        naughtycat: "[🔞] Perverzan",
        thumbsup_cry: "[🔥] Bruh Gang",
        cuteturtle: "[🏅] Gold Role",
        flames: "Youtube Videos Ping",
        imgoingcrazy: "Random Pings",
        animatedexclamation: "Wolfie Updates Ping",
        Minecraft: "[🎮] Gejmer"
    }

    const items = []

    for (const key in emojies) {
        const emoji = getEmoji(key)
        const role = emojies[key]
        
        const option = {label: role, description: null, value: role, emoji: emoji}
        items.push(option)
    }

    const sclMenu = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setCustomId('self-role').setPlaceholder('Izaberi svoje rolove.').setMaxValues(items.length).addOptions(items))

    const channel = await client.channels.fetch(channelId)
  
    channel.messages.fetch().then((messages) => {
      if (messages.size === 0) {
        channel.send({ content: `@everyone, ovde mozete da dobijete vase rolove koje zelite, samo kliknite na ovaj select menu ispod i izaberite rolove, mozete da izaberete vise od jednom.`, components: [sclMenu] })
      } else {
        for (const message of messages) {
            // un comment this code to update self roles
          //message[1].edit({ content: `@everyone, ovde mozete da dobijete vase rolove koje zelite, samo kliknite na ovaj select menu ispod i izaberite rolove, mozete da izaberete vise od jednom.`, components: [sclMenu] })
        }
      }
    })

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isSelectMenu()) {
            if (interaction.customId == 'self-role') {
                const member = interaction.member

                const removed = interaction.component.options.filter((option) => {
                    return !interaction.values.includes(option.value)
                })

                for (const id of removed) {
                    member.roles.remove(interaction.guild.roles.cache.find(r => r.name === id.value))
                }

                for (const id of interaction.values) {
                    member.roles.add(interaction.guild.roles.cache.find(r => r.name === id))
                }

                await interaction.reply({ content: `Rolovi su ti promenjeni!`, ephemeral: true })
            }
        }
    })
}