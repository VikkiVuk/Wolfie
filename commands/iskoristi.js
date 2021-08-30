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

                    const message = await selected.followUp({ embeds: [laptopEmbed], components: [row]})
                    message.awaitMessageComponent({ filter, componentType: "BUTTON", time: 60000}).then(async(button) => {
                        const willBreak = Math.random() < 0.30
                        if (willBreak) {
                            await handler.removeItem(button.user.id, 1, "Laptop")
                            await handler.addItem(button.user.id, 1, "Cricket")
                            await button.followUp({content: `Ups! Tvoj mim je bio smece i fanovi su ti unistili laptop. Ali, barem si dobio **1 Cricket**`})
                        } else {
                            const randomNum = await generateRandom.randomNumber(1500, 6000)
                            await handler.changeMoney(button.user.id, true, randomNum)
                            await button.followUp({ content: `Ljudima se svideo tvoj mim i dobio si **${randomNum}** novca.`})
                        }
                    })
                } else if (itemname === "Stap za pecanje") {
                    const willBreak = Math.random() < 0.25
                    if (willBreak) {
                        await handler.removeItem(selected.user.id, 1, "Stap za pecanje")
                        await selected.followUp({content: `Ah, izgleda kao da ti je ajkula zgrabila stap i pojela ga. Izgubio si tvoj stap.`})
                    } else {
                        const randomNum = await generateRandom.randomNumber(1500, 3000)
                        const randomFishes = await generateRandom.randomNumber(1, 5)
                        await handler.changeMoney(selected.user.id, true, randomNum)
                        await handler.addItem(selected.user.id, randomFishes, "Riba")
                        await selected.followUp({ content: `Uspesno si se vratio kuci i doneo **${randomFishes} riba** i **${randomNum} novca**.`})
                    }
                } else if (itemname === "Metla") {
                    await handler.removeItem(selected.user.id, 1, "Metla")
                    await selected.followUp({ content: `Ocistio si svoju sobu, sad nema nista da te napadne dok spavas.` })
                } else {
                    await interaction.followUp({ content: "Izvini, ovaj item nije interaktivan." })
                }
            }).catch(err => {
                interaction.followUp({ content: `<@${interaction.user.id}> vreme ti je isteklo. Molim te ponovo pokreni komandu.`})
            })
        })
    },
};