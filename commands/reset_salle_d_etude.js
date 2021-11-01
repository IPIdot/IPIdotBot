const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const {MessageEmbed} = require("discord.js");

permission= new Permissions(Permissions.FLAGS.ADMINISTRATOR);

// TODO : check if it's work

module.exports =
    {
        data: new SlashCommandBuilder()
            .setName('reset_salle')
            .setDescription('Supprime tous les messages de la salle d\'étude courante'),
        async execute(interaction) {
            let nb = interaction.options.getInteger('nb');
            if (permission.has(Permissions.FLAGS.ADMINISTRATOR))
            {
                let channel_name = interaction.channel.name;
                let category_id = interaction.channel.parentId;

                if(channel_name.indexOf('salle-détude') != -1)
                {
                    interaction.channel.delete().catch(console.error);
                    interaction.guild.channels.create(channel_name,{
                        type:'GUILD_TEXT',
                        parent: category_id,
                    }).then(messages => interaction.reply({ content: `le reset du channel ${channel_name} est fini`, ephemeral: true, files: [] })).catch(console.error);
                }
                else
                {
                    interaction.reply('ce channel ne peu pas être reset');
                }
            }
        }
    };
