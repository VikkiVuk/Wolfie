const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const random = require('../utility/generateRandom')
const captcha = require('discord.js-captcha');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifikuj-se')
        .setDescription('Um, verifikuj se? Sta drugo ti kazem.'),

    async execute(interaction) {
        if (interaction.member.roles.cache.has('878606227045756952')) {
            await interaction.reply({content: '❌ Vec si verifikovan!', ephemeral: false})
        } else {
            const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('verification').setLabel('Ja sam covek').setStyle('PRIMARY'));
            await interaction.reply({ content: `Hej! Samo klikni dugme dole da bi se verifikovao, da bi smo znali da si covek.`, ephemeral: false, components: [row] })

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
                            content: `Nesto mi je ovde sumnjivo... Koliko je ${x} + ${y}?`,
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
                                    customPromptEmbed: new MessageEmbed().setTitle("VERIFIKACIJA").setDescription("Molim te ukucaj kod koji vidis dole u chat.").setFooter(config.defaultFooter).setColor("BLURPLE").setTimestamp(), //customise the embed that will be sent to the user when the captcha is requested
                                    customSuccessEmbed: new MessageEmbed().setTitle('VERIFIKOVAN').setDescription('Zdravo <@' + interaction.member.user.id + '>, ti si sad verifikovan! Sada bi trebao da imas pristup svim kanalima naravno ne onim koji admini mogu da pristupe samo. \n \n Ako vec nisi molim te idi procitaj pravila u <#878606227075108879>').setTimestamp().setFooter(config.defaultFooter).setColor('#0091ff'),
                                    customFailureEmbed: new MessageEmbed().setTitle("GRESKA").setDescription(`Zdravo, <@${interaction.member.user.id}>, nisi uspeo da se verifikujes molim te pokusaj ponovo.`).setFooter(config.defaultFooter).setTimestamp().setColor("RED"), //customise the embed that will be sent to the user when they fail to solve the captcha
                                });

                                captchao.present(interaction.member)

                                await interaction.deleteReply()
                            } else if (button2.customId === "wrongver" || button2.customId === "wrongver2") {
                                await interaction.editReply({ content: "Netacno, molim te pokusaj opet.", embeds: [], components: [] })
                                setTimeout(async() => {
                                    await interaction.deleteReply();
                                }, 5000);
                            }
                        }).catch(err => interaction.editReply({ content: `Vreme ti je isteklo, molim te pokusaj ponovo.`, components: [] }))
                    }
                }).catch(err => interaction.editReply({ content: `Vreme ti je isteklo, molim te pokusaj ponovo.`, components: [] }));
            })
        }
    },
};