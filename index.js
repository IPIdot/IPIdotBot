const fs = require('fs');
const got = require('got');
const { JSDOM } = require("jsdom");
const { Client, Intents, Collection } = require('discord.js');
const { BOT_TOKEN } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

/*
class Schedule {

	constructor() {

	}

	get_day(slashed_date) {
		// slashed_date 31/10/2021
		console.log("test");
	}
}

class ScheduleDay {
	constructor(_tcjour, _leftIndice) {
		this.m_day = this.tcjour_toDate(_tcjour);
		this.m_leftIndice = _leftIndice;
	}

	tcjour_toDate(tcjour) {
		const split = tcjour.split(' ');
		return new Date(tcjour);
	}

	get day() {
		return this.m_day;
	}

	set day(_date) {
		this.m_date = _date;
	}

	get leftIndice() {
		return this.m_leftIndice;
	}

	set leftIndice(_leftIndice) {
		this.m_leftIndice = _leftIndice;
	}

	// TODO : enum days

	// to day
}

class ScheduleAppointment {
	constructor(_code, _presenter, _label, _timeRange, _location) {
		this.m_code = _code;
		this.m_presenter = _presenter;
	}

	get code() {
		return this.m_code;
	}

	set code(_code) {
		this.m_code = _code;
	}

	get presenter() {
		return this.m_presenter;
	}

	set presenter(_presenter) {
		this.m_presenter = _presenter;
	}
}
*/

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	/*
	// const url = "http://exmple.com/";
	const url = "https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=G&Tel=eymeric.sertgoz&date=10/15/2021";
	got(url).then(response => {
		const dom = new JSDOM(response.body);
		const globalDiv = dom.window.document.querySelector("#DivBody");

		let last_elt = null;
		let weeks = [];
		let days = [];
		let cases = [];

		for (const elt of globalDiv.children) {
			if (last_elt == "Case" && elt.className != "Case") {
				weeks.push({days: days, cases: cases});
			}

			switch (elt.className) {
				case "Jour":
					if (last_elt != "Jour") days = [];
					days.push(elt);
					const sDay = new ScheduleDay(elt.textContent, elt.style.left);
					console.log(`Day : ${sDay.day} || ${sDay.leftIndice}`);
					break;
				case "Case":
					if (last_elt != "Case") cases = [];
					const table = elt.querySelector("table.TCase");

					if (table === null) break;

					cases.push(table);

					const code = table.querySelector("td.TCase").textContent;
					const presenter = table.querySelector("td.TCProf").innerHTML;
					//const label;
					//const timeRange;
					//const location;

					const sAppointment = new ScheduleAppointment(code, presenter);
					console.log(`Appointment : ${sAppointment.code} | ${sAppointment.presenter}`);
					break;
				default:
					break;
			}

			last_elt = elt.className;
		}

		/*
		weeks.forEach(week => {
			console.log("Week :");
			console.table(week);
		});


		// TODO : make schedule from day and case


		console.log("fin");
	}).catch(err => {
		console.log(err);
	});*/
});

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

client.login(BOT_TOKEN);

/*

Enregistrer une liste d'utilisateur ?
Il faut s'enregistrer ?
Crer un channel pour le bot ?

Le bot repond a certain question de paertout en ephemeral

https://www.beecome.io/get/external-planning

ne pas renvoye un screen de l'edt mais plutot une version plus propre ?

le chanell avec info general est tenu propre ? ( clean programmer )


acces au lien teams uniquement de la semaine en cours ?

pour chaque elt du body :
a partir du premier jours : ajouter tout les jours qui suivent directement.
	si le l'elt suivant n'est plus un jours :
		si c'est case : ajouter

	Liste de jours :        Liste de case (cours) :
		[                       [
		  1                       1
		  2                       2
		  3                     ]
		  4
		  5
		]

	Comparer la proriété left de jours et case, si jours.left + 0.12 = case.left aors le cours fait parti du jours
	ex : jours.left:122.4000%; case.left:122.5200%;


	Liste de jours lie au cours :
		[
		  1 : []
		  2 : []
		  3 : []
		  4 : [
		    1
		    2
		  ]
		  5 : []
		]



enchainement : THeure > BJours > Jours and so on

 */

// TODO : /lien : besoin de deferer
