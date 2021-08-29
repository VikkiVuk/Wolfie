const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const inventory = require("../utility/inventory-handler")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claimaj svoju nagradu, ova komanda ce uskoro biti sklonjena.'),

    async execute(interaction) {
        const result = await inventory.addItem(interaction.user.id, 1, "Gumena Patka")

        if (result === "NO_DOCUMENT") {
            await interaction.reply({ content: "Izvini ti nemas inventar, molim te pokreni komandu `/ranac` da bi mogao da claimas svoj free item." });
        } else {
            await interaction.reply({ content: "Uspesno si claimovao item **Gumena Patka**." });
        }
    },
};