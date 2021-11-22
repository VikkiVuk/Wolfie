const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const random = require("../utility/generateRandom")
const botmodule = require('../utility/BotModule')
const handler = new botmodule.UserModule()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Guess a number for MONEY MONEY MONEY'),

    async execute(interaction) {
        let options = []
        const intuser = await handler.getUser(`${interaction.user.id}`)

        for (i=1; i<=10; i++) {
            options.push({label: `${i}`, description: null, value: `${i}`})
        }

        const row = new MessageActionRow().addComponents(new MessageSelectMenu().addOptions(options).setCustomId("pogodibroj").setPlaceholder("Pick a number!"))
        await interaction.reply({ content: `Choose a number.`, components: [row] });

        const filter = i => { i.deferUpdate(); return i.user.id === interaction.user.id; };

        interaction.fetchReply().then(async(reply) => {
            reply.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 }).then(async(selected) => {
                if (selected.customId === "pogodibroj") {
                    const broj = selected.values[0]
                    const randomNumber = await random.randomNumber(1, 10)

                    if (+randomNumber === +broj) {
                        await intuser.modify("money", (randomNumber * 10) + 20000, "ADD")
                        await interaction.editReply({ content: `CONGRATS! You guessed the number i was thinking of. You got **W$ ${(randomNumber * 10) + 20000}**`, components: [] })
                    } else {
                        await interaction.editReply({ content: `You didnt guess the number... the number was **${randomNumber}**. better luck next time.`, components: [] })
                    }
                }
            }).catch(err => interaction.editReply({ content: `Time ran out.`, components: [] }))
        })
    },
};