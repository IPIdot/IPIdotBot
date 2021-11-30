const {EDT_BASE_URL, SERVER_TIMEZONE} = require("../globals.js");
const got = require("got");
const {JSDOM} = require("jsdom");
const ScheduleDay = require("./scheduleDay");
const {DateTime, Interval, Settings: LuxonSettings} = require("luxon");
LuxonSettings.defaultZone = SERVER_TIMEZONE;
const ScheduleAppointment = require("./scheduleAppointment");

/**
 * Generate personal url to edt
 * @param {string} _firstname
 * @param {string} _lastname
 * @param {DateTime=} _date
 * @return {string|null} formatted edt url
 */
module.exports.generate_edt_url = (_firstname, _lastname, _date = DateTime.now()) => {
	if(!_firstname || !_lastname) return null;

	const user = `${_firstname.toLowerCase()}.${_lastname.toLowerCase()}`;

	return `${EDT_BASE_URL}&Tel=${user}&date=${_date.toFormat("MM/dd/y")}`;
}

/**
 * Search day in calendar corresponding to target
 * @param {Object} _calendar
 * @param {DateTime} _date
 * @return {null|ScheduleDay} return the found day or null
 */
module.exports.findDay = (_calendar, _date = DateTime.utc()) => {
	return _calendar.find(elt => {
		return elt.day != null
			&& elt.day.hasSame(_date, "year")
			&& elt.day.hasSame(_date, "month")
			&& elt.day.hasSame(_date, "day");
	});
}

/**
 * Find ScheduleAppointment corresponding to date schedule in given ScheduleDay
 * @param {ScheduleDay} _day
 * @param {DateTime} _date
 * @return {null|ScheduleAppointment}
 */
module.exports.findAppointment = (_day, _date = DateTime.now().setLocale("fr")) => {
	if (!_day || !_day.appointments) return null;

	return _day.appointments.find(elt => {
		return elt.timeRange != null
			&& elt.timeRange.contains(_date.plus({minutes: 13}));
	});
}

/**
 * Scrap EDT available on the given edt url
 * @param _edtURL
 * @return {Promise<*[]>}
 */
module.exports.scrapEDT = async (_edtURL) => {
	//const url = "https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=G&Tel=eymeric.sertgoz&date=10/18/2021";
	//_edtURL = url;

	let calendar = [];

	await got(_edtURL).then(response => {
		const dom = new JSDOM(response.body);
		const globalDiv = dom.window.document.querySelector("#DivBody");

		let last_elt = "";
		let scheduledDays = [];

		// Check each elt type
		for (const elt of globalDiv.children) {
			// Check if is new week div group
			if (last_elt === "Case" && elt.className !== "Case") {
				calendar.push(...scheduledDays);
			}

			switch (elt.className) {
				case "Jour":
					if (last_elt !== "Jour") scheduledDays = [];

					scheduledDays.push( new ScheduleDay(
						elt.textContent,
						Math.round(parseFloat(elt.style.left.slice(0, -1)) * 100)
					));
					break;
				case "Case":
					const table = elt.querySelector("table.TCase");

					if (table === null) break;

					const day = scheduledDays
						.filter(day => day.leftIndice + 12 === Math.round(parseFloat(elt.style.left.slice(0, -1)) * 100))[0];
					const scheduledAppointment = makeAppointmentFromEdtDOM(
						table,
						day.day
					);
					day.appointments.push(scheduledAppointment);

					break;
				default:
					break;
			}
			last_elt = elt.className;
		}
	}).catch(err => {
		console.error(err);
	});

	return calendar;
}

function makeAppointmentFromEdtDOM(_dom, _dayDate) {
	const tcCase = _dom.querySelector("td.TCase");
	const teamsLinks = tcCase.querySelectorAll(".Teams a");
	const tcProf = _dom.querySelector("td.TCProf").innerHTML.split("<br>");
	const timeRange = _dom.querySelector("td.TChdeb").textContent.split(" - ");
	const startTime = DateTime.fromFormat(timeRange[0], "hh:mm");
	const endTime = DateTime.fromFormat(timeRange[1], "hh:mm");
	const range = Interval.fromDateTimes(
		new DateTime(_dayDate).plus({ hours: startTime.hour, minutes: startTime.minute}),
		new DateTime(_dayDate).plus({ hours: endTime.hour, minutes: endTime.minute}));

	let location = _dom.querySelector("td.TCSalle")
		.textContent
		.replace("Salle:", "");

	if (location !== "Aucune") {
		switch (location[0]) {
			case "L":
				location = "LECLAIR " + location.substr(1, 3);
				break;
			case "B":
				location = "BERTHET " + location.substr(1, 3);
				break;
			default:
				break;
		}
	}

	const result = new ScheduleAppointment(
		tcCase.textContent,
		tcProf[0],
		tcProf[1],
		range,
		location,
	);

	if (teamsLinks.length > 0) {
		result.teamsMain = teamsLinks[0].href;
		result.teamsRose = teamsLinks[1].href;
		result.teamsVert = teamsLinks[2].href;
		result.teamsOrange = teamsLinks[3].href;
	}

	return result;
}
