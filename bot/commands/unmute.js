const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("This is how people with sufficient permissions can unmute muted people.")
        .addUserOption(option => option.setName("korisnik").setDescription("Koga?").setRequired(true)),

    async execute(interaction) {
        if (interaction.inGuild()) {
            const member = interaction.options.getMember('korisnik')
            const guildconfig = await configHand.configuration(`${interaction.guild.id}`)

            if (config.botmasters) {
                if (interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    if (config.mutedrole) {
                        if (member.roles.cache.has(config.mutedrole)) {
                            await member.roles.remove(member.guild.roles.cache.get(config.mutedrole))

                            await interaction.reply({ content: `The user <@${member.user.id}> is no longer muted, and is able to speak.` })
                        } else {
                            await interaction.reply({ content: `The user <@${member.user.id}> is not muted.` })
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
                            await member.roles.remove(member.guild.roles.cache.get(config.mutedrole))

                            await interaction.reply({ content: `The user <@${member.user.id}> is no longer muted, and is able to speak.` })
                        } else {
                            await interaction.reply({ content: `The user <@${member.user.id}> is not muted.` })
                        }
                    } else {
                        await interaction.reply({ content: `You haven't set up the muted role yet. Please go to the dashboard to do so.` })
                    }
                }
            }
        } else {
            await interaction.reply({ content: "Sorry this command is guild-only"})
        }
    },
};