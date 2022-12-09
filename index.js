//const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { BOT_TOKEN } = require('./config.json');
const { DB, DB_TEST_CONNEXION } = require("./globals.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

// Read /commands folder to instantiate our slash commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Initiate our stuff after bot process are ready
client.once('ready', () => {
	DB_TEST_CONNEXION();
	(async () => await DB.sync())();
	console.log(`Logged in as ${client.user.tag}!`);
});

// Get user interactions
// If it's registered slash cmd execute what slash command is suppose to do
// Else print an error
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login bot to provided Guild
client.login(BOT_TOKEN);
