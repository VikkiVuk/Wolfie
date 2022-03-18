const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mock')
        .setDescription('is someone annoying you? use this to mock something they said.')
        .addStringOption(option => option.setName("text").setDescription("what do you want to mock?").setRequired(true)),

    async execute(interaction) {
        const str = interaction.options.getString("text").toLowerCase()

        function toUpperCase(str) {
            return str.split('').map((v, i) => i % 2 == 0 ? v.toLowerCase() : v.toUpperCase()).join('');
        }

        await interaction.reply({ content: toUpperCase(str) })
    },
};