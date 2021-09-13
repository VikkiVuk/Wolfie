const { Client, Collection, MessageEmbed } = require('discord.js');
const { REST } = require('@discordjs/rest');
const fs = require('fs');
const { Routes } = require('discord-api-types/v9');
const client = new Client({ intents: 32767, presence: { status: "idle", afk: false, activities: [{ name: "you", type: "LISTENING" }] } })
const config = require('./config.json')
const mongo = require('./utility/mongo.js')
const advancedPolls = require('./utility/advanced-polls.js');
const selfRole = require('./utility/self-role.js')

// Slash commands setup part 1
client.commands = new Collection();
const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) { const command = require(`./commands/${file}`); client.commands.set(command.data.name, command); commands.push(command.data.toJSON()); }

// Event files setup
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) { const event = require(`./events/${file}`); if (event.once) { client.once(event.name, (...args) => event.execute(...args, client)); } else { client.on(event.name, (...args) => event.execute(...args, client)) }}

client.once('ready', async () => {
	const rest = new REST({ version: '9' }).setToken(config.token);

	await rest.put(Routes.applicationGuildCommands('880049472246284328', '878606227045756948'), { body: commands });

    console.log(">>> I'm all good already so moved on im steady- Im just where you left me. Im online. Actually idle but ok.")

	await mongo().then(() => console.log(">>> Connected to mongo."))

	advancedPolls(client)
	selfRole(client)

	//------------------
	
	/*const command = await client.guilds.cache.get('878606227045756948').commands.fetch('887087334305189948');

	const permissions = [{
		id: '878606227045756948',
		type: 'ROLE',
		permission: false
	},
		{
			id: '878606227058335828',
			type: 'ROLE',
			permission: true
		}];
	
	await command.permissions.add({ permissions });*/
})

// Slash commands run
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Doslo je do greske, vise detalja je poslato <@533692905387196429>', ephemeral: true }).catch(async(err) => {
			await interaction.editReply({ content: 'Doslo je do greske, vise detalja je poslato <@533692905387196429>', ephemeral: true })
		})
	}
});

client.login(config.token)