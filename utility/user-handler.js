const schema = require('./schemas/user-schema')

module.exports = async(userid = Number) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { return result } else { await new schema({ userid: userid, money: 0, inventory: "Cricket:1", xp: 0, level: 0, note: "", messages: "Wolfie:Dobrodosao u Wolfie bota nadam se da ce ti se svideti.", daily: new Date(0) }).save(); return "NEW" }
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