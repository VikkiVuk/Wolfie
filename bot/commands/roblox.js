const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const api = "https://rvs.vikkivuk.xyz/api/"
const usersapi = "https://users.roblox.com/v1/users/"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roblox')
        .setDescription('See what account someone has connected to them.')
        .addUserOption(option => option.setName("user").setDescription("Who do you want to check?").setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false })
        const user = interaction.options.getMember("user")
        if (user.roles.cache.has('895753436941942795')) {
            let response = await fetch(api + "getuserinfo", { body: `{ "discorduuid": ${user.user.id} }`, method: 'POST', redirect: 'follow'})
            let content = await response.json()
            if (content.userinfo) {
                let rblxus = await fetch(usersapi + content.userinfo.roblox, {method:"GET", redirect: 'follow'})
                let rblxuser = await rblxus.json()
                const embed = new MessageEmbed().setTitle(`@${interaction.member.user.username} (${interaction.member.displayName})`).setDescription("This user has a connected account, more details down below.").setColor('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')).setTimestamp().setFooter("Roblox Verification").setURL(`https://www.roblox.com/users/${content.userinfo.roblox}/profile`)
                    .addField("Roblox Id", rblxuser.id.toString(), true)
                    .addField("Username", rblxuser.name, true)
                    .addField("Display Name", rblxuser.displayName, true)
                    .addField("About me", rblxuser.description)
                    .addField("Joined at", new Date(rblxuser.created).toString(), true)
                if (rblxuser.isBanned == true) {
                    embed.addField("Banned", "Yes", true)
                } else {
                    embed.addField("Banned", "No", true)
                }
                await interaction.editReply({ embeds: [embed] })
            } else {
                await interaction.editReply({ content: `User <@${user.user.id}> hasnt connected their roblox account yet.` })
            }
        } else {
            await interaction.editReply({ content: `User <@${user.user.id}> hasnt connected their roblox account yet.` })
        }
    },
};