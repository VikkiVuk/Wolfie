const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('bored? get a random meme with this command!'),

    async execute(interaction) {
        const embed = new MessageEmbed()
        let response = await fetch('https://www.reddit.com/r/memes/random/.json', {method:'GET',redirect:'follow'})

        let content = await response.json()
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;
        embed.setTitle(`${memeTitle}`)
        embed.setURL(`${memeUrl}`)
        embed.setImage(memeImage)
        embed.setColor('RANDOM')
        embed.setFooter({text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`})
        interaction.reply({ embeds: [embed] })
    },
};