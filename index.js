const { Client, Collection, MessageEmbed } = require('discord.js');
const TempChannels = require('discord-temp-channels')
const fs = require('fs');
const client = new Client({ intents: 32767, presence: { status: "idle", afk: false, activities: [{ name: "you", type: "LISTENING" }] } })
const config = require('./config.json')
const tempchnls = new TempChannels(client)
const mongo = require('./utility/mongo.js')
const advancedPolls = require('./utility/advanced-polls.js');
const selfRole = require('./utility/self-role.js')
const express = require("express");
const app = express();
const bp = require('body-parser')
const Trello = require('trello');
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.json());

app.get("/", function(req, res) {
	res.send('Hello, please use one of our functions and also please get an api key to actually be able to access our bot. Also go to <a href="https://discord-wolfie.herokuapp.com/suggest">/suggest</a> to suggest features.');
})

app.get("/suggest", function(req, res) {
	res.sendFile(__dirname + "/.sitefiles/suggest.html")
})

app.get("/admin-apply", function(req, res) {
	res.sendFile(__dirname + "/.sitefiles/admin-apply.html")
})

app.post("/send_suggest", function(req, res) {
	const { email, discord_tag, suggestion, attachements, tos_agree } = req.body
	trello.addCard("Preporuka od " + discord_tag + ". Vise informacija u deskripciji", `
		Email: ${email},
		Discord Tag: ${discord_tag},

		Preporuka: ${suggestion}
	`, '6113904f6f163a7d919d2481', function(error, card) {
		if (error) {
			res.send("Doslo je do greske i tvoja preporuka nije poslata.")
		} else {
			res.send("Uspesno si preporucio nesto za wolfie!")
		}
	})
})

app.post("/send_adminapply", function(req, res) {
	const { readrules_agree, answeredhonestly_agree, change_agree, tos_agree, rulebreak_agree } = req.body
	if (readrules_agree && answeredhonestly_agree && change_agree && tos_agree && rulebreak_agree) {
		const answers = JSON.parse(JSON.stringify(req.body));
		const user = client.users.cache.find(u => u.tag === req.body.discord_tag)

		if (user) {
			const embed = new MessageEmbed().setTitle(`${user.tag} admin apply`).setDescription(`Ovo je poslato s stranice discord bota, korisnik tvrdi da je: <@${user.id}>. Ovde su njegovi odgovori.`).setFooter(config.defaultFooter).setTimestamp().setColor("RED")
			let htmltext = ""

			for (const question in answers) {
				embed.addField(question, answers[question])
				htmltext += `${question}: ${answers[question]}<br>`
			}

			const appchannel = client.guilds.cache.get('878606227045756948').channels.cache.get('881923593452281896')

			appchannel.send({ embeds: [embed] })

			res.send(`Hvala sto si se prijavio za admina! Neko iz naseg apply tima ce uskoro da ti pregleda prijavu. Dole imas detalje sta je poslato nasem osoblju. <br> <br> ${htmltext}`)
		} else {
			res.send("Nisam mogao da te nadjem u discord serveru, da li si uneo svoj tacan discord tag?")
		}
	} else {
		res.send("Molim te prihvati sve ili neces moci da se prijavis.")
	}
})

app.post("/send", function(req, res) {
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
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) { const command = require(`./commands/${file}`); client.commands.set(command.data.name, command); }

client.ctxmenus = new Collection();
const ctxFiles = fs.readdirSync('./context-menus').filter(file => file.endsWith('.js'));

for (const file of ctxFiles) { const ctxmenu = require(`./context-menus/${file}`); client.ctxmenus.set(ctxmenu.data.name, ctxmenu); }

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) { const event = require(`./events/${file}`); if (event.once) { client.once(event.name, (...args) => event.execute(...args, client)); } else { client.on(event.name, (...args) => event.execute(...args, client)) }}

tempchnls.registerChannel("888127847414243349", {
	childCategory: "888127800073142353",
	childAutoDeleteIfEmpty: true,
	childMaxUsers: 10,
	childFormat: (member, count) => `#${count} | ${member.user.username}`
});

client.once('ready', async () => {
    console.log(">>> I'm all good already so moved on im steady- Im just where you left me. Im online. Actually idle but ok.")

	await mongo().then(() => console.log(">>> Connected to mongo."))

	advancedPolls(client)
	await selfRole(client)
	await require('./utility/support')(client)

	//------------------------------------------------------------------------------------------------------------------------------------------------------------------\\
	const command1 = await client.guilds.cache.get('878606227045756948').commands.fetch('896024079499427890');
	const permissions = [{ id: '878606227045756948', type: 'ROLE', permission: false }, { id: '895753436941942795', type: 'ROLE', permission: true }]
	await command1.permissions.add({ permissions });
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