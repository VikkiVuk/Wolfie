const YouTubeNotifier = require('youtube-notification');
const config = require('../config.json')

module.exports = {
    name: 'ready',
	once: false,
	execute(client) {
        const notifier = new YouTubeNotifier({
            hubCallback: 'https://www.youtube.com/VikkiVuk',
            secret: 'VikkiVuk'
        });
        
        notifier.setup();

        notifier.on('notified', data => {
            client.guilds.cache.get('629728204780994590').channels.cache.get('687602259244089547').send(data)
            client.guilds.cache.get('629728204780994590').channels.cache.get('687602259244089547').send(`@everyone **${data.channel.name}** je upravio objavio novi video koji se zove: ${data.video.title}`)
        });
           
        notifier.subscribe(config.ytChannelId);
    },
}