import fetch from 'node-fetch'
const userschema = require('./schemas/user-schema')
const guildschema = require('./schemas/guild-schema')
const Stream = require('stream')
const qrcode = require('qrcode')
const config = require('../config.json')

interface UserObject {
    /**
     * Modify user's data using key and value pairs. Specify what function you want to do: ADD (+), REMOVE (-), SET (=)
     * @param key - What part of the user's data do you want to change?
     * @param value - What do you want to change it to?
     * @param operation - What do you want to do with the value?
     * @returns nothing
     */
    modify: (key: string, value: any, operation?: string) => Promise<void>,
    /**
     * Get the user's data
     * @param key - What value do you want to get?
     * @returns any - Returns the value
     */
    getkey: (key: string) => Promise<void>,
    /**
     * Check if the user has 2fa enabled.
     * @returns boolean
     */
    has2fa: () => Promise<boolean>,
    /**
     * Validate a users authenticity for more secure interactions.
     * @param token - The code from the authenticator app
     * @returns boolean
     */
    validate2fa: (token: number) => Promise<boolean>,
    /**
     * @deprecated Warn someone for misbehaving in a server or something like that. Warns are per-guild, bots cannot be warned. Warns the user in the guild the user object was requested.
     */
    warn: () => Promise<void>,
    /**
     * Check how many days have passed since the last time the user has claimed the daily reward.
     * @returns number - How many days have passed since the last daily reward.
     */
    checkDaily: () => Promise<number>,
    /**
     * Add an item to a users inventory.
     * @param itemname - The name of the item
     * @param amnt - How many do you want to give?
     */
    addItem: (itemname: string, amnt: number) => Promise<void>,
    /**
     * Remove an item from a users inventory.
     * @param itemname - The name of the item
     * @param amnt - How many do you want to remove?
     */
    removeItem: (itemname: string, amnt: number) => Promise<void>,
    /**
     * Check if a user has a specific item in their inventory. Subject to deprecation.
     * @param itemname - The name of the item you want to check
     * @returns boolean - If the item is in the inventory.
     */
    findItem: (itemname: string) => Promise<void>
}

function UserObject(res: any, guildId?: any, discorduser?: any) {
    this.modify = async(key: string, value: any, operation?: string) : Promise<void> => {
        const updatedresult = await userschema.findOne({ userid: res.userid })
        const obj = JSON.parse(updatedresult.userdata)

        if (key == "warns") {
            const guildobj = JSON.parse(updatedresult.guilds)
            if (guildobj[this.guildId]["warns"]) {
                guildobj[this.guildId]["warns"] += 1
            } else {
                guildobj[this.guildId]["warns"] = 1
            }
            await userschema.updateOne({ userid: res.userid }, { guilds: JSON.stringify(guildobj) })
        } else if(key == "inventory" || key == "messages") {
            throw new Error("The function user.modify does not support modifying the inventory or the messages. Use users.sendMail and user.addItem/removeItem instead.")
        } else if (key == "xp" || key == "money" || key == "level"){
            if (operation == "ADD") {
                obj[key] += value
            } else if (operation == "REMOVE") {
                obj[key] -= value
            } else if(operation == "SET"){
                obj[key] = value
            }
        } else if (key == "note") {
            obj["note"] = value
        } else if (key == "daily") {
            obj["daily"] = value
        }

        await userschema.updateOne({ userid: res.userid }, { userdata: JSON.stringify(obj) })
    }

    this.getkey = async(key: string): Promise<any> => {
        const updatedresult = await userschema.findOne({ userid: res.userid })
        const obj = JSON.parse(updatedresult.userdata)

        if (key == "warns") {
            const guildobj = JSON.parse(updatedresult.guilds)

            for (const d of guildobj[guildId]) {
                if (d[0] == "warns") {
                    return d[1]
                }
            }
        } else {
            return obj[key]
        }
    }

    this.has2fa = async(): Promise<boolean> => {
        let api = "https://2fa.vikkivuk.xyz/has2FA?uuid=" + res.authid
        let response = await fetch(api, {method:'GET',redirect:'follow'})
        let content = await response.json()
        return content["has2FA"]
    }

    this.validate2fa = async(token: string): Promise<boolean> => {
        try {
            let api = "https://2fa.vikkivuk.xyz/check"
            let response = await fetch(api, {method:"POST", redirect:'follow',body:'{"customid":"' + discorduser.username + '(' + discorduser.id + ')' + ',"code":"' + token + '"}'})
            let content = await response.json()
            return content["validated"]
        } catch (err) {
            console.error(err)
            return false
        }
    }

    this.warn = async(): Promise<void> => {
        const result = await userschema.findOne({ userid: res.userid })
        if (result) {
            const updatedresult = await userschema.findOne({ userid: res.userid })
            const guildobj = JSON.parse(updatedresult.guilds)

            if (guildobj[this.guildId]["warns"]) {
                guildobj[this.guildId]["warns"] += 1
            } else {
                guildobj[this.guildId]["warns"] = 1
            }

            await userschema.updateOne({ userid: res.userid }, { guilds: JSON.stringify(guildobj) })
        }
    }

    this.checkDaily = async(): Promise<number> => {
        const updatedresult = await userschema.findOne({ userid: res.userid })
        if (updatedresult) {
            const obj = JSON.parse(updatedresult.userdata)
            const then = new Date(obj.daily).getTime()
            const now = new Date().getTime()

            const diffTime = Math.abs(now - then)
            return Math.round(diffTime / (1000 * 60 * 60 * 24))
        }
    }

    this.addItem = async(itemname: string, amnt: number) : Promise<void> => {
        const updatedresult = await userschema.findOne({ userid: res.userid })
        if (updatedresult) {
            const items = JSON.parse(updatedresult.userdata)

            let hasItem = false
            for (const item of items.inventory) {
                if (item["name"] == itemname) {
                    hasItem = true
                }
            }

            if (hasItem) {
                for (const item of items.inventory) {
                    if (item["name"] == itemname) {
                        item["amount"] += 1
                    }
                }
            } else {
                items.inventory.push({
                    name: itemname,
                    amount: amnt
                })
            }

            await userschema.updateOne({ userid: res.userid }, { userdata: JSON.stringify(items) })
        }
    }

    this.removeItem = async(itemname: string, amnt: number) => {
        const updatedresult = await userschema.findOne({ userid: res.userid })
        if (updatedresult) {
            const items = JSON.parse(updatedresult.userdata)

            let hasItem = false
            for (const item of items.inventory) {
                if (item["name"] == itemname) {
                    hasItem = true
                }
            }

            if (hasItem) {
                for (const item of items.inventory) {
                    if (item["name"] == itemname) {
                        if (item["amount"] <= 1) {
                            const index = items.inventory.indexOf(item)
                            items.inventory.splice(index, index)
                        } else {
                            item["amount"] -= 1
                        }
                    }
                }
            } else {
                return 4
            }

            await userschema.updateOne({ userid: res.userid }, { userdata: JSON.stringify(items) })
        }
    }

    this.findItem = async(itemname: string) => {
        const result = await userschema.findOne({ userid: res.userid })
        if (result) {
            const items = JSON.parse(result.userdata)

            let hasItem = false
            for (const item of items.inventory) {
                if (item["name"] == itemname) {
                    hasItem = true
                }
            }

            return hasItem
        }
    }
}

export class UserModule {
    constructor() {
    }
    /**
     * Get a user that you can do functions on
     * @param userid - The id of the user you want to get
     * @param guildid - The guild id, used for warning and other guild-side stuff.
     * @returns UserObject - A user object that you can do functions on.
     */
    public getUser = async (userid: string, guildid?: string, discorduser?: any): Promise<UserObject> => {
        const result = await userschema.findOne({ userid: userid })
        if (result) {
            return new UserObject(result, guildid, discorduser)
        } else {
            let user = await new userschema({ userid: userid, uuid: "", userdata: JSON.stringify({ money: 100, xp: 0, level: 1, inventory: [], note: "", messages: [], daily: 0 }), guilds: "{}" }).save()
            return new UserObject(user, guildid, discorduser)
        }
    }

    /**
     * Get a user 2FA Auth qr code that they need to scan and register them. Use verify2FA to verify the user and complete the 2FA Setup.
     * @param user - A discord user, not an id, a whole user.
     * @returns any - It can return the user object with the qr code needed to be scanned, or it can return the error.
     */
    public setup2fa = async(user: any) => {
        const aa = await userschema.findOne({userid: user.id})
        if (aa.authid === "" || !aa.authid) {
            try {
                let api = "https://2fa.vikkivuk.xyz/create"
                let response = await fetch(api, { method: 'POST', redirect: 'follow', body: '{"customid":"' + user.username + '(' + user.id + ')' + ',"servicename":"Wolfie"}' })
                let content = await response.json()
                /*
                    body example:
                    {
                      "customid": "user-1233c533/VikkiVuk",
                      "id": "0a1806d6-2824-4a92-86b9-5907a5cffa16",
                      "secret": {
                        "ascii": "7$CSE5;4.#n^tTPAlw<:rO%J0Hn]Ka0F",
                        "hex": "3724435345353b342e236e5e745450416c773c3a724f254a30486e5d4b613046",
                        "base32": "G4SEGU2FGU5TILRDNZPHIVCQIFWHOPB2OJHSKSRQJBXF2S3BGBDA",
                        "otpauth_url": "otpauth://totp/VikkiVuk%20LLC%3A%20user-1233c533%2FVikkiVuk?secret=G4SEGU2FGU5TILRDNZPHIVCQIFWHOPB2OJHSKSRQJBXF2S3BGBDA"
                      },
                      "drcode": "string"
                      "code": 200
                    }
                 */

                await userschema.updateOne({ userid: user.id }, { authid: content["id"] })

                // @ts-ignore
                async function createStream() {
                    const stream = new Stream.Transform({
                        transform(chunk, encoding, callback) {
                            this.push(chunk)
                            callback()
                        }
                    })
                    await qrcode.toFileStream(stream, content["otpauth_url"])
                    return stream
                }
                let scan = await createStream()

                return { userid: content["id"], temp_secret: content["secret"]["base32"], qrcode: scan }
            } catch (err) {
                console.log(err)
                return {}
            }
        } else {
            return "ALREADY_REGISTERED"
        }
    }

    /**
     * Complete the 2fa setup with this
     * @param user - A discord user
     * @param token - The code
     * @returns boolean - Returns if the user is verified now or not
     */
    public verify2fa = async(user: any, token: string) => {
        try {
            let api = "https://2fa.vikkivuk.xyz/confirm"
            let response = await fetch(api, { method: 'POST', redirect: 'follow', body: '{"customid":"' + user.username + '(' + user.id + ')' + ',"code":"' + token + '"}'})
            let content = await response.json()

            return content["verified"]
        } catch (err) {
            console.log(err);
            return "ERROR"
        }
    }

    /**
     * Send a user a message!
     * @param receiver - The id of the message receiver
     * @param sender - The id of the message sender
     * @param message - The message content
     * @returns null
     */
    public sendMail = async(receiver: number, sender: number, message: string) => {
        const result = await userschema.findOne({ userid: receiver })

        if (result) {
            const obj = JSON.parse(result.userdata)
            obj["messages"].push({sender:sender, content:message})
            console.log(JSON.stringify(obj))

            await userschema.updateOne({ userid: receiver }, { userdata: JSON.stringify(obj) })
        }
    }
}

export class GuildConfigurations {
    /**
     * Get the guild configuration in a javascript array
     * @param guildId - The id of the guild you want to get the configuration of
     * @returns configuration - The guild config
     */
    public configuration = async(guildId: string) => {
        const result = await guildschema.findOne({ guildId: guildId })
        if (result) { return JSON.parse(result.config) } else {
            let ec = await new guildschema({ guildId: guildId, config: "{}", customitems: "{}", commandsOn: [], commandOptions: [] })
            return JSON.parse("{}")
        }
    }

    /**
     * @deprecated Modify the guild data. (currently doesnt work)
     * @param guildId - The id of the guild you want to modify
     * @param name - The name of the key you want to modify
     * @param value - The value you want to set the key
     * @returns null
     */
    public modify = async(guildId: string, name: string, value: any) => {
        // for now this is nothing.
    }

    /**
     * Get the items from a guild, this will return all custom items added to the guild along with the default ones.
     * @param guildId - The id of the guild you want to get the items from
     * @constructor
     * @returns object - The guild items in a javascript object.
     */
    public GetGuildItems = async(guildId: string) => {
        const result = await guildschema.findOne({ guildId: guildId })
        if (result) {
            return {
                ...JSON.parse(result.customitems),
                ...config.shopItems
            }
        } else {
            return {}
        }
    }

    /**
     * Create a custom guild item.
     * @param guildId - The id of the guild you want to create the item in
     * @param itemname - Item name
     * @param itemcost - Item price
     * @constructor
     * @returns array - Either returns an array or an object, if success: Object, if error: []
     */
    public CreateGuildItem = async(guildId: string, itemname: string, itemcost: number) => {
        const result = await guildschema.findOne()
        if (result.customitems) {
            const jsonobj = JSON.parse(result.customitems)
            jsonobj[itemname] = itemcost
            await guildschema.updateOne({ guildId: guildId }, { customitems: JSON.stringify(jsonobj) })

            return jsonobj
        } else {
            return []
        }
    }
}
