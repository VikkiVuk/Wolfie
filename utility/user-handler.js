const schema = require('./schemas/user-schema')

module.exports = async(userid) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { return result } else { await new schema({ userid: userid, money: 0, inventory: "Cricket:1", xp: 0, level: 0, note: "" }).save(); return "NEW" }
}

module.exports.changeMoney = async(userid, add, amnt) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { if (add) { await schema.updateOne({userid: userid}, {$inc: {money: +amnt}}) } else { await schema.updateOne({userid: userid}, {$inc: {money: -amnt}}) } }
}

module.exports.changeXP = async(userid, add, amnt) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { if (add) { await schema.updateOne({userid: userid}, {$inc: {xp: +amnt}}) } else { await schema.updateOne({userid: userid}, {$inc: {xp: -amnt}}) } }
}

module.exports.changeLevel = async(userid, add, amnt) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { if (add) { await schema.updateOne({userid: userid}, {$inc: {level: +amnt}}) } else { await schema.updateOne({userid: userid}, {$inc: {level: -amnt}}) } }
}

module.exports.changeNote = async(userid, what) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { await schema.updateOne({userid: userid}, {note: what}) }
}

module.exports.checkItems = async (userid) => {
    const result = await schema.findOne({ userid: userid })
    if (result) { return result.inventory.split(',') }
}

module.exports.addItem = async(userid, amnt, itemname) => {
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

module.exports.removeItem = async(userid, amnt, itemname) => {
    const result = await schema.findOne({ userid: userid })
    if (result) {
        const items = result.inventory.split(',')
        const hasItem = result.inventory.includes(itemname)

        if (hasItem) {
            for (const item of items) {
                const itemparts = item.split(":")
                if (itemparts[0] === itemname) {
                    const newItems = result.inventory.replace(`,${itemname}:${itemparts[1]}`, "").toString()

                    await schema.updateOne({ userid: userid }, { inventory: newItems })
                }
            }
        }
    }
}

module.exports.hasItem = async(userid, itemname) => {
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