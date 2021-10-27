const { MessageEmbed,MessageAttachment, MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require('../utility/user-handler')
const generateRandom = require("../utility/generateRandom");
const config = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('iskoristi')
        .setDescription('Ovako mozes da iskoristis tvoj item iz ranca ako moze da se iskoristi.'),

    async execute(interaction) {
        await handler(interaction.user.id)

        const currentItems = await handler.checkItems(interaction.user.id)
        let options = []

        const embed = new MessageEmbed().setTitle("Koriscenje").setDescription("Dole imas select menu gde mozes da izaberes koji item zelis da iskoristis. Da vidis koliko itema i koje iteme imas ukucaj `/ranac`").setColor("BLURPLE").setTimestamp().setFooter(config.defaultFooter)

        currentItems.forEach(function (item, index) {
            const itemparts = item.split(":")
            const itemname = itemparts[0]

            const option = {label: itemname, description: null, value: itemname}
            options.push(option)
        })

        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select').setPlaceholder('Izaberi nesto.').addOptions(options));

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

        interaction.fetchReply().then(async(reply) => {
            reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 }).then(async(selected) => {
                const itemname = selected.values[0]

                if (itemname === "Laptop") {
                    const laptopEmbed = new MessageEmbed().setDescription("**POSTUJ MIM ONLAJN** \nNadaj se da ce ljudima da se svidi tvoj mim jer ako im se ne svidi oni ce ti POLOMITI LAPTOP.").setTimestamp().setFooter(config.defaultFooter).setColor("YELLOW")
                    const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('fresh').setLabel('Novi').setStyle('PRIMARY'), new MessageButton().setCustomId('repost').setLabel('Repost').setStyle('PRIMARY'), new MessageButton().setCustomId('intellectual').setLabel('Pametni').setStyle('PRIMARY'), new MessageButton().setCustomId('copypasta').setLabel('Izkopiran').setStyle('PRIMARY'), new MessageButton().setCustomId('Kind').setLabel('Dobar').setStyle('PRIMARY'));

                    await interaction.editReply({ embeds: [laptopEmbed], components: [row]})
                    reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 60000}).then(async(button) => {
                        const willBreak = Math.random() < 0.28
                        if (willBreak) {
                            await handler.removeItem(button.user.id, 1, "Laptop")
                            await handler.addItem(button.user.id, 1, "Cricket")
                            await interaction.editReply({content: `Ups! Tvoj mim je bio smece i fanovi su ti unistili laptop. Ali, barem si dobio **1 Cricket**`, embeds: [], components: []})
                        } else {
                            const randomNum = await generateRandom.randomNumber(1500, 6000)
                            await handler.changeMoney(button.user.id, true, randomNum)
                            await interaction.editReply({ content: `Ljudima se svideo tvoj mim i dobio si **W$ ${randomNum}**.`, embeds: [], components: []})
                        }
                    })
                } else if (itemname === "Štap za Pecanje") {
                    const willBreak = Math.random() < 0.25
                    if (willBreak) {
                        await handler.removeItem(selected.user.id, 1, "Štap za Pecanje")
                        await interaction.editReply({content: `Ah, izgleda kao da ti je ajkula zgrabila stap i pojela ga. Izgubio si tvoj stap.`, embeds: [], components: []})
                    } else {
                        const randomNum = await generateRandom.randomNumber(1500, 3000)
                        const randomFishes = await generateRandom.randomNumber(1, 5)
                        await handler.changeMoney(selected.user.id, true, randomNum)
                        await handler.addItem(selected.user.id, randomFishes, "Riba")
                        await interaction.editReply({ content: `Uspesno si se vratio kuci i doneo **${randomFishes} riba** i **W$ ${randomNum}**.`, embeds: [], components: []})
                    }
                } else if (itemname === "Metla") {
                    await handler.removeItem(selected.user.id, 1, "Metla")
                    await interaction.editReply({
                        content: `Ocistio si svoju sobu, sad nema nista da te napadne dok spavas.`,
                        embeds: [],
                        components: []
                    })
                } else if (itemname === "Lopata") {
                    const willBreak = Math.random() < 0.05
                    if (willBreak) {
                        await handler.removeItem(selected.user.id, 1, "Lopata")
                        await interaction.editReply({
                            content: `Wow ti stvarno nemas srece, imao si samo 0.05% sansu da izgubis lopatu i izgubio si je. :/`,
                            embeds: [],
                            components: []
                        })
                    } else {
                        const randomNum = await generateRandom.randomNumber(20, 120)
                        await handler.changeMoney(selected.user.id, true, randomNum)
                        await interaction.editReply({
                            content: `Iskopao si **W$ ${randomNum}**... Pitam se ko je bio toliko ne srecan da im ispadne novac...`,
                            embeds: [],
                            components: []
                        })
                    }
                } else if(itemname === "Telefon") {
                    const sendembed = new MessageEmbed().setTitle(`Posalji poruku`).setDescription("Kome zelis da posaljes poruku? Imas 20 sekundi da odgovoris, npr: @NotVikki ili tako nesto.").setColor("BLUE").setTimestamp().setFooter(config.defaultFooter)
                    await interaction.editReply({ content: null, embeds: [sendembed], components: [] })

                    const messagefilter = m => { return m.author.id === interaction.user.id; };

                    interaction.channel.awaitMessages({ messagefilter, max: 1, time: 20000, errors: ['time'] }).then(async message => {
                        if (message.first().mentions) {
                            const mentioned = message.first().mentions.users.first()

                            const messageembedd = new MessageEmbed().setTitle(`Posalji poruku`).setDescription("Sta zelis da mu posaljes? Imas 20 sekundi da odgovoris.").setColor("BLUE").setTimestamp().setFooter(config.defaultFooter)
                            await interaction.followUp({ content: null, embeds: [messageembedd], components: [] })

                            interaction.channel.awaitMessages({ messagefilter, max: 1, time: 20000, errors: ['time'] }).then(async message => {
                                await handler(mentioned.id).then(async result => {
                                    await handler.sendMessage(mentioned.id, interaction.user.username, message.first().content)
                                })

                                await interaction.followUp({ content: `Uspesno si poslao poruku \`\`\`${message.first().content}\`\`\` korisniku ${mentioned}.`, embeds: [], components: [] })
                            }).catch(async(err) => {
                                console.log(err)
                                await interaction.editReply({ content: `Nisi odgovorio na vreme. Pokusaj ponovo.`, embeds: [], components: [] })
                            });
                        } else {
                            await interaction.followUp({ content: `Molim te pinguj nekog, ne samo ime da napises ili tako nesto.`, emebds: [], components: [] })
                        }
                    }).catch(async(err) => {
                        await interaction.editReply({ content: `Nisi odgovorio na vreme. Pokusaj ponovo.`, embeds: [], components: [] })
                    });
                } else {
                    await interaction.editReply({
                        content: "Izvini, ovaj item nije interaktivan.",
                        embeds: [],
                        components: []
                    })
                }
            }).catch(err => {
                interaction.followUp({ content: `<@${interaction.user.id}> vreme ti je isteklo. Molim te ponovo pokreni komandu.`})
            })
        })
    },
};