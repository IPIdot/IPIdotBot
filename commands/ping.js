const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://edtmobiliteng.wigorservices.net/WebPsDyn.aspx?action=posEDTBEECOME&serverID=G&date=10/12/2021&StartMeetingTeams=444366&StartMeetingTeamsHash=1BB4C5617BD4CCB3B66768317CB71DA003B66E7CAFA2989AA4F56680F3508A53D8731E0DF4675F29EE97DAA55D1E24C853E409A9E945B8AF821D08BA9BCE559A&Tel=eymeric.sertgoz')
			.setDescription('Some description here');

		await interaction.reply({ content: 'Pong!', components: [row], embeds: [embed], ephemeral: true });
	},
};
