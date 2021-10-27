require("./web/strategies/discord")
require('./bot/utility/mongo.js')().then(() => console.log(">>> Connected to mongo."))
const { Client, Collection, MessageEmbed } = require('discord.js');
const TempChannels = require('discord-temp-channels')
const fs = require('fs');
const client = new Client({ intents: 32767, presence: { status: "idle", afk: false, activities: [{ name: "you", type: "LISTENING" }] } })
const config = require('./bot/config.json')
const tempchnls = new TempChannels(client)
const express = require("express");
const app = express();
const bp = require('body-parser')
const passport = require("passport")
const session = require("express-session")
const Store = require('connect-mongo')
const Trello = require('trello');
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.json());
app.use(session({secret: "secret", resave: false, saveUninitialized: false, cookie: { maxAge: 60000 * 60 * 24 }, store: new Store({ mongoUrl: config.mongoPath, mongooseConnection: require('mongoose').connection })}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/main", require("./web/routes/root/main.js"))
app.use("/api", require("./web/routes/api/main.js"))

app.post("/api/extdata", function(req, res) {
	try {
		if (req.body.apikey == "vikkivuk-wolfie"){
			if (req.body.fnc == "roblox-verif") {
				if (req.body.args) {
					const {discorduser, robloxuser, status} = req.body.args
					if (status == "completed") {
						const user = client.guilds.cache.get("878606227045756948").members.cache.find(m => m.id == discorduser)
						user.send("Ti si uspesno povezao tvoj discord nalog: **" + user.user.tag + "** sa roblox nalogom: https://www.roblox.com/users/" + robloxuser + "/profile")
						user.roles.add('895753436941942795')
						res.status(200).send("The user has been notified.")
					}
				} else {
					res.status(400).send("No args")
				}
			} else {
				res.status(400).send("Invalid Function")
			}
		} else {
			res.status(403).send("Invalid Apikey")
		}
	} catch(e) {
		console.error(e)
		res.status(400).send({
			"message": "An error has occured",
			"error": e
		})
	}
})

app.listen(process.env.PORT || 4000, function() {
	console.log("Api ready.")
})

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

	console.log(">>> Registered Modules")

	//------------------------------------------------------------------------------------------------------------------------------------------------------------------\\
	/*const command1 = await client.guilds.cache.get('878606227045756948').commands.fetch('896024079499427890');
	const permissions = [{ id: '878606227045756948', type: 'ROLE', permission: false }, { id: '895753436941942795', type: 'ROLE', permission: true }]
	await command1.permissions.add({ permissions });*/
})

// Slash commands run
client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		try { await command.execute(interaction, client); } catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Doslo je do greske, vise detalja je poslato korisniku **NotVikki**.', ephemeral: true }).catch(async() => { await interaction.editReply({ content: 'Doslo je do greske, vise detalja je poslato korisniku **NotVikki**.', ephemeral: true }) })
		}
	} else if (interaction.isContextMenu()) {
		const ctxmenu = client.ctxmenus.get(interaction.commandName);
		if (!ctxmenu) return;
		try { await ctxmenu.execute(interaction, client); } catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Doslo je do greske, vise detalja je poslato korisniku **NotVikki**.', ephemeral: true }).catch(async() => { await interaction.editReply({ content: 'Doslo je do greske, vise detalja je poslato korisniku **NotVikki**.', ephemeral: true }) })
		}
	}
});

client.login(config.token).then(r => {
	console.log(">>> Bot Logged In.")
})