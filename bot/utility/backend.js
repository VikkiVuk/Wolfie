const Guilds = require('./schemas/guild-schema')

let client 

module.exports.saveClient = (botclient) => {
    client = botclient
}

module.exports.getClient = () => {
    return client
}

module.exports.changeCommandPermissions = async(permissions, guildId, commandName) => {
    const commands = await client.guilds.cache.get(guildId).commands.fetch();
	const cmd = commands.find(c => c.name === commandName)

	await cmd.permissions.add({ permissions });
}

module.exports.getGuildOptions = async(guildId) => {
    const guild = await Guilds.findOne({ guildId: guildId })
    return guild
}

module.exports.joinedGuild = async(guild) => {
    if (await Guilds.findOne({ guildId: guild.id })) {
        return
    } else {
        const newGuild = await new Guilds({ guildId: guild.id, guild: guild, config: [], commandsOn: [], commandOptions: []}).save()
        return newGuild
    }
}