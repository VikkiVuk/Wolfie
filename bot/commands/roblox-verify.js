const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const api = "https://rvs.vikkivuk.xyz/api/"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roblox-connect')
        .setDescription('connect your roblox account with discord, some servers may give a role and some may not.'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        if (interaction.member.roles.cache.has('895753436941942795')) {
            let response = await fetch(api + "getuserinfo", {body: {discorduuid: interaction.member.user.id}, method:'POST', redirect: 'follow'})
            let content = await response.json()

            if (content.userinfo) {
                await interaction.editReply({ content: '❌ You already have an account connected, your discord account is connected to: https://www.roblox.com/users/' + content.userinfo.roblox + '/profile. \n \nIf you think this is a mistake please contact our support team using `/support`.', ephemeral: true })
            }
        } else {
            let response = await fetch(api + "getuserinfo", {body: {discorduuid: interaction.member.user.id}, method:'POST', redirect: 'follow'})
            let content = await response.json()

            if (content.userinfo) {
                if (content.userinfo.roblox === "AWAITING") {
                    await interaction.editReply({ content: "You still haven't connected your account! Go here: https://www.roblox.com/games/6052251836 and type this code: " + content.code, ephemeral: true })
                } else {
                    interaction.member.roles.add("895753436941942795")
                    await interaction.editReply({ content: "You have successfully connected your discord account: **" + interaction.member.user.tag + "** with your roblox account: https://www.roblox.com/users/" + content.userinfo.roblox + "/profile", ephemeral: true })
                }
            } else {
                let response = await fetch(api + "getcode", {body: {discorduuid: interaction.member.user.id}, method:'POST', redirect: 'follow'})
                let content = await response.json()

                await interaction.editReply({ content: "Join this roblox game: https://www.roblox.com/games/6052251836 (Choose Standard/v1) and type this code: " + content.code + ". \n \nAfter you verify yourself, you will get a role in all eligible servers, if you join a new eligible server just use this command again.", ephemeral: true })
            }
        }
    },
};