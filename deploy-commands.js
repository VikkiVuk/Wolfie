const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');
const fs = require('fs');

// Commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const ctxfiles = fs.readdirSync('./context-menus').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '880049472246284328';
const guildId = '878606227045756948';

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

for (const file of ctxfiles) {
    const ctxmenu = require(`./context-menus/${file}`);
    commands.push(ctxmenu.data);
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
