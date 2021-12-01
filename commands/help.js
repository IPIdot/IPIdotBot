const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const {MessageEmbed} = require("discord.js");

permission= new Permissions(Permissions.FLAGS.ADMINISTRATOR);

// TODO check utility

module.exports =
    {
        data: new SlashCommandBuilder()
            .setName('help')
            .setDescription('send command list'),
        async execute(interaction)
        {
            let tab_command;
            tab_command=new String[11];
            tab_command[0]="/edt url : Get edt xeb url"

            await interaction.reply({ content:"", ephemeral: true});
        }
    }