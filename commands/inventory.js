const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const inventory = require("../utility/inventory-handler")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranac')
        .setDescription('Ovako mozete da vidite sta sve imate zaradjeno na botu.'),

    async execute(interaction) {
        const items = await inventory.checkItems(interaction.user.id)
        const embed = new MessageEmbed().setTitle("Tvoj ranac").setDescription("Ovde su tvoji itemi, iteme mozes da zaradis tako sto ides u shop ili koristis komande koje su podrzane.").setColor("GREEN").setTimestamp().setFooter("Auto VikkiVuk")

        items.forEach(function (item, index) {
            const itemparts = item.split(":")
            const itemamnt = itemparts[1]
            const itemname = itemparts[0]

            embed.addField(itemname, `Imas **${itemamnt}** ovog itema.`)
        });

        await interaction.reply({ embeds: [embed] });
    },
};