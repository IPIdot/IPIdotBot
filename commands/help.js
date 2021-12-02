const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const {MessageEmbed} = require("discord.js");

permission= new Permissions(Permissions.FLAGS.ADMINISTRATOR);

// TODO check utility

module.exports =
    {
        data: new SlashCommandBuilder()
            .setName('help')
            .setDescription('Get command list'),
        async execute(interaction)
        {
            let tab_command;
            let texte="";
            tab_command=new String[11];
            tab_command[0]="/self register : Register yourself into our service if is not already done";
            tab_command[1]="/self manage check : Check your account into our service";
            tab_command[2]="/self manage update : Update your account (firstname, lastname)";
            tab_command[3]="/self manage remove : Remove your account from our service";
            tab_command[4]="/edt url : Get edt xeb url";
            tab_command[5]="/edt teams_url : Get team current main url";
            tab_command[6]="/resources calendar : Give requested calendar in asked format";
            tab_command[7]="/resources links : Give requested link";
            tab_command[8]="/resources logos : Give requested logo";
            tab_command[9]="/ping : Reply with Pong";
            tab_command[10]="/help : Get command list";

            for (let i=0;i<tab_command.size();i++)
            {
                texte+=tab_command[i]+"\n";
            }

            await interaction.reply({ content:texte, ephemeral: true});
        }
    }