const { Settings: LuxonSettings } = require("luxon");
LuxonSettings.defaultZone = 'utc';

module.exports = class ScheduleAppointment {

	constructor(_code, _presenter, _label, _timeRange, _location, _teams_main = null, _teams_rose = null, _teams_vert = null, _teams_orange = null) {
		this.m_code = _code;
		this.m_presenter = _presenter;
		this.m_label = _label;
		this.m_timeRange = _timeRange;
		this.m_location = _location;
		this.m_team_main = _teams_main;
		this.m_team_rose = _teams_rose;
		this.m_team_vert = _teams_vert;
		this.m_team_orange = _teams_orange;
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

	get label() {
		return this.m_label;
	}

	set label(_label) {
		this.m_label = _label;
	}

	get timeRange() {
		return this.m_timeRange;
	}

	set timeRange(_timeRange) {
		this.m_timeRange = _timeRange;
	}

	get location() {
		return this.m_location;
	}

	set location(_location) {
		this.m_location = _location;
	}

	get teamsMain() {
		return this.m_team_main;
	}

	set teamsMain(_link) {
		this.m_team_main = _link;
	}

	get teamsRose() {
		return this.m_team_rose;
	}

	set teamsRose(_link) {
		this.m_team_rose = _link;
	}

	get teamsVert() {
		return this.m_team_vert;
	}

	set teamsVert(_link) {
		this.m_team_vert = _link;
	}

	get teamsOrange() {
		return this.m_team_orange;
	}

	set teamsOrange(_link) {
		this.m_team_orange = _link;
	}

}
