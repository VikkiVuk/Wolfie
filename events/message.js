module.exports = {
    name: 'messageCreate',
	once: false,
	async execute (message, client) {
        if (message.author.bot) return;

        const economy = require('../utility/economy.js')

        if (message.channel.id == '870244833539788810' || message.channel.id == '778745651525189652' || message.channel.id == '791996061803216926' || message.channel.id == '873869795563565106') {
            message.delete()
        }

        if (!message.channel.type === 'dm') {
            await economy.addXp(message.guild.id, message.author.id, 1) 
            const xp = await economy.getXp(message.guild.id, message.author.id)
            const level = await economy.getLevel(message.guild.id, message.author.id)
    
            if (xp > level * 40 + 15) {
                const newLevel = await economy.addLevels(message.guild.id, message.author.id, 1)
                message.channel.send(`<@${message.author.id}> Zdravo! Ti si se level upovao, ti si sad **level ${newLevel}**!`)
            }

            const loweredMsg = message.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
    
            if (loweredMsg.includes('glup') || loweredMsg.includes('dumb') || loweredMsg.includes('idiot') || loweredMsg.includes('nisipametan') || loweredMsg.includes('retard') || loweredMsg.includes('debil') || loweredMsg.includes('glupak') || loweredMsg.includes('stupid') || loweredMsg.includes('nesipametan') || loweredMsg.includes('stoopid') || loweredMsg.includes('nigga') || loweredMsg.includes('fuck') || loweredMsg.includes('kurac')) {
                if (message.author.id == client.user.id || message.member.roles.cache.has('873680682096947210')) {
                    return
                } else {
                    message.delete()
                    message.author.send("stop vredjati se.").catch(() => {
                        message.reply('stop vredjati se.')
                        return
                    })
                }
            } else if (loweredMsg.includes("boba") || loweredMsg.includes("bubble tea")) {
                message.delete()
                message.author.send("no bobas.").catch(() => {
                    message.reply('no bobas.')
                    return
                })
            }
        }
    },
}