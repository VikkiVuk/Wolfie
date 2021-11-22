const BotModule = require("./bot/utility/BotModule")
require("./web/strategies/discord")
require('./bot/utility/mongo.js')().then(() => console.log(">>> Connected to mongo."))
const { Client, Collection } = require('discord.js');
const TempChannels = require('discord-temp-channels')
const fs = require('fs');
const client = new Client({ intents: 32767, presence: { status: "idle", afk: false, activities: [{ name: "english", type: "LISTENING" }] } })
const config = require('./bot/config.json')
const tempchnls = new TempChannels(client)
const express = require("express");
const app = express();
const passport = require("passport")
const session = require("express-session")
const Store = require('connect-mongo')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(session({secret: "secret", resave: false, saveUninitialized: false, cookie: { maxAge: 60000 * 60 * 24 }, store: new Store({ mongoUrl: config.mongoPath, mongooseConnection: require('mongoose').connection })}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/main", require("./web/routes/root/main.js"))
app.use("/api", require("./web/routes/api/main.js"))
app.get("/", (req, res) => res.redirect(new URL(`http://${req.hostname}${(req.hostname == "localhost") ? ":4000" : ""}/main`)))
app.get("/sitemap", (req,res) => {
	res.download(__dirname + "/web/sitemap.txt")
})

require('http').createServer(app).listen(process.env.PORT || 80)
//require('https').createServer({key: fs.readFileSync('./web/ssl/vikkivuk.xyz.key', 'utf8'), cert: fs.readFileSync('./web/ssl/vikkivuk.xyz.cert', 'utf8')}, app).listen(process.env.PORT || 443);

client.commands = new Collection();
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) { const command = require(`./bot/commands/${file}`); client.commands.set(command.data.name, command); }

client.ctxmenus = new Collection();
const ctxFiles = fs.readdirSync('./bot/context-menus').filter(file => file.endsWith('.js'));

for (const file of ctxFiles) { const ctxmenu = require(`./bot/context-menus/${file}`); client.ctxmenus.set(ctxmenu.data.name, ctxmenu); }

const eventFiles = fs.readdirSync('./bot/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) { const event = require(`./bot/events/${file}`); if (event.once) { client.once(event.name, (...args) => event.execute(...args, client)); } else { client.on(event.name, (...args) => event.execute(...args, client)) }}

tempchnls.registerChannel("888127847414243349", {
	childCategory: "888127800073142353",
	childAutoDeleteIfEmpty: true,
	childMaxUsers: 10,
	childFormat: (member, count) => `#${count} | ${member.user.username}`
});

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
			await realguild.members.cache.get(realguild.ownerId).send({content: "Your guild is now in our database."})
			console.log("I have found a new guild!")
		}
	}
})

client.on('guildCreate', (guild) => {
	require("./bot/utility/backend").joinedGuild(guild)
	guild.members.cache.get(guild.ownerId).send({ content: "Woah! This new place looks awesome! \n \nTo configure me, type `/dashboard`"})
	console.log("Woah! This new place looks awesome!")
})

// Slash commands run
client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		try { await command.execute(interaction, client); } catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An error has occured, the developer of the bot has been sent more info.', ephemeral: true }).catch(async() => { await interaction.editReply({ content: 'Doslo je do greske, vise detalja je poslato korisniku **NotVikki**.', ephemeral: true }) })
		}
	} else if (interaction.isContextMenu()) {
		const ctxmenu = client.ctxmenus.get(interaction.commandName);
		if (!ctxmenu) return;
		try { await ctxmenu.execute(interaction, client); } catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An error has occured, the developer of the bot has been sent more info.', ephemeral: true }).catch(async() => { await interaction.editReply({ content: 'Doslo je do greske, vise detalja je poslato korisniku **NotVikki**.', ephemeral: true }) })
		}
	}
});

client.login(config.token).then(r => {
	console.log(">>> Bot Logged In.")
})