const mongo = require('./mongo')
const profileSchema = require('./schemas/notepad-schema')

module.exports = (client) => {}

module.exports.setNote = async(userId, note) => {
    try {
        const result = await profileSchema.findOneAndUpdate({
            id: userId
        }, {
            id: userId,
            fnote: note
        }, {
            upsert: true,
            new: true
        })

        return result.fnote
    } catch {
       return 'error'
    }
}

module.exports.getNote = async(userId) => {
    try {
        const result = await profileSchema.findOne({
            id: userId
        })

        let note = ""
        if (result) {
            note = result.fnote
        } else {
            await new profileSchema({
                guildId,
                userId,
                coins
            }).save()
        }

        return note
    } catch {
        return 'error'
    }
}