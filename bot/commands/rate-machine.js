const { SlashCommandBuilder } = require('@discordjs/builders');
const random = require("../utility/generateRandom")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate-machine')
        .setDescription('How much are you ______.')
        .addSubcommand(command => command.setName("gay").setDescription("obvious enough"))
        .addSubcommand(command => command.setName("simp").setDescription("obvious enough."))
        .addSubcommand(command => command.setName("stupid").setDescription("obvious enough."))
        .addSubcommand(command => command.setName("toxic").setDescription("obvious enough.")),

    async execute(interaction) {
        const rate = interaction.options.getSubcommand()
        const randomRate = await random.randomNumber(0, 100)

        await interaction.reply({ content: `You are **${randomRate}% ${rate}**` });
    },
};