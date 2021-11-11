const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('This is how moderators lock a channel.')
        .addSubcommand(sub => sub.setName("lock").setDescription("Locks a channel so that normal people (configure in the dashboard) cant talk."))
        .addSubcommand(sub => sub.setName("unlock").setDescription("Unlocks a channel.")),

    async execute(interaction) {
        if (interaction.member.permissionsIn(interaction.channel).has("MANAGE_CHANNELS")) {
            const chnl = interaction.channel
            const subcommand = interaction.options.getSubcommand()

            if (subcommand === "lock") {
                chnl.permissionOverwrites.edit('878606227045756952', { SEND_MESSAGES: false });
                await interaction.reply({ content: "This channel is now locked, all specified roles in the dashboard now cant talk here."})
            } else {
                chnl.permissionOverwrites.edit('878606227045756952', { SEND_MESSAGES: true });
                await interaction.reply({ content: "This channel is now unlocked, all specified roles in the dashboard can now talk again."})
            }
        } else {
            await interaction.reply({ content: "❌ You do not have the sufficient permissions to do this." })
        }
    },
};