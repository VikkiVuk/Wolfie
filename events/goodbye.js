module.exports = {
    name: 'guildMemberRemove',
	once: false,
	execute(member, client) {
        const { MessageEmbed, MessageAttachment, MessageButton } = require('discord.js');

        const embed = new MessageEmbed().setTitle("Dovidjenja").setDescription(`Awwww mannn <@${member.user.id}> je izasao... Nadam se da si se lepo proveo ovde.`).setTimestamp().setFooter("Greeting Bot")
        member.guild.channels.cache.get('878774773247799297').send({ embeds: [embed] })
    },
}