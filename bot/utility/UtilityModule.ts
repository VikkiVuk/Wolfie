const addReactions = (message, reactions) => {
    message.react(reactions[0]).catch(e => {
        return
    })
    reactions.shift()
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750)
    }
}

/**
 * Send a first message in a channel as the bot.
 * @param client
 * @param id
 * @param text
 * @param reactions
 */
function firstMessage(client: any, id: string, text: string, reactions = []): void {
    this.send = async(client: any, id: string, text: string, reactions = []) => {
        const channel = await client.channels.fetch(id)

        channel.messages.fetch().then((messages) => {
            if (messages.size === 0) {
                channel.send(text).then((message) => {
                    addReactions(message, reactions)
                })
            } else {
                for (const message of messages) {
                    message[1].edit(text)
                    addReactions(message[1], reactions)
                }
            }
        })
    }
}

interface firstMessage {
    /**
     * Get the first message module
     * @param client
     * @param id
     * @param text
     * @param reactions
     */
    firstMessage: (client: any, id: string, text: string, reactions: any) => void
}

function Modules() {
    /**
     * Get the first message module
     * @param client
     * @param id
     * @param text
     * @param reactions
     */
    this.firstMessage = async(client: any, id: string, text: string, reactions = []): Promise<firstMessage> => {
        return new firstMessage(client, id, text, reactions)
    }
}

module.exports.modules = Modules