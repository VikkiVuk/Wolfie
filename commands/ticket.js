const { MessageEmbed, MessageAttachment, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { DefaultUserAgent } = require('@discordjs/rest');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Zatvori i otvori ticket.')
        .addSubcommand(subcommand => subcommand.setName('otvori').setDescription('Ovako mozes da otvoris ticket.'))
        .addSubcommand(subcommand => subcommand.setName('zatvori').setDescription('Ovako zatvori ticket.')),

    async execute(interaction) {
        await interaction.deferReply()
        const subcommand = interaction.options.getSubcommand()

        if (subcommand === "otvori") {
            if(interaction.guild.channels.cache.some(channel => channel.name === `ticket-${interaction.user.id}`)) {
                await interaction.editReply({ content: `Izvini, vec imas otvoren ticket, molim te ga zatvori pre nego sto nastavis.`, ephemeral: true })
                return
            }

            const user = interaction.user
            const guild = interaction.guild

            guild.channels.create(`ticket-${user.id}`, {
                type: "GUILD_TEXT"
            }).then(async (channel) => {
                await channel.setParent('878606227414868033');
                await wait(1000)

                await channel.permissionOverwrites.create(guild.id, {VIEW_CHANNEL: false});
                await channel.permissionOverwrites.create(user.id, {VIEW_CHANNEL: true});

                await channel.send(`Zdravo! Korisnik <@${user.id}> je otvorio ovaj support ticket.`)

                await interaction.editReply({ content: `Ok, otvorio sam ti ticket.` })
            }).catch(console.error);
        } else if (subcommand === "zatvori") {
            if (interaction.member.roles.cache.has('878606227058335828')) {
                if (interaction.channel.name.includes(`ticket-`)) {
                    await interaction.editReply({ content: 'Ok, ovaj ticket ce se zatvoriti u roku od 5 sekundi.' })
                    await wait(5000)
                    interaction.channel.delete()
                } else {
                    await interaction.editReply({ content: 'Molim te koristi ovu komandu u ticket channelu.'})
                }
            } else {
                if (interaction.channel.name.includes(interaction.user.id)) {
                    await interaction.editReply({ content: 'Ok, ovaj ticket ce se zatvoriti u roku od 5 sekundi.' })
                    await wait(5000)
                    interaction.channel.delete()
                } else {
                    await interaction.editReply({ content: 'Molim te koristi ovu komandu u tvom ticket channelu a ne u bot komande ili u dm.'})
                }
            }
        }
    },
};