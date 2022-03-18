const { MessageEmbed, MessageAttachment, MessageButton } = require('discord.js');
const config = require("../config.json")
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()

module.exports = {
    name: 'guildMemberAdd',
	once: false,
	async execute(member, client) {
		const configuration = configHand.configuration(member.guild.id)
		if (configuration["greetingchannel"]) {

		}
    }
}