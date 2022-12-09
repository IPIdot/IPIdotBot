import {BaseCommandInteraction, Client} from "discord.js";
import {Command} from "../Command";

export const Help: Command = {
    name: "help",
    description: "Reply with help for bot usage",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {

        const content = `edt url : Get edt web url\n
        /edt teams_url : Get team current main url\n
        \n
        /resource logo : Give requested logo\n
        /resources calendar : Give requested calendar in asked format\n
        /resources links : The link you want\n
        \n
        /self manage check : Check your account into our service\n
        /self manage remove : Remove your account from our service\n
        /self manage update : Update your account (firstname, lastname)\n
        /self register : Register yourself into our service if is not already done`

        await interaction.followUp({
            ephemeral: true,
            content,
        });
    },
};