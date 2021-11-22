const { MessageEmbed,MessageAttachment, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('People with sufficient permissions can check to see the number of warnings a specific user has.')
        .addUserOption(option => option.setName("user").setDescription("Who do you want to see the number of warns?").setRequired(true)),

    async execute(interaction) {
        await interaction.reply({ content: "this is a WIP command." })
        return;
        if (interaction.inGuild()) {
            const config = configHand.configuration(`${interaction.guild.id}`)
            if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0)) {
                const user = interaction.options.getUser("user")
                const intuser = await handler.getUser(`${user.id}`, `${interaction.guild.id}`)
                const warns = await intuser.getkey("warns")

                await interaction.reply({ content: `The user <@${user.id}> has **${warns} warnings**.`});
            }
        } else {
            await interaction.reply({ content: "Sorry, this command is guild-only" })
        }
    },
};