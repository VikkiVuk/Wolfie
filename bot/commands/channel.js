const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('This is how moderators lock a channel.')
        .addSubcommand(sub => sub.setName("lock").setDescription("Locks a channel so that normal people cant talk."))
        .addSubcommand(sub => sub.setName("unlock").setDescription("Unlocks a channel.")),

    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const chnl = interaction.channel
            const subcommand = interaction.options.getSubcommand()

            const config = await configHand.configuration(`${interaction.guild.id}`)

            if (subcommand === "lock") {
                await chnl.permissionOverwrites.edit((config.lockrole) ? config.lockrole : interaction.guild.id, { SEND_MESSAGES: false });
                await interaction.reply({ content: `This channel is now locked, <@&${config.lockrole ? config.lockrole : interaction.guild.id}> now cant talk here.` })
            } else {
                await chnl.permissionOverwrites.edit((config.lockrole) ? config.lockrole : interaction.guild.id, { SEND_MESSAGES: true });
                await interaction.reply({ content: `This channel is now unlocked, <@&${config.lockrole ? config.lockrole : interaction.guild.id}> can now talk here.` })
            }
        } else {
            await interaction.reply({ content: "❌ You do not have the sufficient permissions to do this." })
        }
    },
};