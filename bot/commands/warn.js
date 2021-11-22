const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require("../utility/BotModule")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("This is how people with sufficient permissions warn people..")
        .addUserOption(option => option.setName("user").setDescription("Who do you want to warn?").setRequired(true)),

    async execute(interaction) {
        await interaction.reply({ content: "this is a WIP command." })
        return;

        const user = interaction.options.getUser("korisnik")
        await handler(user.id).then(async reply => {
            await handler.warnUser(user).then(async returned => {
                if (returned === "SUCCESS") {
                    await interaction.reply({ content: `Uspesno si upozorio <@${user.id}>. Da vidis koliko upozorenja ima ukucaj \`/upozorenja <@${user.id}>\``});
                } else if (returned === "BOT") {
                    await interaction.reply({ content: `Koliko god da bih zeleo da upozorim botove, ne mogu.`});
                } else if (returned === "ERROR") {
                    await interaction.reply({ content: `Uspesno si upozorio <@${user.id}>. Ali nisam mogao da mu posaljem DM. Da vidis koliko upozorenja ima ukucaj \`/upozorenja <@${user.id}>\``});
                }
            })
        })
    },
};