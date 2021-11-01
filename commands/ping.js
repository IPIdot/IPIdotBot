const { SlashCommandBuilder } = require('@discordjs/builders');

const pingCommand = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Reply with Pong');

module.exports = {
	data: pingCommand,
	async execute(_interaction) {
		const member = _interaction.member;

		const content = `Hello **${member.user.username}** ${member ? "*aka " + member.nickname + "*" : ""}, this reply make : __*${new Date(Date.now()).getMilliseconds() - _interaction.createdAt.getMilliseconds()} ms*__ to come, pretty fast yeah.\n~~I almost forgot~~ : **Pong !**`;

		await _interaction.reply({ content: content, ephemeral: true});
	},
};
