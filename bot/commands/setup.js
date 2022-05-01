const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require("discord.js")
const BotModule = require("../utility/BotModule")
const configHand = new BotModule.GuildConfigurations()
const handler = new BotModule.UserModule()
const wait = require("util").promisify(setTimeout)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Only the owner of the guild can change the guild config.')
        .addRoleOption(ro => ro.setName("lock-role").setDescription("The role used in /channel-lock. Defaults to everyone and member role.").setRequired(true))
        .addBooleanOption(opt => opt.setName("filter-enabled").setDescription("Should messages be checked and deleted if they contain NSFW words.").setRequired(true))
        .addRoleOption(ro => ro.setName("member-role").setDescription("The role that will be given to users when they use /verify.").setRequired(false))
        .addChannelOption(opt => opt.setRequired(false).setName("greeting-channel").setDescription("A place where the bot will greet people, leave this blank if you dont want the bot to greet people."))
        .addRoleOption(opt => opt.setName("botmaster1").setDescription("A bot master, the role that will be given access to any command.").setRequired(false))
        .addRoleOption(opt => opt.setName("botmaster2").setDescription("A bot master, the role that will be given access to any command.").setRequired(false))
        .addRoleOption(opt => opt.setName("botmaster3").setDescription("A bot master, the role that will be given access to any command.").setRequired(false))
        .addRoleOption(opt => opt.setName("botmaster4").setDescription("A bot master, the role that will be given access to any command.").setRequired(false))
        .addRoleOption(opt => opt.setName("botmaster5").setDescription("A bot master, the role that will be given access to any command.").setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        if (interaction.member.user.id === interaction.guild.ownerId || interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await wait(2000)

            let lockrole = interaction.options.getRole("lock-role")
            let filterEnabled = interaction.options.getBoolean("filter-enabled")
            await configHand.modify(`${interaction.guild.id}`, "lockrole", lockrole.id)
            await configHand.modify(`${interaction.guild.id}`, "filterEnabled", filterEnabled)

            let memberRole = interaction.options.getRole("member-role")
            let greetingChannel = interaction.options.getChannel("greeting-channel")
            if (memberRole) { await configHand.modify(`${interaction.guild.id}`, "verifiedRole", memberRole.id) }
            if (greetingChannel) { await configHand.modify(`${interaction.guild.id}`, "greetingChannel", greetingChannel.id) }

            let botmasters = []
            if (interaction.options.getRole("botmaster1")) {
                botmasters.push(interaction.options.getRole("botmaster1").id)
            }

            if (interaction.options.getRole("botmaster2")) {
                botmasters.push(interaction.options.getRole("botmaster2").id)
            }

            if (interaction.options.getRole("botmaster3")) {
                botmasters.push(interaction.options.getRole("botmaster3").id)
            }

            if (interaction.options.getRole("botmaster4")) {
                botmasters.push(interaction.options.getRole("botmaster4").id)
            }

            if (interaction.options.getRole("botmaster5")) {
                botmasters.push(interaction.options.getRole("botmaster5").id)
            }

            await configHand.modify(`${interaction.guild.id}`, "botmasters", botmasters)

            const embed = new MessageEmbed().setTitle("Guild Setup").setDescription("You have successfully updated your guild configuration! You can now enjoy the bot's features.")
            await interaction.editReply({ embeds: [embed] })
        } else {
            await interaction.editReply({ content: "Sorry, only the owner and administrators of the server can do this!", ephemeral: true })
        }
    },
};