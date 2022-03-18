const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catfact')
        .setDescription('Get a random cat fact with this command!'),

    async execute(interaction) {
        let response = await fetch(`https://api.monkedev.com/facts/cat&key=uXlaMpi3zUgonsZVgncHLIW47`, {method: 'GET', redirect: 'follow'})
        let content = await response.json()

        await interaction.editReply({ content: (content) ? content.response : "I dont know." })
    },
};