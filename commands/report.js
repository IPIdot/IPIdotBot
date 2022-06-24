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
                    .setDescription("Bug tiile")
                    .setRequired(true)
                    )
            .addStringOption(_option =>
                _option
                    .setName("contenue")
                    .setDescription("Bug description")
                    .setRequired(true)
        ),
        async execute(_interaction)
        {
            const iUser = _interaction.user;
            const user = await User.findByDiscordId(iUser.id);

            _interaction.reply({content: ''});
        }

    }