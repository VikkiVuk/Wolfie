const { MessageEmbed,MessageAttachment,Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const guildSchema = require("../utility/schemas/guild-schema")
const configHand = undefined
const wait = require("util").promisify(setTimeout)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('This is how moderators lock a channel.')
        .addSubcommand(sub => sub.setName("lock").setDescription("Locks a channel so that normal people (configure in the dashboard) cant talk."))
        .addSubcommand(sub => sub.setName("unlock").setDescription("Unlocks a channel.")),

    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const chnl = interaction.channel
            const subcommand = interaction.options.getSubcommand()

            const config = await configHand.getGuildConfig(interaction.guild.id)

            if (config.lockrole) {
                if (subcommand === "lock") {
                    await chnl.permissionOverwrites.edit(config.lockrole, { SEND_MESSAGES: false });
                    await interaction.reply({ content: `This channel is now locked, <@&${config.lockrole}> now cant talk here.` })
                } else {
                    await chnl.permissionOverwrites.edit(config.lockrole, { SEND_MESSAGES: true });
                    await interaction.reply({ content: `This channel is now unlocked, <@&${config.lockrole}> can now talk here.` })
                }
            } else {
                await interaction.reply({ content: `You haven't set up a lock role in the dashboard (\`/dashboard\`), so everyone will be used as default. \n \n_Without a lock role set up, there will be a 3 second delay!_` })
                await wait(3000)
            }
        } else {
            await interaction.reply({ content: "❌ You do not have the sufficient permissions to do this." })
        }
    },
};