import {BaseCommandInteraction, Client, Interaction} from "discord.js";
import {Commands} from "../Commands";

/**
 * Process to trigger when application get an interaction
 * @param client
 */
export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if(interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

/**
 * Special process to handle slash command
 * @param client
 * @param interaction
 */
const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(command => command.name === interaction.commandName);
    if (!slashCommand) {
        await interaction.followUp({content: "An error occurred"});
        return;
    }

    await interaction.deferReply();
    slashCommand.run(client, interaction);
};