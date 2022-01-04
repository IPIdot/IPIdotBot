const { SERVER_TIMEZONE, htmlToImage } = require("../globals");
const { DateTime, Settings: LuxonSettings } = require("luxon");
LuxonSettings.defaultZone = SERVER_TIMEZONE;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const { scrapEDT, findDay, findAppointment, generate_edt_url } = require("../internals/schedule.js");
const { User } = require("../database/models/user.js");

// ############### Constants ###############

const CMD_NAME = "edt";
const SUB_CMD_URL = "url";
const SUB_CMD_TEAMS_URL = "teams_url";

// ############### END ###############

/*
TODO :
	- récuper un im ge de l'edt du jours
	- récuperer une image de l'edt de la semaine
	- récuperer une image de l'edt du jours ou de la semaine demandé
 */

const edtCommand = new SlashCommandBuilder()
	.setName(CMD_NAME)
	.setDescription('Edt commands');

edtCommand.addSubcommand(subCmd =>
	subCmd
		.setName(SUB_CMD_URL)
		.setDescription("Get edt web url"));

edtCommand.addSubcommand(subCmd =>
	subCmd
		.setName(SUB_CMD_TEAMS_URL)
		.setDescription("Get team current main url"));

// ############### Utils ###############

// const test_date = DateTime.utc(2021, 10, 18, 8, 47);

const computeAppointmentTemplate = (_appointment) => {
	return `
		<div class="cell">
        	<p><span style="color: #ff1027">M</span>odule : <b>${_appointment.label}</b></p>
            <p><span style="color: #ff1027">I</span>ntervant : <b>${_appointment.presenter}</b></p>
            <p><span style="color: #ff1027">S</span>alle : <b>${_appointment.location}</b></p>
            <p><span style="color: #ff1027">C</span>réneaux : <b>${_appointment.timeRange.start.toFormat("H:mm")} -> ${_appointment.timeRange.end.toFormat("H:mm")}</b></p>
        </div>`;
}

const computeDailyCalendarTemplate = (_day) => {
	const pageHead = `
		<head>
			<title></title>
	        <style>
	            * {
	                margin: 0;
	                padding: 0;
	            }
	
	            *,
	            *:before,
	            *:after {
	                box-sizing: border-box;
	            }
	
	            html,
	            body {
	                width: 500px;
	                background-color: whitesmoke;
	                font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
	            }
	
	            #content {
	                padding: 1rem;
	            }
	
	            .cell {
	                border: 1px solid #ff1027;
	                border-right: none;
	                border-left: none;
	                margin-top: 1rem;
	                padding: 1rem;
	                padding-left: 0rem;
	            }
	            
	            .title {
	            	font-size: 1.5rem;
	            }
	        </style>
	    </head>`;
	let pageContent = `<div id="content">`;
	pageContent += `<p class="title"><span style="color: #ff1027">E</span>mploi du temps du <b>${_day.day.toFormat("EEEE d MMMM")}</b></p>`;
	if (_day.appointments && _day.appointments.length > 0)
		_day.appointments.forEach( appointment => pageContent += computeAppointmentTemplate(appointment));
	else pageContent += `<p><span style="color: #ff1027">A</span>ucun cours aujourd'hui</p>`;
	pageContent += `<p style="margin-top: 1rem; font-size: 12px; text-align: right;"><i><span style="color: #ff1027">D</span>emande faite le <b>${DateTime.now().setLocale("fr").toFormat("EEEE d MMMM H:mm")}</b></i></p>`;
	pageContent += `</div>`;

	return `
		<html>
			${pageHead}
			<body>
				${pageContent}
			</body>
		</html>`;
}

// ############### END ###############

module.exports = {
	data: edtCommand,
	async execute(_interaction) {
		if (!_interaction.isCommand() || _interaction.commandName !== CMD_NAME) return;

		await _interaction.deferReply({ephemeral: true});
		const replyOptions = {};

		const subCommand = _interaction.options.getSubcommand();
		const iUser = _interaction.user;
		const user = await User.findByDiscordId(iUser.id);

		if (!user) {
			replyOptions.content = `**${iUser.username}** please make sure your registered before using this command.\n*/self register*`;
		}
		else {
			const edtURL = generate_edt_url(user.firstname, user.lastname);
			switch(subCommand) {
				case SUB_CMD_URL:
					const row = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setStyle('LINK')
								.setLabel('EdT')
								.setURL(edtURL));
					replyOptions.content = `**${user.firstname} ${user.lastname}** please follow link below.\nIf it's incorrect, please verify your account firstname (${user.firstname.toLowerCase()}) and lastname (${user.lastname.toLowerCase()}).`;
					replyOptions.components = [row];
					break;
				case SUB_CMD_TEAMS_URL:
					const scraped_edt = await scrapEDT(edtURL);

					if (!scraped_edt)
						replyOptions.content = `Ops, **${user.firstname} ${user.lastname}** something went wrong.`;
					else {
						const currentDay = findDay(scraped_edt);
						const date = DateTime.now().setLocale("fr");

						if (!currentDay) replyOptions.content = `**${user.firstname} ${user.lastname}** no course available on *${date.toFormat("EEEE d MMMM y")}*.`;
						else {
							const html = computeDailyCalendarTemplate(currentDay);
							const image = await htmlToImage(html);
							const attachment = new MessageAttachment(image, "edt.png");
							replyOptions.files = [attachment];

							const currentAppointment = findAppointment(currentDay, date);
							if (!currentAppointment || !currentAppointment.teamsMain) replyOptions.content = `**${user.firstname} ${user.lastname}** no link available on *${date.toFormat("EEEE d MMMM y H:mm")}*.`;
							else {
								replyOptions.content = `**${user.firstname} ${user.lastname}** please follow links below.\nIf it's incorrect, please verify your account firstname (${user.firstname.toLowerCase()}) and lastname (${user.lastname.toLowerCase()}).`;
								replyOptions.components = [
									new MessageActionRow().addComponents(
										new MessageButton()
											.setStyle('LINK')
											.setLabel('Teams main')
											.setURL(currentAppointment.teamsMain),
										new MessageButton()
											.setStyle('LINK')
											.setLabel('Teams pink')
											.setURL(currentAppointment.teamsRose),
										new MessageButton()
											.setStyle('LINK')
											.setLabel('Teams green')
											.setURL(currentAppointment.teamsVert),
										new MessageButton()
											.setStyle('LINK')
											.setLabel('Teams orange')
											.setURL(currentAppointment.teamsOrange))];
							}
						}
					}
					break;
				default:
			}
		}
		await _interaction.editReply(replyOptions);
	}
};
