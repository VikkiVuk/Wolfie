const mongo = require('./mongo.js')
const moneySchema = require('./schemas/profile-schema')
const xpSchema = require('./schemas/xp-schema')

module.exports = (client) => {}

// Money
module.exports.addCoins = async(guildId, userId, coins) => {
    try {
        const result = await moneySchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $inc: {
                coins
            }
        }, {
            upsert: true,
            new: true
        })

        return result.coins
    } catch {
        return 'error'
    }
}

module.exports.removeCoins = async(guildId, userId, decCoins) => {
    try {
        const result = await moneySchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $inc: {
                coins: -decCoins,
            }
        }, {
            upsert: true,
            new: true
        })

        return result.coins
    } catch {
        return 'error'
    }
}

module.exports.getCoins = async(guildId, userId) => {
    try {
        const result = await moneySchema.findOne({
            guildId,
            userId
        })

        let coins = 50
        if (result) {
           coins = result.coins
        } else {
            await new moneySchema({
                guildId,
                userId,
                coins
            }).save()
        }
        return coins
    } catch {
       return 'error'
    }
}

// XP
module.exports.addXp = async(guildId, userId, xp) => {
    try {
        const result = await xpSchema.findOne({
            guildId,
            userId
        })
        const level = result.level
        const result2 = await xpSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $inc: {
                xp
            },
            level
        }, {
            upsert: true,
            new: true
        })

        return result.xp
    } catch {
        return 'error'
    }
}

module.exports.addLevels = async(guildId, userId, level) => {
    try {
        const result = await xpSchema.findOne({
            guildId,
            userId
        })

        const xp = result.xp

        const result2 = await xpSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            xp,
            $inc: {
                level
            }
        }, {
            upsert: true,
            new: true
        })

        return result2.level
    } catch(e) {
        return 'error'
    }
}

module.exports.getXp = async(guildId, userId) => {
    try {
        const result = await xpSchema.findOne({
            guildId,
            userId
        })

        let xp = 1
        let level = 1
        if (result) {
           xp = result.xp
        } else {
            console.log('NEW USER! Inserting a document...')
            await new xpSchema({
                guildId,
                userId,
                xp,
                level
            }).save()
        }

        return xp
    } catch(e) {
        return 'error'
    }
}

module.exports.getLevel = async(guildId, userId) => {
    try {
        const result = await xpSchema.findOne({
            guildId,
            userId
        })

        let xp = 1
        let level = 1
        if (result) {
           level = result.level
        } else {
            console.log('NEW USER! Inserting a document...')
            await new xpSchema({
                guildId,
                userId,
                xp,
                level
            }).save()
        }

        return level
    } catch {
        return 'error'
    }
}