const { MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('rock paper scissors')
        .addUserOption(option => option.setName("opponent").setDescription("who do you want to play against?").setRequired(true)),

    async execute(interaction) {
        const opponent = interaction.options.getUser("opponent")
        if (opponent.id === interaction.user.id) {
            await interaction.reply({ content: `you cant play against yourself, you would win by default` })
            return;
        }


        let buttons = [ new MessageButton().setCustomId("kamen").setLabel(`🪨 Rock`).setStyle("PRIMARY"), new MessageButton().setCustomId("papir").setLabel("🧻 (Toilet) Paper").setStyle('PRIMARY'), new MessageButton().setCustomId("makaze").setLabel("✂ Scissors").setStyle("PRIMARY")]
        const row = new MessageActionRow().addComponents(buttons)
        let userPlayed = false
        let actions = { attacker: "", opponent: "" }
        await interaction.reply({ content: `**${interaction.user.username} vs ${opponent.username}** \n${interaction.user} goes first!`, components: [row], fetchReply: true }).then(reply => {
            const collector = reply.createMessageComponentCollector({ componentType: 'BUTTON', time: 20000 });

            collector.on("collect", async (button) => {
                await button.deferUpdate()

                if (interaction.user.id === button.user.id && userPlayed === false) {
                    userPlayed = true
                    actions.attacker = button.customId

                    await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \nIt's ${opponent}'s turn!`})
                } else if (button.user.id === opponent.id && userPlayed === true) {
                    actions.opponent = button.customId

                    if (actions.opponent === actions.attacker) { await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \nit's a tie!`, components: []}) }

                    if (actions.attacker === "kamen") {
                        if (actions.opponent === "papir") {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${opponent} won!`, components: []})
                        } else {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${interaction.user} won!`, components: []})
                        }
                    } else if (actions.attacker === "papir") {
                        if (actions.opponent === "makaze") {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${opponent} won!`, components: []})
                        } else {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${interaction.user} won!`, components: []})
                        }
                    } else if (actions.attacker === "makaze") {
                        if (actions.opponent === "kamen") {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${opponent} won!`, components: []})
                        } else {
                            await interaction.editReply({content: `**${interaction.user.username} vs ${opponent.username}** \n${interaction.user} won!`, components: []})
                        }
                    }
                }
            })

            collector.on("end", () => {

            })
        })
    },
};