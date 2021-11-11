const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const talkedRecently = []
const wait = require('util').promisify(setTimeout);
const handler = require("../utility/user-handler")
const {randomNumber} = require("../utility/generateRandom");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('Hack someone ig')
        .addUserOption(option => option.setName('target').setDescription('Who do you want to hack?').setRequired(true)),
    async execute(interaction) {
        if (talkedRecently.includes(interaction.user.id)) {
            await interaction.reply({ content: `Ayo chill out chilly willy, you have a cooldown.`})
        } else {
            const user = interaction.options.getUser('target')

            if (user.id === interaction.user.id) {
                await interaction.reply({content: `The heck? You cant hack yourself, you already know your password lol`})
            }

            const waiting = new MessageEmbed().setTitle('Hacking...').setDescription('Im currently trying to hack <@' + user.id + '>... \n \nThis _may_ take up to 2 minutes.').setTimestamp().setFooter('Hackbot 9000').setColor('#804AFF')
            talkedRecently.push(interaction.user.id);

            await interaction.reply({embeds: [waiting]});

            await wait(Math.floor(Math.random() * (160 - 30) + 60) * 160)

            const responses = [
                new MessageEmbed().setTitle('ACCESS GRANTED').setDescription(`You have been granted access into <@${user.id}>'s account. (not really lol, you did steal some of his money tho 👀)`).setTimestamp().setFooter(config.defaultFooter).setColor('#0FFF0F'),
                new MessageEmbed().setTitle('ACCESS DENIED').setDescription(`Looks like <@${user.id}> has a firewall. Better luck next time ig`).setTimestamp().setFooter(config.defaultFooter).setColor('#FF0000')
            ];

            const response = responses[Math.floor(Math.random() * responses.length)];
            await interaction.editReply({embeds: [response]})
            if (response === responses[0]) { await handler().then(async() => { await handler.changeMoney(interaction.user.id, true, randomNumber(100, 1000)) }) }

            await wait(20000)
            const index = talkedRecently.indexOf(interaction.user.id)
            talkedRecently.splice(index)
        }
    },
};