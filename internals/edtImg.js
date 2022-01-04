const { SERVER_TIMEZONE, htmlToImage } = require("../globals");
const { DateTime, Settings: LuxonSettings } = require("luxon");
LuxonSettings.defaultZone = SERVER_TIMEZONE;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const { scrapEDT, findDay, findAppointment, generate_edt_url } = require("../internals/schedule.js");
const { User } = require("../database/models/user.js");

class CreateEDTImage {
    constructor(){}

    CreateImageEDT() {
// const test_date = DateTime.utc(2021, 10, 18, 8, 47);
        const {DateTime} = require("luxon");
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
	                background-color: white;
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
                _day.appointments.forEach(appointment => pageContent += computeAppointmentTemplate(appointment));
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
        const html = computeDailyCalendarTemplate(currentDay);
        const image = htmlToImage(html);
        return image;
    }
}
