require('./bot/utility/mongo.js')().then(() => console.log(">>> Connected to mongo."))
const { Client, Collection, MessageEmbed} = require('discord.js');
const client = new Client({ intents: 32767, presence: { status: "idle", afk: false, activities: [{ name: "english", type: "LISTENING" }] } })
const fs = require('fs');const config = require('./bot/config.json');const express = require("express");const app = express();
const Trello = require("trello")
const trello = new Trello(config.trello_appkey, config.trello_token);

app.use(express.json());app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/web/routes/root/construction"));

app.use("/api", require("./web/routes/api/main.js"))
app.use("/", (req, res) => {res.sendFile(__dirname + "/web/routes/root/construction/page.html")})

client.commands = new Collection();
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) { const command = require(`./bot/commands/${file}`); client.commands.set(command.data.name, command); }

const eventFiles = fs.readdirSync('./bot/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) { const event = require(`./bot/events/${file}`); if (event.once) { client.once(event.name, (...args) => event.execute(...args, client)); } else { client.on(event.name, (...args) => event.execute(...args, client)) }}

client.once('ready', async () => {
    console.log(">>> Bot is online.")

	await require("./bot/utility/advanced-polls")(client)
	await require("./bot/utility/self-role")(client)
	await require('./bot/utility/support')(client)
	await require('./bot/utility/backend').saveClient(client)

	console.log(">>> Registered Modules")
	const guilds = await client.guilds.fetch()
	for (const guild of guilds) {
		const realguild = client.guilds.cache.get(guild[0])
		const backend = require("./bot/utility/backend")
		const exists = await backend.getGuildOptions(realguild.id)

		if (exists == null) {
			await require("./bot/utility/backend").joinedGuild(realguild)
			await realguild.members.cache.get(realguild.ownerId).send({content: "Your guild is now in our database."}).catch(err => {})
		}
	}
})

client.on('guildCreate', (guild) => {
	require("./bot/utility/backend").joinedGuild(guild)
	guild.members.cache.get(guild.ownerId).send({ content: "Hey! Thanks for adding me, I hope I will be of use to you. \n \nCurrently you cannot configure me. We are working and expanding constantly, and you will be able to configure me soon."}).catch(err => {})
})

client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		try { await command.execute(interaction, client); } catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An error has occured, if this continues happening please contact us at support@vikkivuk.xyz', ephemeral: true }).catch(async() => { await interaction.editReply({ content: 'An error has occured, if this continues happening please contact us at support@vikkivuk.xyz', ephemeral: true }) })
		}
	} else if (interaction.isModalSubmit()) {
		if (interaction.customId == "suggestion") {
			let name = interaction.fields.getTextInputValue("name")
			let type = interaction.fields.getTextInputValue("type")
			let inquiry = interaction.fields.getTextInputValue("request")
			if(type == "PChaos") {
				await trello.addCard("Open for more information", `Submitted by: ${name} @ ${interaction.user.tag} (${interaction.user.id})\nType: ${type}\nInquiry:\n ${inquiry}`, "62e7cd5433c2f25494837451", function (error, trelloCard) {
					if (error) {
						console.log(error)
						interaction.reply({embeds: [new MessageEmbed().setTitle("Error").setDescription("Your suggestion could not be sent for review, please try again later.").setColor("RED").setTimestamp().setFooter({text: config.defaultFooter})]})
					} else {
						interaction.reply({embeds: [new MessageEmbed().setTitle("Suggestion").setDescription("Your request has been forwarded to Pure Chaos - Developer Team, please do not expect any follow ups, though your suggestion will be reviewed and processed.").setColor("BLURPLE").setTimestamp().setFooter({text: config.defaultFooter})]})
					}
				})
			} else {
				await trello.addCard(type, `Submitted by: ${name} @ ${interaction.user.tag} (${interaction.user.id})\nType: ${type}\nInquiry:\n ${inquiry}`, "628d2482d4f95b6b4c48f468", function (error, trelloCard) {
					if (error) {
						console.log(error)
						interaction.reply({embeds: [new MessageEmbed().setTitle("Error").setDescription("Your suggestion could not be sent for review, please try again later.").setColor("RED").setTimestamp().setFooter({text: config.defaultFooter})]})
					} else {
						interaction.reply({embeds: [new MessageEmbed().setTitle("Suggestion").setDescription("Your request has been forwarded to our team, please do not expect any follow ups, though your suggestion will be reviewed and processed.").setColor("BLURPLE").setTimestamp().setFooter({text: config.defaultFooter})]})
					}
				})
			}
		}
	}
});

require('http').createServer(app).listen(process.env.PORT || 4000)
client.login(config.token).then(r => { console.log(">>> Bot Logged In.") })