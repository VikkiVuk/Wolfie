const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const random = require("../utility/generateRandom")
const handler = require('../utility/user-handler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pogodi')
        .setDescription('Ovako mozes da pogadjas, dobijes novac ako tacno pogodis.'),

    async execute(interaction) {
        let options = []

        for (i=1; i<=10; i++) {
            options.push({label: `${i}`, description: null, value: `${i}`})
        }

        const row = new MessageActionRow().addComponents(new MessageSelectMenu().addOptions(options).setCustomId("pogodibroj"))
        await interaction.reply({ content: `Izaberi broj!`, components: [row] });

        const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

        interaction.fetchReply().then(async(reply) => {
            reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 }).then(async(selected) => {
                if (selected.customId === "pogodibroj") {
                    const broj = selected.values[0]
                    const randomNumber = await random.randomNumber(1, 10)

                    if (randomNumber == broj) {
                        await handler.changeMoney(interaction.user.id, true, (randomNumber * 10) + 20000)
                        await interaction.editReply({ content: `CESTITAM! Pogodio si broj. Dobio si **${(randomNumber * 10) + 20000} novca**`, components: [] })
                    } else {
                        await interaction.editReply({ content: `Nisi dobio broj... Broj je bio **${randomNumber}**. Vise srece sledeci put.`, components: [] })
                    }
                }
            }).catch(err => interaction.editReply({ content: `Vreme ti je isteklo, pokusaj ponovo.`, components: [] }))
        })
    },
};