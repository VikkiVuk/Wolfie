const { MessageEmbed, MessageAttachment, MessageButton } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    name: 'guildMemberAdd',
	once: false,
	async execute(member, client) {
        const applyText = (canvas, text) => {
            const context = canvas.getContext('2d');
            let fontSize = 70;
        
            do {
                context.font = `${fontSize -= 10}px sans-serif`;
            } while (context.measureText(text).width > canvas.width - 300);
        
            return context.font;
        };
        const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');

		const background = await Canvas.loadImage(__dirname +'/background.jpg');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		context.strokeStyle = '#0099ff';
		context.strokeRect(0, 0, canvas.width, canvas.height);

		context.font = '28px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText('Dobrodosao/-la', canvas.width / 2.5, canvas.height / 3.5);

		context.font = applyText(canvas, `${member.user.username}!`);
		context.fillStyle = '#ffffff';
		context.fillText(`${member.user.username}!`, canvas.width / 2.5, canvas.height / 1.8);

		context.beginPath();
		context.arc(125, 125, 100, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();

		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
		context.drawImage(avatar, 25, 25, 200, 200);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

        const embed = new MessageEmbed()
        .setTitle("Dobar dan")
        .setDescription(`Zdravo <@${member.user.id}>, kako si? Hvala sto si usao, nadam se da ces lepo da se provedes ovde.`)
        .setTimestamp()
        .setFooter("Greeting Bot")
        .setColor('#3483eb')

        member.guild.channels.cache.get('878774773247799297').send({ files: [attachment], embeds: [embed] })
    }
}