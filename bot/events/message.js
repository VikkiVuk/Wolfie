const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        if (message.author.bot) return;

        const loweredMsg = message.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')

        if (message.guild) {
            const intuser = await handler.getUser(`${message.author.id}`)
            await intuser.modify("xp", 1, "ADD")
            const xp = await intuser.getkey("xp")
            const level = await intuser.getkey("level")

            if (xp > level * 40 + 15) {
                await intuser.modify("level", 1, "ADD")
                //message.channel.send(`Hello ${message.author}, you just JUMPED to the next level! You are now **level ${level +1}**` )
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
        }

        const englishInsults = ["nigga", "nigg", "nigeria", "negus", "nickgurr", "nword", "tosser", "wanker", "slag", "cheeseeatingsurrendermonkeys", "losttheplot", "daftcow", "arsehole", "barmy", "chav", "dodgy", "git", "gormless", "manky", "minger", "muppet", "naff", "nutter", "pikey", "pillock", "plonker", "prat", "scrubber", "trollop", "uphillgardener", "knobhead", "pissoff", "bellend", "lazysod", "skiver", "knob", "wazzock", "ninny", "berk", "airyfairy", "anklebiters", "arselicker", "arsemonger", "chuffer", "daftasabush", "deadfromtheneckup", "gannet", "gonetothedogs", "ligger", "likeadogwithtwodicks", "madasabagofferrets", "maggot", "mingebag", "notbattingonafullwicket", "plugugly"]
        const englishNsfwStuff = ["fuck", "hentai", "fck", "fucku", "vagina", "daddy", "cunt", "pussy", "penis", "dick", "cock", "boob", "tit", "ass", "bunda", "anus", "cum", "nsfw", "porn", "sperm", "shaft", "jizz", "sex"]
        const serbianInsults = ["suka","crnja", "cigan", "crn", "jebi", "nahasasmisetarzancica", "liznesmepodmisku", "rimtutitukidumebaokao", "sisutiskrbavu", "celavatikeva", "smrditiizustakokonjuizdupeta", "pickatiseogadilakuractiseosladio", "pucaletijebokevu", "jebemlitisirairakiju", "seremtisepodsitnozito", "posrcesmiđanicunaslamcicu", "naprskamtiseprekopudera", "jedigovnasitpapijvode", "katizveknemsamarnigovnatinecebuduslatka", "shramtebilo"]
        const serbianNsfwStuff = ["blyat","picka", "kurac", "sperme", "spermatozoid", "sperma", "vadzina", "vajayjay", "vadzajdzaj", "pičk", "dupe", "pickica"]

        if (message.member) {
            //if (!message.member.roles.cache.has(nofilterrole)) {
                //if (englishInsults.some(s => loweredMsg.includes(s)) || englishNsfwStuff.some(s => loweredMsg.includes(s)) || serbianInsults.some(s => loweredMsg.includes(s)) || serbianNsfwStuff.some(s => loweredMsg.includes(s))) {
                    if (message.author.id === client.user.id || message.member.roles.cache.has('873680682096947210')) return;
                    try {
                        const config = await configHand.configuration(`${message.guild.id}`)
                        if (config.filterEnabled === true) {

                        }
                    } catch {
                        // no permissions.
                    }
               // }
            }
        //}
    }
}
