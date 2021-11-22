const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const BotModule = require("../utility/BotModule")
const guildconfig = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-item')
        .setDescription('Bot masters can add a custom, guild-only, item to the shop.')
        .addStringOption(option => option.setName("item-name").setDescription("the name of the item").setRequired(true))
        .addIntegerOption(option => option.setName("price").setDescription("how much money would need to be spent in order to obtain this item.").setRequired(true)),

    async execute(interaction) {
        if (interaction.inGuild()) {
            const config = await guildconfig.configuration(`${interaction.guild.id}`)

            if (config.botmasters) {
                if (interaction.member.roles.cache.some(r => config.botmasters.indexOf(r.id) >= 0) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                    const itemname = interaction.options.getString("item-name")
                    const itemcost = interaction.options.getInteger("price")

                    await guildconfig.CreateGuildItem(interaction.guild.id, itemname, itemcost)
                    await interaction.reply({content: `You have successfully added the item **${itemname}** which is worth **W$ ${itemcost}**.`})
                } else {
                    await interaction.reply({ content: "Sorry you do not have the sufficient permissions to do this." })
                }
            } else {
                if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                    const itemname = interaction.options.getString("item-name")
                    const itemcost = interaction.options.getInteger("price")

                    await guildconfig.CreateGuildItem(interaction.guild.id, itemname, itemcost)
                    await interaction.reply({content: `You have successfully added the item **${itemname}** which is worth **W$ ${itemcost}**.`})
                } else {
                    await interaction.reply({ content: "Sorry you do not have the sufficient permissions to do this." })
                }
            }
        } else {
            await interaction.reply({ content: "Sorry this is a guild-only command." })
        }
    },
};