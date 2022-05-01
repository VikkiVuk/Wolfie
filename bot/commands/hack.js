const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const talkedRecently = []
const wait = require('util').promisify(setTimeout);
const botmodule = require("../utility/BotModule")
const {randomNumber} = require("../utility/generateRandom");
const handler = new botmodule.UserModule()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('Hack someone, not really but you get the point.')
        .addUserOption(option => option.setName('target').setDescription('Who do you want to hack?').setRequired(true)),
    async execute(interaction) {
        if (talkedRecently.includes(interaction.user.id)) {
            await interaction.reply({ content: `Ayo chill out chilly willy, you have a cooldown.`})
        } else {
            const user = interaction.options.getUser('target')
            const intuser = await handler.getUser(`${interaction.user.id}`)

            if (user.id === interaction.user.id) {
                await interaction.reply({content: `The heck? You cant hack yourself, you already know your password lol`})
                return;
            }

            const waiting = new MessageEmbed().setTitle('Hacking...').setDescription('Im currently trying to hack <@' +user.id + '>... \n \nThis _may_ take up to 2 minutes.').setTimestamp().setFooter('Hackbot 9000').setColor('#804AFF').setImage("https://c.tenor.com/y2JXkY1pXkwAAAAC/cat-computer.gif")
            talkedRecently.push(interaction.user.id);

            await interaction.reply({embeds: [waiting]});

            await wait(Math.floor(Math.random() * (160 - 30) + 60) * 160)

            const responses = [
                new MessageEmbed().setTitle('ACCESS GRANTED').setDescription(`You have been granted access into <@${user.id}>'s account. (not really lol, you did steal some of his money tho 👀)`).setTimestamp().setFooter({text: config.defaultFooter}).setColor('#0FFF0F'),
                new MessageEmbed().setTitle('ACCESS DENIED').setDescription(`Looks like <@${user.id}> has a firewall. Better luck next time ig`).setTimestamp().setFooter({text: config.defaultFooter}).setColor('#FF0000')
            ];


            if (user.bot) {
                const response = responses[1];
                await interaction.editReply({embeds: [response]})
            } else {
                const response = responses[Math.floor(Math.random() * responses.length)];
                await interaction.editReply({embeds: [response]})
                if (response === responses[0]) { await intuser.modify("money", await randomNumber(100, 1000), "ADD") }
            }

            await wait(20000)
            const index = talkedRecently.indexOf(interaction.user.id)
            talkedRecently.splice(index)
        }
    },
};