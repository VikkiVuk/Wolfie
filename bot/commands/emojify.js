const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Convert normal text into B I G T E X T')
        .addStringOption(option => option.setName("text").setDescription("Its really obvious what you have to enter here.").setRequired(true)),

    async execute(interaction) {
        const text = interaction.options.getString("text").toLowerCase().split('')

        let emojified = ""
        for (const t of text) {
            if (t === " ") {
                emojified += "    "
            } else {
                emojified += ` :regional_indicator_`.concat(`${t}:`)
            }
        }

        await interaction.reply(emojified);
    },
};