const { SlashCommandBuilder } = require('@discordjs/builders');
const { RESOURCES } = require("../globals.js");
const {MessageActionRow, MessageButton} = require("discord.js");

// ############### Constants ###############

const CMD_NAME = "resources";
const SUB_CMD_CALENDAR = {
	NAME: "calendar",
	FORMAT_CHOICE: {
		NAME: "format",
		CHOICES:  { PDF: "pdf", PNG: "png" }
	},
	YEAR_CHOICE: {
		NAME: "year",
		CHOICES: { L3: "l3", M1: "m1", M2: "m2" }
	}
};
const SUB_CMD_LINKS = {
	NAME: "links",
	LINK_CHOICE: {
		NAME: "link",
		CHOICES: { BEECOME: "beecome", PORTAL: "portal" }
	}
};
const SUB_CMD_LOGO = {
	NAME: "logos",
	LOGO_CHOICE: {
		NAME: "logo",
		CHOICES: { WITHTYPO: "typoOn", WITHOUTTYPO: "typoOff" }
	}
};

// ############### END ###############

const resourcesCommand = new SlashCommandBuilder()
	.setName(CMD_NAME)
	.setDescription("The place to found useful resources !");

resourcesCommand.addSubcommand(_subCommand =>
	_subCommand
		.setName(SUB_CMD_CALENDAR.NAME)
		.setDescription("Give requested calendar in asked format.")
		.addStringOption(_option =>
			_option
				.setName(SUB_CMD_CALENDAR.FORMAT_CHOICE.NAME)
				.setDescription("The format you want.")
				.setRequired(true)
				.addChoices([
					["PDF", SUB_CMD_CALENDAR.FORMAT_CHOICE.CHOICES.PDF],
					["PNG", SUB_CMD_CALENDAR.FORMAT_CHOICE.CHOICES.PNG]
				]))
		.addStringOption(_option =>
			_option
				.setName(SUB_CMD_CALENDAR.YEAR_CHOICE.NAME)
				.setDescription("The year you looking for.")
				.setRequired(true)
				.addChoices([
					["Licence 3 ( 2020 - 2021 )", SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.L3],
					["Master 1 ( 2021 - 2022 )", SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.M1],
					["Master 2 ( 2021 - 2022 )", SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.M2]
				])));

resourcesCommand.addSubcommand(_subCommand =>
	_subCommand
		.setName(SUB_CMD_LINKS.NAME)
		.setDescription("Give requested link.")
		.addStringOption(_option =>
			_option
				.setName(SUB_CMD_LINKS.LINK_CHOICE.NAME)
				.setDescription("The link you want.")
				.setRequired(true)
				.addChoices([
					["www.beecome.io", SUB_CMD_LINKS.LINK_CHOICE.CHOICES.BEECOME],
					["apprenant.ipi-lyon.info", SUB_CMD_LINKS.LINK_CHOICE.CHOICES.PORTAL]
				])));

resourcesCommand.addSubcommand(_subCommand =>
	_subCommand
		.setName(SUB_CMD_LOGO.NAME)
		.setDescription("Give requested logo.")
		.addStringOption(_option =>
			_option
				.setName(SUB_CMD_LOGO.LOGO_CHOICE.NAME)
				.setDescription("The link you want.")
				.setRequired(true)
				.addChoices([
					["with text", SUB_CMD_LOGO.LOGO_CHOICE.CHOICES.WITHOUTTYPO],
					["without text", SUB_CMD_LOGO.LOGO_CHOICE.CHOICES.WITHTYPO]
				])));

// ############### Utils ###############

// ############### END ###############

module.exports = {
	data: resourcesCommand,
	async execute(_interaction) {
		if (!_interaction.isCommand() || _interaction.commandName !== CMD_NAME) return;
		await _interaction.deferReply({ephemeral: true});
		const replyOptions = {};
		const subCommand = _interaction.options.getSubcommand();

		if (_interaction.options.getSubcommandGroup(false)) {
			replyOptions.content = `No sub command available.`;
		} else {
			switch (subCommand) {
				case SUB_CMD_CALENDAR.NAME:
					const CALENDAR_PATH = RESOURCES.PATH.CALENDAR;
					const format = _interaction.options.getString(SUB_CMD_CALENDAR.FORMAT_CHOICE.NAME);
					const year = _interaction.options.getString(SUB_CMD_CALENDAR.YEAR_CHOICE.NAME);

					switch (format) {
						case SUB_CMD_CALENDAR.FORMAT_CHOICE.CHOICES.PNG:
							switch (year) {
								case SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.L3:
									replyOptions.content = `Here he his ! Your requested calendar :`;
									replyOptions.files = [CALENDAR_PATH.PNG.L3];
									break;
								case SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.M1:
									replyOptions.content = `Here he his ! Your requested calendar :`;
									replyOptions.files = [CALENDAR_PATH.PNG.M1];
									break;
								case SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.M2:
									replyOptions.content = `Calendar not yet available.`;
									break;
								default:
							}
							break;
						case SUB_CMD_CALENDAR.FORMAT_CHOICE.CHOICES.PDF:
							switch (year) {
								case SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.L3:
									replyOptions.content = `Here he his ! Your requested calendar :`;
									replyOptions.files = [CALENDAR_PATH.PDF.L3];
									break;
								case SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.M1:
									replyOptions.content = `Here he his ! Your requested calendar :`;
									replyOptions.files = [CALENDAR_PATH.PDF.M1];
									break;
								case SUB_CMD_CALENDAR.YEAR_CHOICE.CHOICES.M2:
									replyOptions.content = `Calendar not yet available.`;
									break;
								default:
							}
							break;
						default:
					}
					break;
				case SUB_CMD_LINKS.NAME:
					const URLS = RESOURCES.URL;
					const link = _interaction.options.getString(SUB_CMD_LINKS.LINK_CHOICE.NAME);
					switch (link) {
						case SUB_CMD_LINKS.LINK_CHOICE.CHOICES.BEECOME:
							replyOptions.content = `Here he his ! Your requested link :`;
							replyOptions.components = [
								new MessageActionRow()
									.addComponents(
										new MessageButton()
											.setStyle('LINK')
											.setLabel('Become')
											.setURL(URLS.BEECOME))];
							break;
						case SUB_CMD_LINKS.LINK_CHOICE.CHOICES.PORTAL:
							replyOptions.content = `Here he his ! Your requested link :`;
							replyOptions.components = [
								new MessageActionRow()
									.addComponents(
										new MessageButton()
											.setStyle('LINK')
											.setLabel('Portail apprenant')
											.setURL(URLS.PORTAL))];
							break;
						default:
					}
					break;
				case SUB_CMD_LOGO.NAME:
					const LOGO_PATH = RESOURCES.PATH.LOGO;
					const logo = _interaction.options.getString(SUB_CMD_LOGO.LOGO_CHOICE.NAME);
					switch (logo) {
						case SUB_CMD_LOGO.LOGO_CHOICE.CHOICES.WITHTYPO:
							replyOptions.content = `Here he his ! Your requested logo :`;
							replyOptions.files = [LOGO_PATH.WITHTYPO];
							break;
						case SUB_CMD_LOGO.LOGO_CHOICE.CHOICES.WITHOUTTYPO:
							replyOptions.content = `Here he his ! Your requested logo :`;
							replyOptions.files = [LOGO_PATH.WITHOUTTYPO];
							break;
						default:
					}
					break;
				default:
			}
		}

		await _interaction.editReply(replyOptions);
	}
}
