// DotEnv
import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";
import chat from "./commands/chat.js";
import coinhunt from "./commands/minigames/coinhunt/coinhunt.js";
import stacks from "./commands/minigames/stacks/stacks.js";
import help from "./commands/help.js";
import choose from "./commands/choose.js";
import avatar from "./commands/avatar.js";
import ping from "./commands/ping.js";
import ask from "./commands/ask.js";

const client = new Client({
    partials: ["MESSAGE", "REACTION"],
});
const PREFIX = "$";

client.on("ready", () => {
    client.user.setActivity({
        name: "$help",
        type: "PLAYING",
    });
    console.log(`${client.user.username} has logged in.`);
});

client.on("message", async (msg) => {
    if (msg.author.bot) return;
    if (msg.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = msg.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        switch (CMD_NAME.toLowerCase()) {
            // Coinhunt
            case "ch":
            case "coinhunt":
                coinhunt(
                    client,
                    msg.channel.id,
                    msg.author.id,
                    args[0],
                    msg.guild.id
                );
                break;

            // Cleverbot
            case "chat":
                chat(client, msg.channel.id, msg.author.id, args[0]);
                break;

            // Help
            case "help":
                help(client, msg.channel.id);
                break;

            // Choose
            case "choose":
            case "choice":
                choose(client, msg.channel.id, args);
                break;

            // Avatar tools
            case "avatar":
                avatar(msg, args);
                break;

            // Ping
            case "ping":
                ping(client, msg.channel.id, msg.createdTimestamp);
                break;

            // Ask
            case "ask":
                ask(client, msg.channel.id, args);
                break;

            // Stacks
            case "stacks":
            case "st":
                stacks(client, msg.channel.id, msg.author.id, args[0]);
                break;

            // Idk why i even put this here
            case "joe":
                msg.channel.send("joe mama");
                break;

            // Default
            default:
                msg.channel.send("Mate you should check your command.");
                break;
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
