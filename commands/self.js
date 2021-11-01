const {SlashCommandBuilder} = require('@discordjs/builders');
const {User} = require("../database/models/user.js");

// ############### Constants ###############

const SUB_CMD_GRP_MANAGE = "manage";
const SUB_CMD_CHECK = "check";
const SUB_CMD_UPDATE = "update";
const SUB_CMD_REMOVE = "remove";

const SUB_CMD_REGISTER = "register";

// ############### END ###############

const selfCommand = new SlashCommandBuilder()
	.setName('self')
	.setDescription('Admin stuff about your IPI account');

selfCommand.addSubcommandGroup(subGroup =>
	subGroup
		.setName(SUB_CMD_GRP_MANAGE)
		.setDescription("Manage your account into our service")
		.addSubcommand(subCommand =>
			subCommand
				.setName(SUB_CMD_CHECK)
				.setDescription("Check your account into our service"))
		.addSubcommand(subCommand =>
			subCommand
				.setName(SUB_CMD_REMOVE)
				.setDescription("Remove your account from our service"))
		.addSubcommand(subCommand =>
			subCommand
				.setName(SUB_CMD_UPDATE)
				.setDescription("Update your account (firstname, lastname)")
				.addStringOption(option =>
					option
						.setName("firstname")
						.setDescription("You're new firstname")
				)
				.addStringOption(option =>
					option
						.setName("lastname")
						.setDescription("You're new lastname")
				)));

selfCommand.addSubcommand(subcommand =>
	subcommand
		.setName(SUB_CMD_REGISTER)
		.setDescription("Register yourself into our service if is not already done")
		.addStringOption(option =>
			option
				.setName("firstname")
				.setDescription("You're firstname")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("lastname")
				.setDescription("You're lastname")
				.setRequired(true)
		));

module.exports = {
	data: selfCommand,
	async execute(_interaction) {
		if (!_interaction.isCommand() || _interaction.commandName !== 'self') return;

		await _interaction.deferReply({ephemeral: true});

		const subCommand = _interaction.options.getSubcommand();
		const iUser = _interaction.user;
		let content = `Hello **${iUser.username}** !`;

		if (_interaction.options.getSubcommandGroup(false)) {
			switch (_interaction.options.getSubcommandGroup()) {
				case SUB_CMD_GRP_MANAGE:
					const user = await User.findByDiscordId(iUser.id);
					if (!user) content += "\nYour not yet register into our service please correct that by typing */self register*";
					else {
						switch (subCommand) {
							case SUB_CMD_CHECK:
								content += `\nGood to see you ${user.firstname} ${user.lastname}.`;
								break;
							case SUB_CMD_UPDATE:
								const firstname = _interaction.options.getString("firstname");
								const lastname = _interaction.options.getString("lastname");

								if(!firstname && !lastname ) {
									content += `\nNothing to to. `;
									break;
								}

								content += `\nUpdated `;

								if (firstname) {
									user.firstname = firstname;
									content += `new firstname: ${firstname}`;
								}

								if (lastname) {
									user.lastname = lastname;
									content += `new lastname: ${lastname}`;
								}
								break;
							case SUB_CMD_REMOVE:
								if (await user.delete()) content += "\nYour account have been deleted.";
								else content += "\nYour account have not been deleted.";
						}
					}
					break;
				default:
			}
		} else {
			switch (subCommand) {
				case SUB_CMD_REGISTER:
					if (await User.isExist(iUser.id)) content += `\nYou're already registered !`;
					else {
						const lastname = _interaction.options.getString("lastname");
						const firstname = _interaction.options.getString("firstname");
						const user = new User();
						user.discordId = iUser.id;
						user.firstname = `${firstname[0].toUpperCase()}${firstname.slice(1)}`;
						user.lastname = lastname.toUpperCase();

						if (await user.save())
							content += `\nSuccessfully registered ! Welcome **${user.firstname} ${user.lastname}.**`;
						else
							content += `\nSomething went wrong, please try again.`;
					}
					break;
				default:
			}
		}

		await _interaction.editReply({content: content});
	}
}
