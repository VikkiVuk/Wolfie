const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const random = require('../utility/generateRandom')
const got = require('got')
const api = "https://rblx-discord-verify.glitch.me/api/"
const usersapi = "https://users.roblox.com/v1/users/"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roblox')
        .setDescription('Proveri roblox account nekog verifikovanog preko robloxa.')
        .addUserOption(option => option.setName("korisnik").setDescription("Koga da proveris?").setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false })
        const user = interaction.options.getMember("korisnik")
        if (user.roles.cache.has('895753436941942795')) {
            got.post(api + "getuserinfo", {
                json: {
                    discorduuid: user.user.id
                },
                responseType: 'json'
            }).then(async response => {
                let content = JSON.parse(JSON.stringify(response.body))
                if (content.userinfo) {
                    got(usersapi + content.userinfo.roblox).then(async rblxus => {
                        let rblxuser = JSON.parse(rblxus.body)
                        const embed = new MessageEmbed().setTitle(`@${interaction.member.user.username} (${interaction.member.displayName})`).setDescription("Ovaj korisnik je povezao svoj roblox account sa svojim discord accountom, detalje imate ispod.").setColor('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')).setTimestamp().setFooter("Roblox Verifikacija").setURL(`https://www.roblox.com/users/${content.userinfo.roblox}/profile`)
                            .addField("Roblox Id", rblxuser.id.toString(), true)
                            .addField("Username", rblxuser.name, true)
                            .addField("Display Name", rblxuser.displayName, true)
                            .addField("O meni", rblxuser.description)
                            .addField("Kada se prijavio?", new Date(rblxuser.created).toString(), true)
                            if (rblxuser.isBanned == true) {
                                embed.addField("Banovan?", "Da", true)
                            } else {
                                embed.addField("Banovan?", "Ne", true)
                            }
                        await interaction.editReply({ embeds: [embed] })
                    })
                } else {
                    await interaction.editReply({ content: `Korisnik <@${user.user.id}> nije jos verifikovan preko robloxa.` })
                }
            })
        } else {
            await interaction.editReply({ content: `Korisnik <@${user.user.id}> nije jos verifikovan preko robloxa.` })
        }
    },
};