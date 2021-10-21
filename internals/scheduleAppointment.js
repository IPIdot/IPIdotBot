const { DateTime, Settings: LuxonSettings } = require("luxon");
LuxonSettings.defaultZone = 'utc';

module.exports = class ScheduleAppointment {

	constructor(_code, _presenter, _label, _timeRange, _location) {
		this.m_code = _code;
		this.m_presenter = _presenter;
		this.m_label = _label;
		this.m_timeRange = _timeRange;
		this.m_location = _location;
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

}
