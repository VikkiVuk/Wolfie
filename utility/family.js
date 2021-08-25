const mongo = require('./mongo')
const profileSchema = require('./schemas/family-schema')

module.exports = (client) => {}

module.exports.zameniRoditelje = async(guildId, userId, momId, dadId) => {
        try {
            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                momId,
                dadId
            }, {
                upsert: true,
                new: true
            })
            var newParents = new Object();
            newParents['mom'] = result.momId;
            newParents['dad'] = result.dadId;

            return newParents
        } catch {
           return 'error'
        }
}

module.exports.dobijRoditelje = async(guildId, userId) => {
        try {
            const result = await profileSchema.findOne({
                guildId,
                userId
            })

            let momId = "nomom"
            let dadId = "nodad"
            if (result) {
                momId = result.momId
                dadId = result.dadId
            } else {
                console.log('NEW USER! Inserting a document...')
                await new profileSchema({
                    guildId,
                    userId,
                    momId,
                    dadId
                }).save()
            }
            var parents = new Object();
            parents['mom'] = momId;
            parents['dad'] = dadId;
            return parents
        } catch {
           return 'error'
        }
}

module.exports.dobijDecu = async(guildId, parentId) => {
        try {
            const result = await profileSchema.find({
                guildId,
                parentId
            })

            let kids = new Object()
            if (result) {
                console.log(result)
                for (kid in result) {
                    console.log(kid)
                    kids[kid]
                }
            } else {
                console.log('The users does not exist!')
                return 0
            }
            return kids
        } catch {
            return 'error'
        }
}
