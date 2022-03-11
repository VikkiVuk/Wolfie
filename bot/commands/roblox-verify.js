const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const random = require('../utility/generateRandom')
const got = require('got')
const api = "https://roblox-verification-system.herokuapp.com/api/"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roblox-connect')
        .setDescription('connect your roblox account with discord, some servers may give a role and some may not.'),

    async execute(interaction) {
        await interaction.message.reply({content:"Hello, we are soon going to be moving this to our vikkivuk account system, which you can link to your discord account on the site!"})
        await interaction.deferReply({ ephemeral: true })
        if (interaction.member.roles.cache.has('895753436941942795')) {
            got.post(api + "getuserinfo", {
                json: {
                    discorduuid: interaction.member.user.id
                },
                responseType: 'json'
            }).then(async response => {
                let content = JSON.parse(JSON.stringify(response.body))
                if (content.userinfo) {
                    await interaction.editReply({ content: '❌ You already have an account connected, your discord account is connected to: https://www.roblox.com/users/' + content.userinfo.roblox + '/profile. \n \nIf you think this is a mistake please contact our support team using `/support`.', ephemeral: true })
                }
            })
        } else {
            got.post(api + "getuserinfo", {
                json: {
                    discorduuid: interaction.member.user.id
                },
                responseType: 'json'
            }).then(async response => {
                let content = JSON.parse(JSON.stringify(response.body))

                if (content.userinfo) {
                    if (content.userinfo.roblox === "AWAITING") {
                        await interaction.editReply({ content: "You still havent connected your account! Go here: https://www.roblox.com/games/6052251836/RDV-Verification and type this code: " + content.code, ephemeral: true })
                    } else {
                        interaction.member.roles.add("895753436941942795")
                        await interaction.editReply({ content: "You have successfully connected your discord account: **" + interaction.member.user.tag + "** with your roblox account: https://www.roblox.com/users/" + content.userinfo.roblox + "/profile", ephemeral: true })
                    }
                } else {
                    got.post(api + "getcode", {
                        json: {
                            discorduuid: interaction.member.user.id
                        },
                        responseType: 'json'
                    }).then(async response => {
                        let content = JSON.parse(JSON.stringify(response.body));
                        await interaction.editReply({ content: "Join this roblox game: https://www.roblox.com/games/6052251836/RDV-Verification and type this code: " + content.code + ". \n \nAfter you verify yourself, you will get a role in all eligible servers, if you join a new eligible server just use this command again.", ephemeral: true })
                    })
                }
            })
        }
    },
};