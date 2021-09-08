const firstmessage = require('./first-message.js')

module.exports = (client) => {
    const channelId = "879842580907585596"

    const getEmoji = key => client.emojis.cache.find(emoji => emoji.name === key)

    const emojies = {
        naughtycat: "[🔞] Perverzan",
        thumbsup_cry: "[🔥] Bruh Gang",
        cuteturtle: "[🏅] Gold Role",
        flames: "Youtube Videos Ping",
        imgoingcrazy: "Random Pings",
        animatedexclamation: "Wolfie Updates Ping"
    }

    const reactions = []

    let emojiText = ''
    for (const key in emojies) {
        const emoji = getEmoji(key)
        reactions.push(emoji)

        const role = emojies[key]
        emojiText += `${emoji} = ${role}\n \n`
    }

    firstmessage(client, channelId, `@everyone, ovde mozete da dobijete vase rolove koje zelite. \n \n${emojiText}`, reactions)

    const handleReaction = (reaction, user, add) => {
        if (user.id === "796767730601558127") return;

        const emoji = reaction._emoji.name
        const roleName = emojies[emoji]
        const { guild } = reaction.message

        if (!roleName) return;

        const role = guild.roles.cache.find(role => role.name === roleName)
        const member = guild.members.cache.find(member => member.id === user.id)

        if (add) {
            member.roles.add(role)
        } else {
            member.roles.remove(role)
        }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, true)
        }
    })

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, false)
        }
    })
}