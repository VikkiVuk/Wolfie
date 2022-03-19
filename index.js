require("./web/strategies/discord")
require('./bot/utility/mongo.js')().then(() => console.log(">>> Connected to mongo."))
const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 32767, presence: { status: "idle", afk: false, activities: [{ name: "english", type: "LISTENING" }] } })
const fs = require('fs');const config = require('./bot/config.json');const express = require("express");const app = express();const passport = require("passport");const session = require("express-session");const Store = require('connect-mongo');

app.use(express.json());app.use(express.urlencoded({ extended: false }));app.use(session({secret: "our_little_secret~.122hhzhC898978dDNmmMU89", resave: false, saveUninitialized: false, cookie: { maxAge: 60000 * 60 * 24 }, store: new Store({ mongoUrl: config.mongoPath })}))
app.use(passport.initialize({}));app.use(passport.session({}));app.use(express.static(__dirname + "/web/routes/root/construction"));

app.use("/auth", require("./web/routes/root/auth.js"));app.use("/api", require("./web/routes/api/main.js"))
app.use("/", (req, res) => {
	res.sendFile(__dirname + "/web/routes/root/construction/page.html")
})

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
			await realguild.members.cache.get(realguild.ownerId).send({content: "Your guild is now in our database."}).catch(err => {
				// user has closed dms or has blocked the bot
			})
		}
	}
})

client.on('guildCreate', (guild) => {
	require("./bot/utility/backend").joinedGuild(guild)
	guild.members.cache.get(guild.ownerId).send({ content: "Hey! Thanks for adding me, I hope I will be of use to you. \n \nCurrently you cannot configure me. We are working and expanding constantly, and you will be able to configure me soon."}).catch(err => {
		// cannot send message, owner has dms closed.
	})
})

client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		try { await command.execute(interaction, client); } catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An error has occured, if this continues happening please contact us at support@vikkivuk.xyz', ephemeral: true }).catch(async() => { await interaction.editReply({ content: 'Doslo je do greske, vise detalja je poslato korisniku **NotVikki**.', ephemeral: true }) })
		}
	}
});

require('http').createServer(app).listen(process.env.PORT || 4000)
client.login(config.token).then(r => { console.log(">>> Bot Logged In.") })