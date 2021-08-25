const mongo = require('./mongo')
const profileSchema = require('./schemas/tvojbroj-schema')

module.exports = (client) => {}

module.exports.noviBroj = async(guildId, userId, tvojaLozinka) => {
        try {
            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                tvojaLozinka
            }, {
                upsert: true,
                new: true
            })

            return result.tvojaLozinka
        } catch {
           return 'error'
        }
}

module.exports.dobijBroj = async(guildId, userId) => {
        try {
            const result = await profileSchema.findOne({
                guildId,
                userId
            })

            let tvojaLozinka = 00000
            if (result) {
                tvojaLozinka = result.tvojaLozinka
            } else {
                console.log('NEW USER! Inserting a document...')
                await new profileSchema({
                    guildId,
                    userId,
                    tvojaLozinka
                }).save()
            }
            return tvojaLozinka
        } catch {
            return 'error'
        }
}