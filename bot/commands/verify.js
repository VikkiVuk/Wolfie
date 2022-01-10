const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const random = require('../utility/generateRandom')
const captcha = require('discord.js-captcha');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('verify yourself so you can use commands.'),

    async execute(interaction) {
        if (interaction.member.roles.cache.find(r => r.name == "Verified")) {
            await interaction.reply({content: '❌ You are already verified!', ephemeral: false})
        } else {
            const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('verification').setLabel('I am a human').setStyle('PRIMARY'));
            await interaction.reply({ content: `Hey! Just click the button below and we will verify you.`, ephemeral: false, components: [row] })

            const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

            interaction.fetchReply().then(reply => {
                reply.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 }).then(async button => {
                    if (button.customId === 'verification') {
                        const x = await random.randomNumber(1, 10)
                        const y = await random.randomNumber(1, 10)
                        const result = x + y
                        const wrongResult = result + x
                        const wrongResult2 = result - y

                        const buttons = [
                            new MessageButton().setCustomId('wrongver').setLabel(`${wrongResult}`).setStyle('PRIMARY'),
                            new MessageButton().setCustomId('rightver').setLabel(`${result}`).setStyle('PRIMARY'),
                            new MessageButton().setCustomId('wrongver2').setLabel(`${wrongResult2}`).setStyle('PRIMARY')
                        ]

                        function shuffle(array) {
                            let currentIndex = array.length, randomIndex;

                            while (currentIndex != 0) {

                                randomIndex = Math.floor(Math.random() * currentIndex);
                                currentIndex--;

                                [array[currentIndex], array[randomIndex]] = [
                                    array[randomIndex], array[currentIndex]];
                            }

                            return array;
                        }

                        shuffle(buttons);

                        const secondrow = new MessageActionRow().addComponents(buttons);

                        await interaction.editReply({
                            content: `Something is sus... How much is ${x} + ${y}?`,
                            ephemeral: false,
                            components: [secondrow]
                        })

                        reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 10000}).then(async button2 => {
                            if (button2.customId === "rightver") {
                                const captchao = new captcha.Captcha(interaction.client, {
                                    guildID: interaction.guild.id,
                                    roleID: "878606227045756952",
                                    channelID: interaction.channel.id, 
                                    sendToTextChannel: true,
                                    attempts: 3,
                                    timeout: 30000, 
                                    showAttemptCount: true,
                                    customPromptEmbed: new MessageEmbed().setTitle("VERIFICATION").setDescription("Please type what you see in the picture down below.").setFooter(config.defaultFooter).setColor("BLURPLE").setTimestamp(), //customise the embed that will be sent to the user when the captcha is requested
                                    customSuccessEmbed: new MessageEmbed().setTitle('VERIFIED').setDescription('Hi <@' + interaction.member.user.id + '>, you are now verified! If this server is eligible, you will get a verified role, but anyways you can use the bot now.. \n \nPlease read the rules (discord tos, wolfie tos, server rules) to avoid getting unverified and possibly banned').setTimestamp().setFooter(config.defaultFooter).setColor('#0091ff'),
                                    customFailureEmbed: new MessageEmbed().setTitle("ERROR").setDescription(`Hello, <@${interaction.member.user.id}>, you havent been verified, please try again.`).setFooter(config.defaultFooter).setTimestamp().setColor("RED"), //customise the embed that will be sent to the user when they fail to solve the captcha
                                });

                                await captchao.present(interaction.member)

                                await interaction.deleteReply()
                            } else if (button2.customId === "wrongver" || button2.customId === "wrongver2") {
                                await interaction.editReply({ content: "incorrect, try again.", embeds: [], components: [] })
                                setTimeout(async() => {
                                    await interaction.deleteReply();
                                }, 5000);
                            }
                        }).catch(err => interaction.editReply({ content: `time ran out.`, components: [] }))
                    }
                }).catch(err => interaction.editReply({ content: `time ran out.`, components: [] }));
            })
        }
    },
};