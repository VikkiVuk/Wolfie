const handler = require('../utility/user-handler')

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        if (message.author.bot) return;

        const loweredMsg = message.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')

        if (message.channel.type !== 'DM') {
            await handler(message.author.id).then(async result => {
                await handler.changeXP(message.author.id, true, 1)
                const xp = await handler(message.author.id).then(result => {
                    return result.xp
                })
                const level = await handler(message.author.id).then(result => {
                    return result.level
                })

                if (xp > level * 40 + 15) {
                    await handler.changeLevel(message.author.id, true, 1)
                    message.channel.send(`Zdravo ${message.author}, ti si skocio na **level ${level + 1}**. Samo tako nastavi!`)
                }

                const levelroles = message.guild.roles.cache.filter(r => r.name.includes("Level:"))
                for (const role of levelroles) {
                    const roleName = role[1].name
                    const roleValue = roleName.replace("Level: ", "")
                    if (level >= roleValue) {
                        if (!message.member.roles.cache.find(r => r.name === roleName)) {
                            message.member.roles.add(role)
                        }
                    }
                }
            })

            if (message.channel.id === '878606227595227164' || message.channel.id === '878606227595227165' || message.channel.id === '878606227800719440' || message.channel.id === '878606227800719441') {
                message.delete()
            }

            const englishInsults = ["nigga", "nigg", "nigeria", "negus", "nickgurr", "nword", "tosser", "wanker", "slag", "cheeseeatingsurrendermonkeys", "losttheplot", "daftcow", "arsehole", "barmy", "chav", "dodgy", "git", "gormless", "manky", "minger", "muppet", "naff", "nutter", "pikey", "pillock", "plonker", "prat", "scrubber", "trollop", "uphillgardener", "twit", "knobhead", "pissoff", "bellend", "lazysod", "skiver", "knob", "wazzock", "ninny", "berk", "airyfairy", "anklebiters", "arselicker", "arsemonger", "chuffer", "daftasabush", "deadfromtheneckup", "gannet", "gonetothedogs", "ligger", "likeadogwithtwodicks", "madasabagofferrets", "maggot", "mingebag", "notbattingonafullwicket", "plugugly"]
            const englishNsfwStuff = ["fuck", "hentai", "fck", "fucku", "vagina", "daddy", "cunt", "pussy", "penis", "dick", "cock", "boobs", "ass", "bunda", "anus", "cum", "nsfw", "porn", "sperm", "shaft", "jizz"]
            const serbianInsults = ["crnja", "cigan", "crn", "jebi", "nahasasmisetarzancica", "liznesmepodmisku", "rimtutitukiđumebaokao", "sisutiskrbavu", "celavatikeva", "smrditiizustakokonjuizdupeta", "pickatiseogadilakuractiseosladio", "pucaletijebokevu", "jebemlitisirairakiju", "seremtisepodsitnozito", "posrcesmiđanicunaslamcicu", "naprskamtiseprekopudera", "jedigovnasitpapijvode", "katizveknemsamarnigovnatinecebuduslatka", "shramtebilo"]
            const serbianNsfwStuff = ["picka", "kurac", "sperme", "spermatozoid", "sperma", "vadzina", "vajijaj", "vadzajdzaj", "pičk", "dupe", "pickica"]

            if (englishInsults.some(s => loweredMsg.includes(s)) || englishNsfwStuff.some(s => loweredMsg.includes(s)) || serbianInsults.some(s => loweredMsg.includes(s)) || serbianNsfwStuff.some(s => loweredMsg.includes(s))) {
                if (message.author.id === client.user.id || message.member.roles.cache.has('873680682096947210')) return;
                message.delete()
                message.author.send("stop vredjati se.").catch(() => {
                    message.channel.send(`${message.author} stop vredjati se.`)
                })
            } else if (loweredMsg.includes("boba") || loweredMsg.includes("bubbletea")) {
                message.delete()
                message.author.send("NO. BOBA. ALLOWED.").catch(() => {
                    message.channel.send(`${message.author} NO. BOBA. ALLOWED.`)
                })
            }
        }
    }
}
