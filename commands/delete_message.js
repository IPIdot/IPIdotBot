const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const {MessageEmbed} = require("discord.js");

permission= new Permissions(Permissions.FLAGS.ADMINISTRATOR);

module.exports =
    {
        data: new SlashCommandBuilder()
            .setName('del')
            .setDescription('Supprime les messages de moin de 14 jours')
            .addIntegerOption(option => option
                .setName('nb')
                .setDescription('Nombre de message à supprimer (entre 1 et 100)')
                .setRequired(true)),
        async execute(interaction)
        {
            let nb = interaction.options.getInteger('nb');
            if (permission.has(Permissions.FLAGS.ADMINISTRATOR))
            {
                if(nb>100 || nb<1)
                {
                    interaction.reply({ content: 'La commande prend un nombre entre 1 et 100', ephemeral: true, files: [] })
                }
                else
                {
                    interaction.channel.bulkDelete(nb).then(messages => interaction.reply({ content: `La suppression de ${nb} messages est fini`, ephemeral: true, files: [] })).catch(console.error);
                }
            }
            else
            {
                interaction.reply({ content: 'Tu n\'as pas la permission d\'effectuer cette commande', ephemeral: true, files: [] })
            }
        }
    }