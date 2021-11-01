const { SlashCommandBuilder } = require('@discordjs/builders');
const { CAL_L, CAL_M1, CAL_M2 } = require('../config.json');
const {MessageEmbed} = require("discord.js");

// TODO : refactor

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('cal')
        .setDescription('envoie le calendrier d\'alternance')
        .addStringOption(option => option
            .setName('annee')
            .setDescription('Année du calendrier, li, m1 ou m2')
            .setRequired(true)),
    async execute(interaction)
    {
        let annee = interaction.options.getString('annee')
        switch (annee)
        {
            case "li":
                if(CAL_L==="PATH")
                {
                    interaction.reply({ content: 'Calendrier d\'alternace de Licence n\'est pas trouver ou manquant', ephemeral: true, files: [] }).then().catch(console.error);
                }
                else
                {
                    interaction.reply({content:'Calendrier d\'alternace de Licence', ephemeral: true, files: [CAL_L] }).then().catch(console.error);
                }
                break;
            case "m1":
                if(CAL_M1==="PATH")
                {
                    interaction.reply({ content: 'Calendrier d\'alternace de Master 1 n\'est pas trouver ou manquant', ephemeral: true, files: [] }).then().catch(console.error);
                }
                else
                {
                    interaction.reply({content:'Calendrier d\'alternace de Master 1', ephemeral: true, files: [CAL_M1] }).then().catch(console.error);
                }
                break;
            case "m2":
                if(CAL_M2==="PATH")
                {
                    interaction.reply({ content: 'Calendrier d\'alternace de Master 2 n\'est pas trouver ou manquant', ephemeral: true, files: [] }).then().catch(console.error);
                }
                else
                {
                    interaction.reply({content:'Calendrier d\'alternace de Master 2', ephemeral: true, files: [CAL_M2] }).then().catch(console.error);
                }
                break;
            default: interaction.reply({ content: `La valeur pour le parametre \'annee\' doit etre \'li\', \'m1\' ou \'m2\'`, ephemeral: true, files: [] }).then().catch(console.error);
                break;
        }
    },
};
