const { MessageEmbed,MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages in a channel.')
        .addIntegerOption(option => option.setName("amount").setDescription("How many messages do you want to clear? Limit: 100").setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissionsIn(interaction.channel).has("MANAGE_CHANNELS")) return;

        const numberof = interaction.options.getInteger("amount")
        let n
        if (numberof <= 100) {
            if (numberof + 1 !== 100) {
                n = numberof + 1
            } else {
                n = numberof
            }
        } else {
            n = 100
        }

        const filter = b => {
            b.deferUpdate();
            return b.user.id === interaction.user.id;
        };

        const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("yes").setLabel("Yes, I'm sure.").setStyle("DANGER"), new MessageButton().setCustomId("no").setLabel("No, take me back!").setStyle("PRIMARY"))
        await interaction.reply({ content: "Are you sure you want to clear **" + (n - 1) + "** messages? \n \n_Note: This won't clear messages older than 2 weeks_", components: [row], fetchReply: true }).then(reply => {
            reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(collected => {
                interaction.editReply({ content: "Clearing...", components: [] })
                interaction.channel.bulkDelete(n, true).catch(async (e) => {
                    await interaction.channel.send({ content: `An error has occured, I can't clear messages older than 2 weeks.`})
                }).then(async (messages) => {
                    await interaction.channel.send({ content: `Cleared: **${n - 1} messages**.`, fetchReply: true }).then(reply => {
                        setTimeout(() => {
                            reply.delete()
                        }, 5000)
                    })
                })
            }).catch(err => {
                interaction.editReply({ content: "Your time has ran out, please re-run the command.", components: [] })
            })
        })
    },
};