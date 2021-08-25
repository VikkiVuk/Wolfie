module.exports = (client) => {
    client.on('messageCreate', (msg) => {
        if (msg.channel.id == "719162341991645184") {
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