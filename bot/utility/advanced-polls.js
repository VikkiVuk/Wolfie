let channels = ["1001155291620053112", "1001156012297945108", "889538860604874796"]

module.exports = (client) => {
    client.on('messageCreate', (msg) => {
        if (channels.some(c => c === msg.channel.id)) {
            const { content } = msg
            const eachLine = content.split('\n')

            for (const line of eachLine) {
                if (line.includes('=')) {
                    const split = line.split('=')
                    const emoji = split[0].trim()
                    msg.react(emoji)
                }
            }
        }
    })
}