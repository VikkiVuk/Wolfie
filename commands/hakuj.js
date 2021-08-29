const { MessageEmbed,MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hakuj')
        .setDescription('Hakujte nekog.')
        .addUserOption(option => option.setName('korisnik').setDescription('Koga zelite da hakujete').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('korisnik')

        try {
            const waiting = new MessageEmbed()
                .setTitle('HAKOVANJE U TOKU')
                .setDescription('Trenutno pokusavam da hakujem <@' + user.id + '>...')
                .setTimestamp()
                .setFooter('Hackbot 9000')
                .setColor('#804AFF')

            await interaction.reply({embeds: [waiting]});
            setTimeout(async () => {
                const responses = [
                    new MessageEmbed().setTitle('PRISTUP DOZVOLJEN').setDescription(`Cestitam! Ovo totalno pravo hakovanje <@${user.id}> je uspelo! Dobio si malo novca, dok je <@${user.id}> izgubio istu kolicinu novca.`).setTimestamp().setFooter('Hackbot 9000').setColor('#0FFF0F'),
                    new MessageEmbed().setTitle('PRISTUP ODBIJEN').setDescription(`Izvini! Izgleda kao da je <@${user.id}> imao antivirus. Vise srece sledeci put.`).setTimestamp().setFooter('Hackbot 9000').setColor('#FF0000')
                ];

                const response = responses[Math.floor(Math.random() * responses.length)];
                await interaction.editReply({embeds: [response]})
            }, Math.floor(Math.random() * (160 - 30) + 60) * 160);
        } catch (error) {
            return
        }
    },
};