const { Permissions} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("This is how bot masters can mute people that are just annoying.")
        .addUserOption(option => option.setName("user").setDescription("Who do you want to mute?").setRequired(true))
        .addIntegerOption(option => option.setName("time").setDescription("For how long do you want to mute them? (in minutes)").setRequired(true)),

    async execute(interaction) {
        if (interaction.inGuild()) {
            const config = await configHand.configuration(`${interaction.guild.id}`)
            const member = interaction.options.getMember('user')
            const time = interaction.options.getInteger("time")

            if (config.botmasters) {
                if (interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    member.timeout(time * 60 * 1000).then(async() => {
                        await interaction.reply({content:"The user has been muted for " + time + " minutes"})
                    }).catch(async() => {
                        await interaction.reply({content:"Sorry, an error occured!"})
                    })
                } else {
                    await interaction.reply({ content: "You dont have the sufficient permissions to do this." })
                }
            } else {
                if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    member.timeout(time * 60 * 1000).then(async() => {
                        await interaction.reply({content:"The user has been muted for " + time + " minutes"})
                    }).catch(async() => {
                        await interaction.reply({content:"Sorry, an error occured!"})
                    })
                }
            }
        } else {
            await interaction.reply({ content: "Sorry this is a guild-only command." })
        }
    },
};