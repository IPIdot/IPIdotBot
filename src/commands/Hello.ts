import {BaseCommandInteraction, Client} from "discord.js";
import {Command} from "../Command";

export const Hello: Command = {
    name: "hello",
    description: "Return Hello",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Hello dude !";

        await interaction.followUp({
            ephemeral: true,
            content,
        });
    },
};