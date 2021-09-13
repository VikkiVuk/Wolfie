const { MessageEmbed,MessageAttachment, MessageActionRow, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sutni')
        .setDescription('Ovako moderatori mogu da izbace nekog sa servera.')
        .addUserOption(option => option.setName('korisnik').setDescription("Koga da kickujes/sutnes?").setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getMember('korisnik')

        const row = new MessageActionRow().addComponents([
            new MessageButton().setLabel("Da, izbaci korisnika.").setStyle("DANGER").setCustomId("yes"),
            new MessageButton().setLabel("Ne, vrati me nazad.").setStyle("PRIMARY").setCustomId("no")
        ])

        const filter = b => {
            b.deferUpdate();
            return b.user.id === interaction.user.id;
        };

        await interaction.reply({ content: `Da li si siguran da zelis da izbacis korisnika: **${user.user.username}#${user.user.discriminator}**?`, components: [row], fetchReply: true }).then(reply => {
            reply.awaitMessageComponent({ filter, componentType: "BUTTON", time: 20000 }).then(async button => {
                if (button.customId === "yes") {
                    user.kick().then(async () => {
                        await interaction.editReply({ content: `Uspesno sam izbacio korisnika: **${user.user.username}#${user.user.discriminator}**`})
                    }).catch(async (e) => {
                        await interaction.editReply({ content: "Ne mogu da izbacim tog korisnika.", components: [] })
                    })
                } else if (button.customId === "no") {
                    await interaction.editReply({ content: `Ok, nisam izbacio korisnika.`, components: [] })
                }
            }).catch(async err => {
                await interaction.editReply({ content: `Vreme ti je isteklo.`, components: [] })
            })
        })
    },
};