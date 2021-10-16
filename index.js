const { Client, Collection } = require('discord.js');
const TempChannels = require('discord-temp-channels')
const fs = require('fs');
const client = new Client({ intents: 32767, presence: { status: "idle", afk: false, activities: [{ name: "you", type: "LISTENING" }] } })
const config = require('./config.json')
const tempchnls = new TempChannels(client)
const mongo = require('./utility/mongo.js')
const advancedPolls = require('./utility/advanced-polls.js');
const selfRole = require('./utility/self-role.js')
const express = require("express");
const exp = require('constants');
const app = express();

app.get("/", function(req, res) {
	res.send('<p> Hi! </p>');
})

app.post("/send", function(req, res) {
	try {
		const { apikey, fnc, args } = req.body;
		if (apikey == "vikkivuk-wolfie"){
			if (fnc == "roblox-verif") {
				res.statusCode(1)
			} else {
				res.statusCode(404)
			}
		} else {
			res.statusCode(403)
		}
	} catch {
		res.statusCode(404)
	}
})

app.listen(process.env.PORT);

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
	selfRole(client)

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