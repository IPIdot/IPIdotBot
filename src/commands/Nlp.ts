import {BaseCommandInteraction, Client} from "discord.js";
import {Command} from "../Command";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import is from "@sindresorhus/is";

const execSync = require('child_process').execSync;

/**
 * Data hard coded, pending for API to be done
 */
const students = [
    {
        name: "SERTGOZ",
        firstname: "Eymeric",
        email: "eymeric.sertgoz@ipilyon.net",
        lvl: 27
    },
    {
        name: "DECORDE",
        firstname: "Maxime",
        email: "maxime.decorde@ipilyon.net",
        lvl: 23
    },
    {
        name: "DENOT",
        firstname: "Emilien",
        email: "emilien.denot@ipilyon.net",
        lvl: 23
    }
]

export const Nlp: Command = {
    name: "nlp",
    description: "Return nlp treatment of a sentence",
    type: "CHAT_INPUT",
    options: [
        {
            name: "text_input",
            description: "text inout to work on",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const options = interaction.options;
        console.log(options)
        let textInputOption = options.get('text_input');
        let content: string;

        if(textInputOption === null) content = "Erreur : pas de text";
        else {
            const port = 9000;
            const annotations = 'tokenize,ssplit,pos,lemma,ner,parse,depparse';
            let pattern = '/email/';
            let tokensRegexComputed = JSON.parse(await tokensRegex(String(textInputOption.value), port, pattern, annotations));

            if(tokensRegexComputed.sentences.length === 1
                && tokensRegexComputed.sentences[0].length === 0 ) {
                content = "Je n'ai pas compris votre demande !";
            }
            else {
                content = "Vous recherché un mail";
                pattern = `[tag:"NNP"]`;
                tokensRegexComputed = JSON.parse(await tokensRegex(String(textInputOption.value), port, pattern, annotations));

                if(tokensRegexComputed.sentences.length === 1 && tokensRegexComputed.sentences[0].length === 0 ) {
                    content += "Je n'ai pas trouvé de destinataire !";
                }
                else {
                    const name = tokensRegexComputed.sentences[0]['1'].text;
                    const firstname = tokensRegexComputed.sentences[0]['0'].text;
                    content += `J'ai compris que vous cherchier celui de ${firstname} ${name} ...`;
                    const email = students.find(student => student.name === name && student.firstname === firstname)
                    content += email ? `\nJ'ai trouver ${email.email}` : `Je n'ai pas trouver de mail pour cette personne`;
                }
            }
        }

        await interaction.followUp({
            ephemeral: true,
            content,
        });
    },
};

/**
 * Requete un NLPCore server
 * @param text
 * @param port
 * @param path
 * @param pattern
 * @param annotators
 */
const parse = async (text :string, port :number, path :string, pattern :string, annotators :string) => {
    const nlpServerUrl = `localhost:${port}`;
    const havePattern = pattern !== '' ? `pattern=${pattern}&` : '';
    const properties = `properties={"annotators": "${annotators}", "outputFormat": "json"}`;
    const cmd = `output=$(wget --post-data '${text}' '${nlpServerUrl}/${path}?${havePattern}${properties}' -qO -) && echo $output`;

    let output = execSync(cmd,{ encoding: 'utf8' });
    output = output.replace(/(\r\n|\n|\r)/gm, ''); // Need to fix JSON response

    return output;
};

/**
 * Requete un NLPCore serveur pour avoir le filtrage d'un text
 * @param text
 * @param port
 * @param pattern
 * @param annotators
 */
const tokensRegex = async (text :string, port :number, pattern :string, annotators :string) => {
    return await parse(text, port, 'tokensregex', pattern, annotators);
};

/**
 * Requete un NLPCore serveur pour avoir l'annotation d'un text
 * @param text
 * @param port
 * @param annotators
 */
const annotation = async (text :string, port :number, annotators :string) => {
    return await parse(text, port, '', '', annotators);
};