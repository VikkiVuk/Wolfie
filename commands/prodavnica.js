const { MessageEmbed,MessageAttachment, MessageActionRow, MessageSelectMenu} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const economy = require("../utility/economy");
const inventory = require("../utility/inventory-handler");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prodavnica')
        .setDescription('Ovde mozete da kupite stvari.'),

    async execute(interaction) {
        const items = ["Laptop:15000", "Stap za pecanje:10000", "Zlatni trofej: 50000", "Metla:1500", "Govno:69420"]
        let options = []

        const embed = new MessageEmbed().setTitle("Prodavnica").setDescription("Zdravo! Hvala sto koristis mene, dole imas sve iteme koje mozes da uzmes. Kad si odlucio samo idi na ono skroz dole klikni na to i izaberi koji item zelis da kupis.").setColor("BLURPLE").setTimestamp().setFooter("Auto VikkiVuk")

        items.forEach(function (item, index) {
            const itemparts = item.split(':')
            const name = itemparts[0]
            const cost = itemparts[1]

            embed.addField(name, `Ovaj item kosta **${cost}** novca.`)
            const option = {label: name, description: `Ovaj item kosta ${cost} novca.`, value: name}
            options.push(option)
        })

        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select').setPlaceholder('Izaberi nesto da kupis.').addOptions(options));

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

        interaction.fetchReply().then(async(reply) => {
            reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 }).then(async(interaction) => {
                for (const item of items) {
                    const itemparts = item.split(':')
                    const name = itemparts[0]
                    const cost = itemparts[1]

                    if (name === interaction.values[0]) {
                        const usercoins = await economy.getCoins(interaction.guildId, interaction.user.id)

                        if (usercoins >= cost) {
                            await economy.removeCoins(interaction.guildId, interaction.user.id, cost)
                            await inventory.addItem(interaction.user.id, 1, interaction.values[0])

                            await interaction.followUp({ content: `<@${interaction.user.id}> uspesno si kupio item: **${interaction.values[0]}** za **${cost} novca**.` })
                        } else {
                            await interaction.followUp({ content: `<@${interaction.user.id}> nemas dovoljno novca za item: **${interaction.values[0]}**.`})
                        }
                    }
                }
            }).catch(err => interaction.followUp({ content: `<@${interaction.user.id}> vreme ti je isteklo. Molim te ponovo pokreni komandu.`}));
        })
    },
};