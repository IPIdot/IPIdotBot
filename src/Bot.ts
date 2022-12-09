import {Client} from 'discord.js';
import dotenv from "dotenv";
import * as process from "process";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import guild, {currentJoinedGuilds} from "./listeners/guild";
import {GatewayIntentBits} from "discord-api-types";

dotenv.config()

console.log("Bot is starting ...");

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

ready(client);
interactionCreate(client);

client.login(process.env.BOT_TOKEN)
    .then(() => {
        console.log("Bot is running ...");
        currentJoinedGuilds(client);
        guild(client);
    }).catch(error => {
        console.log(error)
    });