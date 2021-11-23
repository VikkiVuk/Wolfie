const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./bot/config.json');
const fs = require('fs');

// Commands
const commands = [];
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
const ctxfiles = fs.readdirSync('./bot/context-menus').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '880049472246284328';
const guildId = '878606227045756948';

for (const file of commandFiles) {
    const command = require(`./bot/commands/${file}`);
    commands.push(command.data.toJSON());
}

for (const file of ctxfiles) {
    const ctxmenu = require(`./bot/context-menus/${file}`);
    commands.push(ctxmenu.data);
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
