const { MessageActionRow, MessageButton, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()

async function kick(interaction, user){
    await interaction.deferReply()

    const row = new MessageActionRow().addComponents([new MessageButton().setLabel("Yes, kick this person!").setStyle("DANGER").setCustomId("yes"), new MessageButton().setLabel("No, take me back!").setStyle("PRIMARY").setCustomId("no")])
    const filter = b => {b.deferUpdate();return b.user.id === interaction.user.id;};

    await interaction.editReply({content: `Are you sure you want to kick the user: **${user.user.username}#${user.user.discriminator}**?`, components: [row], fetchReply: true}).then(reply => {
        reply.awaitMessageComponent({filter, componentType: "BUTTON", time: 20000}).then(async button => {
            if (button.customId === "yes") {
                user.ban().then(async() => {await interaction.editReply({content: `The user: **${user.user.username}#${user.user.discriminator}** has been kicked into outer space.`})}).catch(async() => {await interaction.editReply({content: "Sorry I can't kick that person.", components: []})})
            } else if (button.customId === "no") {
                await interaction.editReply({content: `Okay, I won't kick that person.`, components: []})
            }
        }).catch(async() => { await interaction.editReply({content: `Your time ran out.`, components: []}) })
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("People with sufficient permissions can use this to kick members.")
        .addUserOption(option => option.setName("user").setDescription("Who do you want to kick?").setRequired(true)),

    async execute(interaction) {
        if (interaction.inGuild()) {
            const config = await configHand.configuration(interaction.guild.id)
            const user = interaction.options.getMember('user')

            if (config.botmasters) { if (interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0) || interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) { await kick(interaction, user) } else { await interaction.reply({ content: "Sorry, you dont have the sufficient permissions to do this."}) } } else { if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) { await kick(interaction, user) } }
        } else {
            await interaction.reply({ content: `Sorry, this command is guild-only!` })
        }
    }
}
