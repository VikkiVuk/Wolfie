const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const random = require('../utility/generateRandom')
const got = require('got')
const api = "https://rblx-discord-verify.glitch.me/api/"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roblox-verifikacija')
        .setDescription('Ovako mozes da otkljucas vise stvari kao i da otkljucas pristup par specijalnim stvarima.'),

    async execute(interaction) {
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
                    await interaction.editReply({ content: '❌ Vec si se verifikovao! Povezan si sa roblox account: https://www.roblox.com/users/' + content.userinfo.roblox + '/profile. \n \nUkoliko mislis da je ovo greska otvori support ticket u <#878606227414868034>.', ephemeral: true })
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
                        await interaction.editReply({ content: "Jos uvek se nisi verifikovao! Udji ovde: https://www.roblox.com/games/6052251836/RDV-Verification i ukucaj ovaj kod: " + content.code, ephemeral: true })
                    } else {
                        interaction.member.roles.add("895753436941942795")
                        await interaction.editReply({ content: "Uspesno si se verifikovao i povezao svoj discord account: **" + interaction.member.user.tag + "** sa roblox account: https://www.roblox.com/users/" + content.userinfo.roblox + "/profile", ephemeral: true })
                    }
                } else {
                    got.post(api + "getcode", {
                        json: {
                            discorduuid: interaction.member.user.id
                        },
                        responseType: 'json'
                    }).then(async response => {
                        let content = JSON.parse(JSON.stringify(response.body));
                        await interaction.editReply({ content: "Udji u ovu roblox igru: https://www.roblox.com/games/6052251836/RDV-Verification i ukucaj ovaj kod: " + content.code + ". \n \nNakon sto se verifikujes molim te pokreni komandu ponovo da bi dobijo svoj role.", ephemeral: true })
                    })
                }
            })
        }
    },
};