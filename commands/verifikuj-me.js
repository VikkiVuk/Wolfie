const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const random = require('../utility/generateRandom')

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

                            // While there remain elements to shuffle...
                            while (currentIndex != 0) {

                                // Pick a remaining element...
                                randomIndex = Math.floor(Math.random() * currentIndex);
                                currentIndex--;

                                // And swap it with the current element.
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

                        reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 5000}).then(async button2 => {
                            if (button2.customId === "rightver") {
                                const verifiedRole = interaction.guild.roles.cache.get('878606227045756952');

                                interaction.member.roles.add(verifiedRole)

                                const embed = new MessageEmbed().setTitle('VERIFIKOVAN').setDescription('Zdravo <@' + interaction.member.user.id + '>, ti si sad verifikovan! Sada bi trebao da imas pristup svim kanalima naravno ne onim koji admini mogu da pristupe samo. \n \n Ako vec nisi molim te idi procitaj pravila u <#878606227075108879>').setTimestamp().setFooter(config.defaultFooter).setColor('#0091ff')

                                await interaction.editReply({content: null, embeds: [embed], components: []})
                            } else if (button2.customId === "wrongver" || button2.customId === "wrongver2") {
                                await interaction.editReply({ content: "Netacno, molim te pokusaj opet.", embeds: [], components: [] })
                            }
                        }).catch(err => interaction.editReply({ content: `Vreme ti je isteklo, molim te pokusaj ponovo.`, components: [] }))
                    }
                }).catch(err => interaction.editReply({ content: `Vreme ti je isteklo, molim te pokusaj ponovo.`, components: [] }));
            })
        }
    },
};