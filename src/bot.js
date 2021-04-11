// DotEnv
import dotenv from "dotenv";
dotenv.config();

// Imports
import { Client, MessageEmbed } from "discord.js";
import chat from "./commands/fun/chat.js";
import coinhunt from "./commands/minigames/coinhunt/coinhunt.js";
import stacks from "./commands/minigames/stacks/stacks.js";
import help from "./commands/utility/help.js";
import choose from "./commands/utility/choose.js";
import avatar from "./commands/utility/avatar.js";
import ping from "./commands/utility/ping.js";
import ask from "./commands/fun/ask.js";
import getL from "./commands/fun/l.js";

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
    // Exit if message is from bot
    if (msg.author.bot) return;

    // Parse the user message
    if (msg.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = msg.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        // Segregate the commands using switch-case
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
                help(client, msg.channel.id, args[0]);
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

            // Idk why did i even put this here
            case "joe":
                msg.channel.send("joe mama");
                break;

            case "l":
                getL(msg, args);
                break;

            // None of the above
            default:
                msg.channel.send("Mate you should check your command.");
                break;
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
