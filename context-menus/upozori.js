const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const handler = require("../utility/user-handler")
module.exports = {
    data: {
        name: "Upozori",
        type: 2
    },

    async execute(interaction) {
        const user = interaction.options.getUser("user")
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