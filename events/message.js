const handler = require('../utility/user-handler')

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        if (message.author.bot) return;

        const loweredMsg = message.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')

        if (message.channel.type !== 'DM') {
            await handler.changeXP(message.author.id, true, 1)
            const xp = await handler(message.author.id).then(result => { return result.xp })
            const level = await handler(message.author.id).then(result => { return result.level })

            if (xp > level * 40 + 15) {
                await handler.changeLevel(message.author.id, true, 1)
                message.channel.send(`<@${message.author.id}> Zdravo! Ti si se level upovao, ti si sad **level ${level + 1}**!`)
            }

            if (message.channel.id === '878606227595227164' || message.channel.id === '878606227595227165' || message.channel.id === '878606227800719440' || message.channel.id === '878606227800719441') {
                message.delete()
            }

            if (loweredMsg.includes('glup') || loweredMsg.includes('dumb') || loweredMsg.includes('idiot') || loweredMsg.includes('nisipametan') || loweredMsg.includes('retard') || loweredMsg.includes('debil') || loweredMsg.includes('glupak') || loweredMsg.includes('stupid') || loweredMsg.includes('nesipametan') || loweredMsg.includes('stoopid') || loweredMsg.includes('nigga') || loweredMsg.includes('fuck') || loweredMsg.includes('kurac')) {
                if (message.author.id === client.user.id || message.member.roles.cache.has('873680682096947210')) return;
                message.delete()
                message.author.send("stop vredjati se.").catch(() => {
                    message.reply('stop vredjati se.')
                })
            } else if (loweredMsg.includes("boba") || loweredMsg.includes("bubble tea")) {
                message.delete()
                message.author.send("no bobas.").catch(() => {
                    message.reply('no bobas.')

                })
            }
        }
    }
}
