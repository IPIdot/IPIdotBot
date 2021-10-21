const got = require("got");
const {JSDOM} = require("jsdom");
const ScheduleDay = require("./internals/scheduleDay");
const {DateTime, Interval} = require("luxon");
const ScheduleAppointment = require("./internals/scheduleAppointment");
module.exports = class Schedule {

	constructor() {

	}

	get_day(slashed_date) {
		// slashed_date 31/10/2021
		console.log("test");
	}
}

module.exports.exposeDay = () => {
	// target
	console.log("> target");

	const target_date = DateTime.utc(2021, 10, 18, 14, 0);

	const targets = calendar.filter(elt => {
		return elt.day != null
			&& elt.day.hasSame(target_date, "year")
			&& elt.day.hasSame(target_date, "month")
			&& elt.day.hasSame(target_date, "day")
	});

	console.table(targets);
}

module.exports.srapEDT = () => {
	const url = "https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=G&Tel=eymeric.sertgoz&date=10/20/2021"; // TODO : refactor

	got(url).then(response => {
		const dom = new JSDOM(response.body);
		const globalDiv = dom.window.document.querySelector("#DivBody");

		let last_elt = "";
		let scheduledDays = [];
		let calendar = [];

		// check each elt type
		for (const elt of globalDiv.children) {

			// check if is new week div group ?
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
		console.log("fin");
	}).catch(err => {
		console.log(err);
	});
}

function makeAppointmentFromEdtDOM(_dom, _dayDate) {
	const tcprof = _dom.querySelector("td.TCProf").innerHTML.split("<br>");
	const timeRange = _dom.querySelector("td.TChdeb").textContent.split(" - ");
	const startTime = DateTime.fromFormat(timeRange[0], "hh:mm");
	const endTime = DateTime.fromFormat(timeRange[1], "hh:mm");
	const range = Interval.fromDateTimes(
		new DateTime(_dayDate).plus({ hours: startTime.hour, minutes: startTime.minute}).toUTC(),
		new DateTime(_dayDate).plus({ hours: endTime.hour, minutes: endTime.minute}).toUTC());

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

	return new ScheduleAppointment(
		_dom.querySelector("td.TCase").textContent,
		tcprof[0],
		tcprof[1],
		range,
		location
	);
}
