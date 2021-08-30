module.exports = {
    name: 'messageCreate',
    once: false,
    async execute (message, client) {
        if (message.author.bot) return;

        if (message.channel.id === '881923593452281896') {
           const args = message.content.splice()
        }
    },
}