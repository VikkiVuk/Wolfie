const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const talkedRecently = []
const wait = require('util').promisify(setTimeout);
const handler = require("../utility/user-handler")
const {randomNumber} = require("../utility/generateRandom");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hakuj')
        .setDescription('Hakujte nekog.')
        .addUserOption(option => option.setName('korisnik').setDescription('Koga zelite da hakujete').setRequired(true)),
    async execute(interaction) {
        if (talkedRecently.includes(interaction.user.id)) {
            await interaction.reply({ content: `Alou! Chill out buraz, sacekaj malo, ne mozes da hakujes sve od jednom.`})
        } else {
            const user = interaction.options.getUser('korisnik')

            const waiting = new MessageEmbed().setTitle('HAKOVANJE U TOKU').setDescription('Trenutno pokusavam da hakujem <@' + user.id + '>...').setTimestamp().setFooter('Hackbot 9000').setColor('#804AFF')
            talkedRecently.push(interaction.user.id);

            await interaction.reply({embeds: [waiting]});

            await wait(Math.floor(Math.random() * (160 - 30) + 60) * 160)

            const responses = [
                new MessageEmbed().setTitle('PRISTUP DOZVOLJEN').setDescription(`Cestitam! Ovo totalno pravo hakovanje <@${user.id}> je uspelo! Dobio si malo novca.`).setTimestamp().setFooter(config.defaultFooter).setColor('#0FFF0F'),
                new MessageEmbed().setTitle('PRISTUP ODBIJEN').setDescription(`Izvini! Izgleda kao da je <@${user.id}> imao firewall. Vise srece sledeci put.`).setTimestamp().setFooter(config.defaultFooter).setColor('#FF0000')
            ];

            const response = responses[Math.floor(Math.random() * responses.length)];
            await interaction.editReply({embeds: [response]})
            if (response === responses[0]) { await handler.changeMoney(interaction.user.id, true, randomNumber(100, 1000)) }

            await wait(20000)
            const index = talkedRecently.indexOf(interaction.user.id)
            talkedRecently.splice(index)
        }
    },
};