const { MessageEmbed,MessageActionRow,MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link-account')
        .setDescription('Link your account to continue enjoying Wolfies features.'),

    async execute(interaction) {
        const row = new MessageActionRow().setComponents(new MessageButton().setURL("https://wolfie.pro/api/accounts/link").setStyle("LINK").setLabel("Link your account"))
        const embed = new MessageEmbed()
            .setTitle("Link your account")
            .setDescription("We have made a new accounts system that our projects will utilize, starting with Wolfie. To make your FREE account please go to https://accounts.vikkivuk.xyz,")
            .addField("What do I get from linking?", "**You get +5000W$ and +100xp**, you can also delete your Wolfie account just from your vikkivuk account, and you can also request your data at any time from the vikkivuk account dashboard.")
            .addField("Do I have to link my account?", "**You don't have to link your account straightaway**, but it's highly recommended as Wolfie will soon **STOP** supporting the old account system, and Wolfie will annoy you whenever you use a command to link and migrate your account.")
            .addField("WHat happens after I link my account?", "**You will be prompted to migrate your account**, which you will have to, since as specified above, Wolfie **WILL STOP** supporting the old accounts system.")
            .addField("How do I migrate my account?", "After you link your account, you can either go to the vikkivuk accounts dashboard and migrate there, or you can type the command `/migrate`")
            .setColor("#fff200")
            .setFooter({text:"VikkiVuk LLC"})
        await interaction.reply({embeds:[embed], components: [row]});
    },
};