const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const util = require("../utility/UtilityModule").modules
const random = require('../utility/generateRandom')
const wait = require('util').promisify(setTimeout)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('verify yourself in supported servers.'),

    async execute(interaction) {
        const config = await configHand.configuration(`${interaction.guild.id}`)
        let failembed = new MessageEmbed().setTitle("VERIFICATION FAILED").setDescription(`<@${interaction.member.user.id}>, you have failed our verification, please restart the verification.`).setFooter({text: "Wolfie • I AM A HUMAN"}).setTimestamp().setColor("#ff003b")

        if (config.verifiedRole) {
            if (interaction.member.roles.cache.find(r => r.id === config.verifiedRole)) {
                await interaction.reply({content: "❌ You're already verified!", ephemeral: true})
            } else {
                // Step 1
                const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('verification').setLabel('I am a human').setStyle('PRIMARY'));
                await interaction.reply({ content: `Hey! Just click the button below and then we can start the verification.`, ephemeral: false, components: [row] })

                // Step 2
                const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

                interaction.fetchReply().then(reply => {
                    reply.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 }).then(async() => {
                        const x = await random.randomNumber(1, 10);const y = await random.randomNumber(1, 10);const result = x + y;const wrongResult = result + x;const wrongResult2 = result - y
                        let buttons = [ new MessageButton().setCustomId('wrongver').setLabel(`${wrongResult}`).setStyle('PRIMARY'), new MessageButton().setCustomId('rightver').setLabel(`${result}`).setStyle('PRIMARY'), new MessageButton().setCustomId('wrongver2').setLabel(`${wrongResult2}`).setStyle('PRIMARY') ]
                        buttons = await util.shuffle(buttons);

                        const secondrow = new MessageActionRow().addComponents(buttons);
                        await interaction.editReply({ content: `What is ${x} + ${y}?`, ephemeral: false, components: [secondrow] })

                        reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 30000}).then(async button => {
                            if (button.customId === "rightver") {
                                let successEmbed = new MessageEmbed().setTitle('VERIFICATION PASSED').setDescription(`<@${interaction.member.user.id}>, you have passed our verification, congrats! \n \nPlease comply with the server, discord and bot rules to avoid getting banned from the bot.`).setTimestamp().setFooter({text: "Wolfie • I AM A HUMAN"}).setColor('#00ff9d')

                                if (config.verifiedRole) {
                                    interaction.member.roles.add(config.verifiedRole)
                                }

                                await interaction.editReply({ content: "", embeds: [successEmbed] })
                            } else { await interaction.editReply({ embeds: [failembed], components: [] });await wait(5000);await interaction.deleteReply(); }
                        }).catch(async() => {await interaction.editReply({ embeds: [failembed], components: [] });await wait(5000);await interaction.deleteReply();})
                    }).catch(async() => {await interaction.editReply({ embeds: [failembed], components: [] });await wait(5000);await interaction.deleteReply();})
                })
            }
        } else {
            await interaction.reply({content:"Sorry, this guild has not set up verification."})
        }
    },
}