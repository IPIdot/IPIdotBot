const { SlashCommandBuilder } = require('@discordjs/builders');
const { RESOURCES } = require("../globals.js");
const {MessageActionRow, MessageButton} = require("discord.js");
const {User} = require("../database/models/user");


module.exports =
    {
        data: new SlashCommandBuilder()
            .setName('report')
            .setDescription('Report bug')
            .addStringOption(_option =>
                _option
                    .setName("title")
                    .setDescription("Bug title")
                    .setRequired(true)
                    )
            .addStringOption(_option =>
                _option
                    .setName("content")
                    .setDescription("Bug description")
                    .setRequired(true)
        ),
        async execute(_interaction)
        {
            const channel =;
            const iUser = _interaction.user;
            const user = await User.findByDiscordId(iUser.id);
            const title = _interaction.options.getString("title");
            const content = _interaction.options.getString("content");

            _interaction.client.channels.get(`989921311033806868`).send({content: `BUG REPORT | TITLE : ${title}\nAUTHOR : ${user.firstname} ${user.lastname}\n${content}`});
        }

    }