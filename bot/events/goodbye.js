const config = require("../config.json")
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()

module.exports = {
    name: 'guildMemberRemove',
	once: false,
	execute(member, client) {
        const configuration = configHand.configuration(member.guild.id)
        if (configuration["greetingchannel"]) {
            const { MessageEmbed, MessageAttachment, MessageButton } = require('discord.js');

            const embed = new MessageEmbed().setTitle("Goodbye").setDescription(`Awwww mannn <@${member.user.id}> left... Hope you had a great time in here.`).setTimestamp().setFooter(config.defaultFooter)
            member.guild.channels.cache.get(configuration["greetingchannel"]).send({ embeds: [embed] })
        }
    },
}