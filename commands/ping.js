const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const { MessageAttachment } = require('discord.js')
const nodeHtmlToImage = require('node-html-to-image')

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
			.setDescription('Some description here')
			.setImage("attachment://150.png");

		const tmp = await htmlEmbed("test", "KAARIE");
		const attachment = new MessageAttachment("../README.md", tmp.name);

		await interaction.reply({ content: 'Pong!', embeds: [embed], ephemeral: false, files: [] });
	},
};

async function htmlEmbed(msg, name) {

	const _htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
      body {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        background: rgb(22, 22, 22);
        color: #fff;
        max-width: 300px;
      }

      .app {
        max-width: 300px;
        padding: 20px;
        display: flex;
        flex-direction: row;
        border-top: 3px solid rgb(16, 180, 209);
        background: rgb(31, 31, 31);
        align-items: center;
      }

      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 50%;
        border: 1px solid #fff;
        padding: 5px;
      }
    </style>
  </head>
  <body>
    <div class="app">
      <img src="https://avatars.dicebear.com/4.5/api/avataaars/${name}.svg" />

      <h4>Welcome ${name}</h4>
    </div>
  </body>
</html>
`

	const images = await nodeHtmlToImage({
		html: _htmlTemplate,
		quality: 100,
		type: 'jpeg',
		puppeteerArgs: {
			args: ['--no-sandbox'],
		},
		encoding: 'buffer',
	})
// for more configuration options refer to the library

	return {att: images, name: `${name}.jpeg`};
}
