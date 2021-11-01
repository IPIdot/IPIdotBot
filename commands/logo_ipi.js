const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");

// TODO : refactor global config

module.exports =
    {
        data: new SlashCommandBuilder()
            .setName('logo')
            .setDescription('envoie le logo de l\'ecole ')
            .addStringOption(option => option
                .setName('texte')
                .setDescription('logo avec le texte (\'oui\' ou \'non\'')
                .setRequired(true)),
        async execute(interaction)
        {
            switch(interaction.options.getString('texte'))
            {
                case 'oui': interaction.reply({ content: `Voici le logo avec le texte`, ephemeral: true, files: ['.\\assets\\logoIPITypo.png']}).then().catch(console.error);
                    break;
                case 'non': interaction.reply({ content: `Voici le logo sans le texte`, ephemeral: true, files: ['.\\assets\\logoIPI.png']}).then().catch(console.error);
                    break;
                default: interaction.reply({ content: `La valeur pour le parametre \'texte\' doit etre \'oui\' ou \'non\'`, ephemeral: true, files: [] }).then().catch(console.error);
                    break;
            }
        },
    };
