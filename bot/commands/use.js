const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const BotModule = require("../utility/BotModule")
const handler = new BotModule.UserModule()
const generateRandom = require("../utility/generateRandom");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Use the items you have in your inventory.'),

    async execute(interaction) {
        const intuser = await handler.getUser(`${interaction.user.id}`)
        const currentItems = await intuser.getkey("inventory")

        let options = []

        const embed = new MessageEmbed().setTitle("Interact").setDescription("Down below you have a select menu where you can select the item you want to use, to see how much of that item you have please use `/inventory`").setColor("BLURPLE").setTimestamp().setFooter(config.defaultFooter)

        for (const item of currentItems) {
            const itemname = item["name"]

            const option = {label: itemname, description: null, value: itemname}
            options.push(option)
        }

        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select').setPlaceholder('Use an item.').addOptions(options));

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

        interaction.fetchReply().then(async(reply) => {
            reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 }).then(async(selected) => {
                const itemname = selected.values[0]

                if (itemname === "Laptop") {
                    const laptopEmbed = new MessageEmbed().setDescription("**MEME POSTING SESSION** \nHope that people will like your meme, because if they dont... **bad things will happen** (jk you will just lose your laptop).").setTimestamp().setFooter(config.defaultFooter).setColor("YELLOW")
                    const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('fresh').setLabel('Fresh').setStyle('PRIMARY'), new MessageButton().setCustomId('repost').setLabel('Repost').setStyle('PRIMARY'), new MessageButton().setCustomId('intellectual').setLabel('Intellectual').setStyle('PRIMARY'), new MessageButton().setCustomId('copypasta').setLabel('Copypasta').setStyle('PRIMARY'), new MessageButton().setCustomId('Kind').setLabel('Kind').setStyle('PRIMARY'));

                    await interaction.editReply({ embeds: [laptopEmbed], components: [row]})
                    reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 60000}).then(async(button) => {
                        const willBreak = Math.random() < 0.28
                        if (willBreak) {
                            await intuser.removeItem("Laptop", 1)
                            await intuser.addItem("Cricket", 1)
                            await interaction.editReply({content: `People didnt like your trash meme and **broke your laptop**, but hey! you got **1 Cricket**`, embeds: [], components: []})
                        } else {
                            const randomNum = await generateRandom.randomNumber(1500, 6000)
                            await intuser.modify("money", randomNum, "ADD")
                            await interaction.editReply({ content: `People loved your fantastic meme and your fans gave you **W$ ${randomNum}**.`, embeds: [], components: []})
                        }
                    })
                } else if (itemname === "Fishing Rod") {
                    const willBreak = Math.random() < 0.25
                    if (willBreak) {
                        await intuser.removeItem("Fishing Rod", 1)
                        await interaction.editReply({content: `oh god a shark almost ate you, but you defended yourself with your fishing rod, so now its broken.`, embeds: [], components: []})
                    } else {
                        const randomNum = await generateRandom.randomNumber(1500, 3000)
                        const randomFishes = await generateRandom.randomNumber(1, 5)
                        await intuser.modify("money", randomNum, "ADD")
                        await intuser.addItem("Fish", randomFishes)
                        await interaction.editReply({ content: `You brought **${randomFishes} fish(es)** and **W$ ${randomNum}** home.`, embeds: [], components: []})
                    }
                } else if (itemname === "Broom") {
                    await intuser.removeItem("Broom", 1)
                    await interaction.editReply({
                        content: `You cleaned your room for the first time in ages, now you dont have to worry about something coming to eat you while you sleep....`,
                        embeds: [],
                        components: []
                    })
                } else if (itemname === "Shovel") {
                    const willBreak = Math.random() < 0.05
                    if (willBreak) {
                        await intuser.removeItem("Shovel" ,1)
                        await interaction.editReply({
                            content: `you are really unlucky, you had 0.05% chance to lose your shovel and you lost it. ugh.`,
                            embeds: [],
                            components: []
                        })
                    } else {
                        const randomNum = await generateRandom.randomNumber(20, 120)
                        await intuser.modify("money", randomNum, "ADD")
                        await interaction.editReply({
                            content: `You dug out **W$ ${randomNum}**... I need to know, who lost this money?`,
                            embeds: [],
                            components: []
                        })
                    }
                } else if(itemname === "Phone") {
                    const sendembed = new MessageEmbed().setTitle(`Send a Message`).setDescription("Who do you want to message? You have 20 seconds to ping someone in the chat.").setColor("BLUE").setTimestamp().setFooter(config.defaultFooter)
                    await interaction.editReply({ content: null, embeds: [sendembed], components: [] })

                    const messagefilter = m => { return m.author.id === interaction.user.id; };

                    interaction.channel.awaitMessages({ messagefilter, max: 1, time: 20000, errors: ['time'] }).then(async message => {
                        if (message.first().mentions) {
                            const mentioned = message.first().mentions.users.first()

                            const messageembedd = new MessageEmbed().setTitle(`Send a Message`).setDescription("What do you want to send them? You have 20 seconds to answer.").setColor("BLUE").setTimestamp().setFooter(config.defaultFooter)
                            await interaction.followUp({ content: null, embeds: [messageembedd], components: [] })

                            interaction.channel.awaitMessages({ messagefilter, max: 1, time: 20000, errors: ['time'] }).then(async message => {
                                console.log(mentioned.id, interaction.user.id, message.first().content)
                                await handler.sendMail(mentioned.id, interaction.user.id, message.first().content)

                                await interaction.followUp({ content: `You sent the message: \`\`\`${message.first().content}\`\`\` to ${mentioned}.`, embeds: [], components: [] })
                            }).catch(async(err) => {
                                console.log(err)
                                await interaction.editReply({ content: `time ran out.`, embeds: [], components: [] })
                            });
                        } else {
                            await interaction.followUp({ content: `please ping someone and not just say their name.`, emebds: [], components: [] })
                        }
                    }).catch(async(err) => {
                        await interaction.editReply({ content: `time ran out. try again.`, embeds: [], components: [] })
                    });
                } else {
                    await interaction.editReply({
                        content: "woopsies, this item is not interactive.",
                        embeds: [],
                        components: []
                    })
                }
            }).catch(err => {
                interaction.followUp({ content: `<@${interaction.user.id}> time ran out.`})
            })
        })
    },
};