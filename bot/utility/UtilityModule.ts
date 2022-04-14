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

/** Shuffle things around in an array */
async function shuffle(array: any) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
interface shuffle {
    /**
     * @returns array - shuffled array
     * @param array - normal array
     * */
    shuffle: (array: any) => any
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
    /** Shuffle things around in an array */
    this.shuffle = async(array: any) : Promise<shuffle> => {
        return await shuffle(array)
    }
}

module.exports.modules = Modules
