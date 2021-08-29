const inventory = require('./schemas/inventory-schema')

module.exports.checkItems = async (userid) => {
    const result = await inventory.findOne({ userId: userid })

    if (result) { return result.items.split(',') } else { await new inventory({ userId: userid, items: "Cricket:1" }).save() }
}

module.exports.addItem = async(userid, amnt, itemname) => {
    const result = await inventory.findOne({ userId: userid })

    if (result) {
        const items = result.items.split(',')
        const hasItem = result.items.includes(itemname)

        if (hasItem) {
            for (const item of items) {
                const itemparts = item.split(":")
                if (itemparts[0] === itemname) {
                    const newAmnt = +itemparts[1] + +amnt
                    const newItem = `${itemparts[0]}:${newAmnt}`
                    const newItems = result.items.replace(`${itemname}:${itemparts[1]}`, newItem).toString()

                    await inventory.findOneAndUpdate({ userId: userid }, {
                        userId: userid,
                        items: newItems
                    }, {
                        upsert: true,
                        new: true
                    })
                }
            }
        } else {
            const newItems = result.items.concat(`,${itemname}:${amnt}`)

            await inventory.findOneAndUpdate({ userId: userid }, {
                userId: userid,
                items: newItems
            }, {
                upsert: true,
                new: true
            })
        }
    } else {
        await new inventory({ userId: userid, items: "Cricket:1" }).save()
    }
}

module.exports.removeItem = async(userid, amnt, itemname) => {
    const result = await inventory.findOne({ userId: userid })

    if (result) {
        const items = result.items.split(',')
        const hasItem = result.items.includes(itemname)

        if (hasItem) {
            for (const item of items) {
                const itemparts = item.split(":")
                if (itemparts[0] === itemname) {
                    const newItems = result.items.replace(`,${itemname}:${itemparts[1]}`, "").toString()

                    await inventory.findOneAndUpdate({ userId: userid }, {
                        userId: userid,
                        items: newItems
                    }, {
                        upsert: true,
                        new: true
                    })
                }
            }
        } else {
            return "NO_ITEM"
        }
    } else {
        await new inventory({ userId: userid, items: "Cricket:1" }).save()
    }
}

module.exports.hasItem = async(userid, itemname) => {
    const result = await inventory.findOne({ userId: userid })

    if (result) {
        const hasItem = result.items.includes(itemname)

        if (hasItem) {
            return true
        } else {
            return false
        }
    } else {
        await new inventory({ userId: userid, items: "Cricket:1" }).save()
    }
}