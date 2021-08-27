const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
       .setName('channel')
       .setDescription('Ovo je komanda za testiranje uglavnom.')
       .addSubcommand(sub => sub.setName("lock").setDescription("Zakljuca channel tako da ne moze niko ko je samo verifikovan da pise."))
       .addSubcommand(sub => sub.setName("unlock").setDescription("Otkljuca channel tako da svi opet mogu da pisu.")),
  
    async execute(interaction) {
        const chnl = interaction.channel
        const subcommand = interaction.options.getSubcommand()

        if (subcommand == "lock") {
            chnl.permissionOverwrites.edit('878606227045756952', { SEND_MESSAGES: false });
            await interaction.reply({ content: "Kanal je zakljucan, svi koji su verifikovani ne mogu da pisu ovde."})
        } else {
            chnl.permissionOverwrites.edit('878606227045756952', { SEND_MESSAGES: true });
            await interaction.reply({ content: "Kanal je otkljucan, svi koji su verifikovani sada mogu da pisu."})
        }
    },
};