const { MessageEmbed, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Yeah, well Wolfie will predict you future with this command.')
        .addStringOption(option => option.setName("question").setDescription("What do you want to ask Wolfie?").setRequired(true)),

    async execute(interaction) {
        const question = interaction.options.getString("question")
        let answers = [
            'Maybe.', 'Certainly not.', 'I hope so.', 'Not in your wildest dreams.',
            'There is a good chance.', 'Quite likely.', 'I think so.', 'I hope not.',
            'I hope so.', 'Never!', 'Fuhgeddaboudit.', 'Ahaha! Really?!?', 'Pfft.',
            'Sorry, bucko.', 'Hell, yes.', 'Hell to the no.', 'The future is bleak.',
            'The future is uncertain.', 'I would rather not say.', 'Who cares?',
            'Possibly.', 'Never, ever, ever.', 'There is a small chance.', 'Yes!'];     
               
        const response = answers[Math.floor(Math.random() * answers.length)]
        const embed = new MessageEmbed().setTitle(question + "?").setDescription("<:reply:884528743673135144> " + response)

        await interaction.reply({ embeds: [embed] });
    },
};