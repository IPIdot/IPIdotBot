const { SlashCommandBuilder } = require('@discordjs/builders');
const { RESOURCES } = require("../globals.js");
const {MessageActionRow, MessageButton} = require("discord.js");


module.exports =
    {
        data: new SlashCommandBuilder()
            .setName('help')
            .setDescription('Responds with a list of commands'),
        async execute(_interaction)
        {
            _interaction.reply({content: `/edt url : Get edt web url\n
            /edt teams_url : Get team current main url\n
            \n
            /resource logo : Give requested logo\n
            /resources calendar : Give requested calendar in asked format\n
            /resources links : The link you want\n
            \n
            /self manage check : Check your account into our service\n
            /self manage remove : Remove your account from our service\n
            /self manage update : Update your account (firstname, lastname)\n
            /self register : Register yourself into our service if is not already done`, ephemeral: true});

        }

    }
