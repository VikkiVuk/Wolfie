const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kpz')
        .setDescription('Igraj kamen papir makaze s nekim!')
        .addUserOption(option => option.setName("protivnik").setDescription("S kim zelis da igras?").setRequired(true)),

    async execute(interaction) {
        const opponent = interaction.options.getUser("protivnik")
        if (opponent.id === interaction.user.id) {
            await interaction.reply({ content: `Ne mozes protiv sebe da se boris.` })
            return;
        }


        let buttons = [ new MessageButton().setCustomId("kamen").setLabel(`🪨 Kamen`).setStyle("PRIMARY"), new MessageButton().setCustomId("papir").setLabel("🧻 Papir").setStyle('PRIMARY'), new MessageButton().setCustomId("makaze").setLabel("✂ Makaze").setStyle("PRIMARY")]
        const row = new MessageActionRow().addComponents(buttons)
        let userPlayed = false
        let actions = { attacker: "", opponent: "" }
        await interaction.reply({ content: `**${interaction.user.username} vs ${opponent.username}** \n${interaction.user} ide prvi!`, components: [row], fetchReply: true }).then(reply => {
            const collector = reply.createMessageComponentCollector({ componentType: 'BUTTON', time: 20000 });

            collector.on("collect", async (button) => {
                await button.deferUpdate()

                if (interaction.user.id === button.user.id && userPlayed === false) {
                    userPlayed = true
                    actions.attacker = button.customId

                    await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${opponent} ide sad!`})
                } else if (button.user.id === opponent.id && userPlayed === true) {
                    actions.opponent = button.customId

                    if (actions.opponent === actions.attacker) { await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \nRezultat je izjednacen!`, components: []}) }

                    if (actions.attacker === "kamen") {
                        if (actions.opponent === "papir") {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${opponent} je pobedio!`, components: []})
                        } else {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${interaction.user} je pobedio!`, components: []})
                        }
                    } else if (actions.attacker === "papir") {
                        if (actions.opponent === "makaze") {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${opponent} je pobedio!`, components: []})
                        } else {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${interaction.user} je pobedio!`, components: []})
                        }
                    } else if (actions.attacker === "makaze") {
                        if (actions.opponent === "kamen") {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${opponent} je pobedio!`, components: []})
                        } else {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${interaction.user} je pobedio!`, components: []})
                        }
                    }
                }
            })

            collector.on("end", () => {

            })
        })
    },
};