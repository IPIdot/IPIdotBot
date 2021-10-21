const fs = require('fs');
const { DateTime, Interval, Settings: LuxonSettings } = require("luxon");
LuxonSettings.defaultZone = 'utc';
const { Client, Intents, Collection } = require('discord.js');
const { BOT_TOKEN } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});
/*
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
*/
client.login(BOT_TOKEN);

// TODO : enregistrer une liste d'utilisateur ?
// TODO : Crer un channel pour le bot ?
// TODO : Le bot repond a certain question de paertout en ephemeral
// TODO : ne pas renvoye un screen de l'edt mais plutot une version plus propre ?
// TODO : le chanell avec info general est tenu propre ? ( clean programmer )
// TODO : acces au lien teams uniquement de la semaine en cours ? ou commande paramétrable ?
// TODO : /lien : besoin de deferer
