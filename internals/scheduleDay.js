const { SERVER_TIMEZONE } = require("../globals");
const { DateTime, Settings: LuxonSettings } = require("luxon");
LuxonSettings.defaultZone = SERVER_TIMEZONE;

module.exports = class ScheduleDay {

	constructor(_tcjour, _leftIndice) {
		this.m_day = this.tcjour_toDate(_tcjour);
		this.m_leftIndice = _leftIndice;
		this.m_appointments = [];
	}

	get day() {
		return this.m_day;
	}

	set day(_date) {
		this.m_date = _date;
	}

	get appointments() {
		return this.m_appointments;
	}

	set appointments(_appointments) {
		this.m_appointments = _appointments;
	}

	get leftIndice() {
		return this.m_leftIndice;
	}

	set leftIndice(_leftIndice) {
		this.m_leftIndice = _leftIndice;
	}

	tcjour_toDate(tcjour) {
		return DateTime
			.fromFormat(
				tcjour,
				"EEEE dd MMMM",
				{ locale: "fr" }
			);
	}
}
