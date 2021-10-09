const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const random = require('../utility/generateRandom')
const got = require('got')
const api = "https://rblx-discord-verify.glitch.me/api/"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roblox')
        .setDescription('Proveri roblox account nekog verifikovanog preko robloxa.')
        .addUserOption(option => option.setName("korisnik").setDescription("Koga da proveris?").setRequired(true)),

    async execute(interaction) {
        console.log(interaction.commandId)
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
                    await interaction.editReply({ content: `✅ Korisnik <@${user.user.id}> je verifikovan i povezan s ovim roblox nalogom: https://www.roblox.com/users/${content.userinfo.roblox}/profile.`, ephemeral: false })
                } else {
                    await interaction.editReply({ content: `Korisnik <@${user.user.id}> nije jos verifikovan preko robloxa.` })
                }
            })
        } else {
            await interaction.editReply({ content: `Korisnik <@${user.user.id}> nije jos verifikovan preko robloxa.` })
        }
    },
};