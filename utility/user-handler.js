const schema = require('./schemas/user-schema')
const factorschema = require('./schemas/2fa-schema')
const Stream = require('stream')
const Discord = require('discord.js')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const uuid = require('uuid')

module.exports = async(userid = Number) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { return result } else { await new schema({ userid: userid, uuid: "", money: 0, inventory: "Cricket:1", xp: 0, level: 0, note: "", messages: "Wolfie:Dobrodosao u Wolfie bota nadam se da ce ti se svideti.", daily: new Date(0), warns: 0 }).save(); return "NEW" }
}

module.exports.changeMoney = async(userid = Number, add = Boolean, amnt = Number) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { if (add) { await schema.updateOne({userid: userid}, {$inc: {money: +amnt}}) } else { await schema.updateOne({userid: userid}, {$inc: {money: -amnt}}) } }
}

module.exports.changeXP = async(userid = Number, add = Boolean, amnt = Number) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { if (add) { await schema.updateOne({userid: userid}, {$inc: {xp: +amnt}}) } else { await schema.updateOne({userid: userid}, {$inc: {xp: -amnt}}) } }
}

module.exports.changeLevel = async(userid = Number, add, amnt) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { if (add) { await schema.updateOne({userid: userid}, {$inc: {level: +amnt}}) } else { await schema.updateOne({userid: userid}, {$inc: {level: -amnt}}) } }
}

module.exports.changeNote = async(userid = Number, what = String) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { await schema.updateOne({userid: userid}, {note: what}) }
}

module.exports.register2FA = async(user = Discord.User) => {
    const aa = await schema.findOne({userid: user.id})
    if (aa.uuid === "" || !aa.uuid) {
        const id = uuid.v4();

        try {
            const temp_secret = speakeasy.generateSecret({
                name: "Wolfie: " + user.username
            });

            let newUser = await new factorschema({
                id: id,
                temp_secret: temp_secret.base32,
                secret: "waiting"
            }).save()

            await schema.updateOne({ userid: user.id }, { uuid: id })

            async function createStream() {
                const stream = new Stream.Transform({
                    transform(chunk, encoding, callback) {
                        this.push(chunk)
                        callback()
                    }
                })
                await qrcode.toFileStream(stream, temp_secret.otpauth_url)
                return stream
            }
            let scan = await createStream()

            return { userid: id, temp_secret: temp_secret, qrcode: scan }
        } catch (err) {
            return "ERROR"
        }
    } else {
        return "ALREADY_REGISTERED"
    }
}

module.exports.verify2FA = async(user = Discord.User, token = Number) => {
    try {
        const uuid = await schema.findOne({ userid: user.id }).then(result => { return result.uuid })
        const acu = await factorschema.findOne({ id: uuid })

        const secret = acu.temp_secret;
        const verified = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token
        });

        if (verified) {
            await factorschema.updateOne({ id: uuid }, { id: uuid, temp_secret: "invalidated", secret: secret });
        }

        return verified
    } catch (err) {
        console.log(err);
        return "ERROR"
    }
}

module.exports.validate2FA = async(user = Discord.User, token = Number) => {
    try {
        const uuid = await schema.findOne({ userid: user.id }).then(result => { return result.uuid })
        const acu = await factorschema.findOne({ id: uuid })

        const secret = acu.secret;
        const tokenValidated = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token,
            window: 1
        });

        return tokenValidated
    } catch (err) {
        console.error(err)
        return "ERROR"
    }
}

module.exports.warnUser = async(user = Discord.UserManager) => {
    const result = await schema.findOne({ userid: user.id })
    if (result) {
        if (!user.bot) {
            await schema.updateOne({ userid: user.id }, { $inc: {warns: +1} })
            await user.send({content: `Neko te je upozorio! Pazi se, jer ako imas dovoljno upozorenja mozes da **DOBIJES BAN** ili **KICK**. \n \nSada imas \`${result.warns + 1}\` upozorenja!`}).catch(err => {
                return "ERROR"
            })
            return "SUCCESS"
        } else {
            return "BOT"
        }
    }
}

module.exports.updateDaily = async(userid = Number, date = Date) => {
    const result = await schema.findOne({ userid: userid })
    if (result) {
        await schema.updateOne({ userid: userid }, { daily: Date.now() })
    }
}

module.exports.checkDaily = async(userid = Number) => {
    const result = await schema.findOne({ userid: userid })
    if (result) {
        const then = new Date(result.daily).getTime()
        const now = new Date().getTime()

        const diffTime = Math.abs(now - then)
        return Math.round(diffTime / (1000 * 60 * 60 * 24))
    }
}

module.exports.sendMessage = async(receiver = Number, sender = Number, message = String) => {
    const result = await schema.findOne({ userid: receiver })

    if (result) {
        const newMessages = result.messages.concat(`,${sender}:${message.replace(/,/g, '')}`)

        await schema.updateOne({ userid: receiver }, { messages: newMessages })
    }
}

module.exports.checkMessages = async(userid = Number) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { return result.messages.split(',') }
}

module.exports.checkItems = async (userid = Number) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { return result.inventory.split(',') }
}

module.exports.addItem = async(userid = Number, amnt = Boolean, itemname = String) => {
    const result = await schema.findOne({ userid: userid })
    if (result) {
        const items = result.inventory.split(',')
        const hasItem = result.inventory.includes(itemname)

        if (hasItem) {
            for (const item of items) {
                const itemparts = item.split(":")
                if (itemparts[0] === itemname) {
                    const newAmnt = +itemparts[1] + +amnt
                    const newItem = `${itemparts[0]}:${newAmnt}`
                    const newItems = result.inventory.replace(`${itemname}:${itemparts[1]}`, newItem).toString()

                    await schema.updateOne({ userid: userid }, { inventory: newItems })
                }
            }
        } else {
            const newItems = result.inventory.concat(`,${itemname}:${amnt}`)

            await schema.updateOne({ userid: userid }, { inventory: newItems })
        }
    }
}

module.exports.removeItem = async(userid = Number, amnt = Boolean, itemname = String) => {
    const result = await schema.findOne({ userid: userid })
    if (result) {
        const items = result.inventory.split(',')
        const hasItem = result.inventory.includes(itemname)

        if (hasItem) {
            for (const item of items) {
                const itemparts = item.split(":")
                if (itemparts[0] === itemname) {
                    if(itemparts[1] > amnt) {
                        const newItems = result.inventory.replace(`,${itemname}:${itemparts[1]}`, `,${itemname}:${itemparts[1] - amnt}`).toString()

                        await schema.updateOne({ userid: userid }, { inventory: newItems })
                    } else {
                        const newItems = result.inventory.replace(`,${itemname}:${itemparts[1]}`, "").toString()

                        await schema.updateOne({ userid: userid }, { inventory: newItems })
                    }
                }
            }
        }
    }
}

module.exports.hasItem = async(userid = Number, itemname = String) => {
    const result = await schema.findOne({ userid: userid })
    if (result) {
        const hasItem = result.inventory.includes(itemname)

        if (hasItem) {
            return true
        } else {
            return false
        }
    }
}