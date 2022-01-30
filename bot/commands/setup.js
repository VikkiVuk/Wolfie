const { MessageEmbed,MessageAttachment, MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require("../config.json")
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()
const generateRandom = require("../utility/generateRandom");
const wait = require("util").promisify(setTimeout)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Only the owner of the guild can change the guild config.')
        .addRoleOption(ro => ro.setName("muted-role").setDescription("The role that will be given to muted users.").setRequired(true))
        .addRoleOption(ro => ro.setName("member-role").setDescription("The role that will be given to users when they use /verify.").setRequired(true))
        .addChannelOption(opt => opt.setRequired(false).setName("greeting-channel").setDescription("A place where the bot will greet people, leave this blank if you dont want the bot to greet people."))
        .addRoleOption(opt => opt.setName("botmaster1").setDescription("A bot master, the role that will be given access to any command.").setRequired(false))
        .addRoleOption(opt => opt.setName("botmaster2").setDescription("A bot master, the role that will be given access to any command.").setRequired(false))
        .addRoleOption(opt => opt.setName("botmaster3").setDescription("A bot master, the role that will be given access to any command.").setRequired(false))
        .addRoleOption(opt => opt.setName("botmaster4").setDescription("A bot master, the role that will be given access to any command.").setRequired(false)),

    async execute(interaction) {
        await interaction.reply({content:"This command is currently under construction due to unexpected crashing!"})
        /*await interaction.deferReply({ ephemeral: true })
        if (interaction.member.user.id === interaction.guild.ownerId) {
            await wait(2000)
            await configHand.modify(`${interaction.guild.id}`, "mutedrole", interaction.options.getRole("muted-role"))
            await configHand.modify(`${interaction.guild.id}`, "memberrole", interaction.options.getRole("member-role"))
            const updatedconfig = configHand.configuration(`${interaction.guild.id}`)
            const embed = new MessageEmbed().setTitle("Current Guild Configuration").setDescription("You have successfully updated your guild configuration. Your new configuration is down below.")
                .addField("Muted Role", "<@" + updatedconfig.mutedrole + ">")
            await interaction.editReply({ content: "Your guild config has been set!", ephemeral: true, embeds: [embed] })
        } else {
            await interaction.editReply({ content: "Sorry, only the owner of the server can do this!", ephemeral: true })
        }*/
    },
};