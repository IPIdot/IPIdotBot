import {BaseCommandInteraction, Client, GuildMember} from "discord.js";
import {Command} from "../Command";

export const Ping: Command = {
    name: "ping",
    description: "Reply with Pong",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const member = interaction.member;
        if(!member || !(member instanceof GuildMember)) {
            await interaction.followUp({content: "An error occured .!."});
            return;
        }

        const content = `Hello **${member.user.username}** ${member ? "*aka " + member.nickname + "*" : ""}, this reply make : __*${new Date(Date.now()).getMilliseconds() - interaction.createdAt.getMilliseconds()} ms*__ to come, pretty fast yeah.\n~~I almost forgot~~ : **Pong !**`;

        await interaction.followUp({
            ephemeral: false,
            content,
        });
    },
};