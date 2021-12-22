const { MessageEmbed,MessageAttachment, Permissions} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()


module.exports = {
    data: {
        name: "Mute",
        type: 2
    },

    async execute(interaction) {
        if (interaction.inGuild()) {
            const config = await configHand.configuration(`${interaction.guild.id}`)
            const member = interaction.options.getMember('user')

            if (config.botmasters) {
                if (interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    if (config.mutedrole) {
                        if (member.roles.cache.has(config.mutedrole)) {
                            await interaction.reply({ content: `The user <@${member.user.id}> is already muted.` })
                        } else {
                            await member.roles.add(member.guild.roles.cache.get(config.mutedrole))

                            await interaction.reply({ content: `The user <@${member.user.id}> is now muted.` })
                        }
                    } else {
                        await interaction.reply({ content: `You haven't set up the muted role yet. Please go to the dashboard to do so.` })
                    }
                } else {
                    await interaction.reply({ content: "You dont have the sufficient permissions to do this." })
                }
            } else {
                if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    if (config.mutedrole) {
                        if (member.roles.cache.has(config.mutedrole)) {
                            await interaction.reply({ content: `The user <@${member.user.id}> is already muted.` })
                        } else {
                            await member.roles.add(member.guild.roles.cache.get(config.mutedrole))
                            await member.roles.remove(member.guild.roles.cache.get(config.mutedrole))

                            await interaction.reply({ content: `The user <@${member.user.id}> is no longer muted.` })
                        }
                    } else {
                        await interaction.reply({ content: `You haven't set up the muted role yet. Please go to the dashboard to do so.` })
                    }
                }
            }
        } else {
            await interaction.reply({ content: "Sorry this is a guild-only command." })
        }
    },
};