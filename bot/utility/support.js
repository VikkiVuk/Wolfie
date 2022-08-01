const Discord = require('discord.js')
const config = require('../config.json')
const wait = require('util').promisify(setTimeout);
let channels = ["889538860604874792"]

module.exports = async (client) => {
    const channelId = "889538860604874792"
    const categoryId = "889538860122533896"

    const channel = await client.channels.fetch(channelId)
    const embed = new Discord.MessageEmbed().setTitle("Support").setDescription("Use the button below this message to open a ticket").addField("When should you open a ticket?", "Open a ticket only when you want to report rule-breakers or when you need help with something else (for example, vikkivuk id or other vikkivuk projects). If you'd like to suggest something for Wolfie, you can do that using the `/suggest` command.").setFooter({text:config.defaultFooter}).setColor("GREEN").setTimestamp()
    const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('support-open').setStyle("PRIMARY").setLabel("🎫 Open Ticket"))

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
                    await interaction.user.send({ content: `Sorry, you already have a ticket open, please resolve the ticket before opening a new one.` })
                    return
                }
    
                const user = interaction.user
                const guild = interaction.guild
    
                guild.channels.create(`ticket-${user.id}`, {
                    type: "GUILD_TEXT"
                }).then(async (channel) => {
                    await channel.setParent(categoryId);
                    await wait(1000)
    
                    await channel.permissionOverwrites.create(guild.id, {VIEW_CHANNEL: false});
                    await channel.permissionOverwrites.create(user.id, {VIEW_CHANNEL: true, SEND_MESSAGES: true});

                    await channel.permissionOverwrites.create("889538858880995342", {VIEW_CHANNEL: true, SEND_MESSAGES: true});
                    await channel.permissionOverwrites.create("889538858880995341", {VIEW_CHANNEL: true, SEND_MESSAGES: true});
                    await channel.permissionOverwrites.create("889538858880995338", {VIEW_CHANNEL: true, SEND_MESSAGES: true});


                    const row2 = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('support-close').setStyle("DANGER").setLabel("🗑️ Close Ticket"))

                    await channel.send({ content: `<@${user.id}>, it's all you now. Please explain your issue in the best way you can`, components: [row2]})
                }).catch(console.error);
            } else if (interaction.customId == 'support-close') {
                if (interaction.channel.name.includes(`ticket-`)) {
                    await interaction.reply({ content: 'On it, this ticket will close in 5 seconds.' })
                    await wait(5000)
                    interaction.channel.delete()
                }
            }
        }
    })
}