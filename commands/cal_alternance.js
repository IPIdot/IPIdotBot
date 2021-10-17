const { SlashCommandBuilder } = require('@discordjs/builders');
const { CALENDRIER_ALTERNANCE_L, CALENDRIER_ALTERNANCE_M1, CALENDRIER_ALTERNANCE_M2 } = require('./config.json');


module.exports =
{
    data: new SlashCommandBuilder()
        .setName('cal')
        .setDescription('envoie le calendrier d\'alternance')
        .addUserOption(option => option
            .setName('annee')
            .setDescription('Année du calendrier, li, m1 ou m2')
            .setRequired(true)),
    async execute(interaction)
    {
        let annee = interaction.options.getUser('annee');
        switch (annee)
        {
            case "li":
                interaction.reply('Calendrier d\'alternace de Licence',{files : [CALENDRIER_ALTERNANCE_L]});
                break;
            case "m1":
                interaction.reply('Calendrier d\'alternace de Master 1',{files : [CALENDRIER_ALTERNANCE_M1]});
                break;
            case "m2":
                interaction.reply('Calendrier d\'alternace de Master 2',{files : [CALENDRIER_ALTERNANCE_M2]});
                break;
        }
    },
};