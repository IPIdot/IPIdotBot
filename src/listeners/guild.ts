import {Client, Guild, TextChannel} from "discord.js";
import {Commands} from "../Commands";

export default (client: Client): void => {
    // Join new guild
    client.on("guildCreate", (guild) => {
        console.log('guildCreate', guild);
        let defaultChannel: TextChannel;
        guild.channels.cache.forEach((channel) => {
            if(channel.type === "GUILD_TEXT" && defaultChannel == undefined && guild.me != null) {
                if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                    defaultChannel = channel;
                    defaultChannel.send('Hello, Im a Bot!')
                    // TODO : refaire : crer un canal pour le bot ou autre, demande de setup du bot ?
                }
            }
        })
    });

    // A guild have updated his options
    client.on("guildUpdate", (oldGuild, newGuild) => {
        console.log('guildUpdate', oldGuild, newGuild);
    });

    // Expulse from guild
    client.on("guildDelete", async (guild) => {
        console.log('guildDelete', guild);
    });
};

export const currentJoinedGuilds = (client: Client): void => {
    client.guilds.fetch()
        .then(guilds => {
            guilds.forEach(guild => {
                console.log(`Connected to guild ${guild.name}`);
            })
        }).catch(error => console.log("An error occured :", error));
}