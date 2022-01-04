
const { SERVER_TIMEZONE, htmlToImage } = require("../globals");
const { DateTime, Settings: LuxonSettings } = require("luxon");
LuxonSettings.defaultZone = SERVER_TIMEZONE;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const { scrapEDT, findDay, findAppointment, generate_edt_url } = require("../internals/schedule.js");
const { User } = require("../database/models/user.js");
const { CreateEDTImage } = require("../internals/edtImg.js");
// ############### Constants ###############

const CMD_NAME = "edt";
const SUB_CMD_URL = "url";
const SUB_CMD_TEAMS_URL = "teams_url";
const imgEdt = CreateEDTImage.CreateImageEDT();

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
							const attachment = new MessageAttachment(imgEdt, "edt.png");
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
