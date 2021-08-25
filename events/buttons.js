module.exports = {
    name: 'interactionCreate',
	once: false,
	execute(interaction, client) {
        const { MessageEmbed, MessageAttachment, MessageButton } = require('discord.js');

        if (!interaction.isButton()) return;
        if (interaction.customId == 'verify') {
            const verifiedRole = interaction.guild.roles.cache.get('687599618002911239');
            const unverifiedRole = interaction.guild.roles.cache.get('688381358179221566');

            if (interaction.member.roles.cache.has(unverifiedRole.id)) {
                interaction.member.roles.remove(unverifiedRole)
            }

            interaction.member.roles.add(verifiedRole)
            
            const embed = new MessageEmbed().setTitle('VERIFIKOVAN').setDescription('Zdravo <@' + interaction.member.user.id + '>, ti si sad verifikovan! Sada bi trebao da imas pristup svim kanalima naravno ne onim koji admini mogu da pristupe samo. \n \n Ako vec nisi molim te idi procitaj pravila u <#739057149745037393>').setTimestamp().setFooter('Auto VikkiVuk').setColor('#0091ff')

            interaction.update({content: null, embeds: [embed], ephemeral: true, components: []})
        }
    },
}