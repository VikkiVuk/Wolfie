const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Trello = require('trello')
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('preporuci')
        .setDescription('Ovako mozete da posaljete ideje meni.')
        .addStringOption(option => option.setName('ideja').setDescription('Ovde napisite vasu ideju.').setRequired(true)),
    async execute(interaction) {
        const idea = interaction.options.getString('ideja')

        const successEmbed = new MessageEmbed().setTitle('USPEH!').setDescription('Tvoja ideja je poslata, i ceka pregled moderatora.').setTimestamp().setFooter(config.defaultFooter).setColor('#00ff11');

        if (idea.toString().length <= 10) {
            await interaction.reply({ content: 'Molim vas napravite ideju duzu, ovo je sistem napravljen za ideje ne za zezanje, ukoliko se zezate, dobicete verovatno ban s komande i necete moci da koristite komandu.', ephemeral: true })
        } else {
            if (interaction.channelId === '878606227595227164') {
                // Sta da snimam
                trello.addCard(idea, `Sent by: <@${interaction.member.user.id}>`, '6113903cc6068656df64a8ef');

                await interaction.reply({ embeds: [successEmbed] })
            } else if (interaction.channelId === '878606227595227165') {
                // Auto VikkiVuk ideje
                trello.addCard(idea, `Sent by: <@${interaction.member.user.id}>`, '6113904f6f163a7d919d2481');

                await interaction.reply({ embeds: [successEmbed] })
            } else if (interaction.channelId === '878606227800719440') {
                // Specijal ideje
                trello.addCard(idea, `Sent by: <@${interaction.member.user.id}>`, '6113905b2a1f784cd57db3a7');

                await interaction.reply({ embeds: [successEmbed] })
            } else {
                await interaction.reply({ content: 'Molim te koristi ovu komandu u namenjene kanale.', ephemeral: true });
            }
        }
    },
};