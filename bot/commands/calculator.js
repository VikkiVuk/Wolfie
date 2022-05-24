const {MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent} = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculator')
        .setDescription('Your Virtual Discord Calculating Assistant!'),

    async execute(interaction) {
        await interaction.deferReply()

        let firstact = new MessageActionRow().addComponents(
            new MessageButton().setLabel("1").setStyle("PRIMARY").setCustomId("1"),
            new MessageButton().setLabel("2").setStyle("PRIMARY").setCustomId("2"),
            new MessageButton().setLabel("3").setStyle("PRIMARY").setCustomId("3")
        )

        let secondact = new MessageActionRow().addComponents(
            new MessageButton().setLabel("4").setStyle("PRIMARY").setCustomId("4"),
            new MessageButton().setLabel("5").setStyle("PRIMARY").setCustomId("5"),
            new MessageButton().setLabel("6").setStyle("PRIMARY").setCustomId("6")
        )

        let thirdact = new MessageActionRow().addComponents(
            new MessageButton().setLabel("7").setStyle("PRIMARY").setCustomId("7"),
            new MessageButton().setLabel("8").setStyle("PRIMARY").setCustomId("8"),
            new MessageButton().setLabel("9").setStyle("PRIMARY").setCustomId("9")
        )

        let fourthact = new MessageActionRow().addComponents(
            new MessageButton().setLabel("+").setStyle("SECONDARY").setCustomId("+"),
            new MessageButton().setLabel("0").setStyle("PRIMARY").setCustomId("0"),
            new MessageButton().setLabel("-").setStyle("SECONDARY").setCustomId("-")
        )

        let fifthact = new MessageActionRow().addComponents(
            new MessageButton().setLabel("*").setStyle("SECONDARY").setCustomId("*"),
            new MessageButton().setLabel("=").setStyle("SECONDARY").setCustomId("calculate"),
            new MessageButton().setLabel("/").setStyle("SECONDARY").setCustomId("/")
        )
        const filter = b => {return b.user.id === interaction.user.id;};
        let operation = ""
        await interaction
            .editReply({embeds: [new MessageEmbed()
                .setTitle("Calculator")
                .setColor("#6f09ff")
                .setDescription("Please input some numbers in order to get a reading!")
                .addField("Display", "```000000```")
                .setFooter({ text: "Made with <3 by VikkiVuk." })
            ],
            components: [firstact, secondact, thirdact, fourthact, fifthact ],
        })

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });
        collector.on('collect', async i => {
            if (i.customId == "calculate") {
                let result = eval(operation)
                i.update({embeds: [new MessageEmbed()
                        .setTitle("Calculator")
                        .setColor("#6f09ff")
                        .setDescription("Please input some numbers in order to get a reading!")
                        .addField("Display", "```" + result + "```")
                        .setFooter({ text: "Made with <3 by VikkiVuk." })
                    ],})
                operation = result
            } else {
                operation += (isNaN(i.customId)) ? (" " + i.customId + " ") : i.customId

                i.update({embeds: [new MessageEmbed()
                        .setTitle("Calculator")
                        .setColor("#6f09ff")
                        .setDescription("Please input some numbers in order to get a reading!")
                        .addField("Display", "```" + operation + "```")
                        .setFooter({ text: "Made with <3 by VikkiVuk." })
                    ],})
            }
        });

        collector.on('end', collected => {interaction.editReply({ content: "Time Expired!", components: [], embeds: [] })});
    },
};