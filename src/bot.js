require("dotenv").config();

function getRandomColor() {
    return '#' + (Math.random() * (1 << 24) | 0).toString(16);
}

const CHOICES = ["Yes 👍", "No 👎", "Probably 🤷", "Probably Not 🙇", "Definitely! ✋", "Definitely Not! 🤞"];

const {
    Client,
    MessageEmbed,
} = require("discord.js");
const client = new Client({
    partials: ['MESSAGE', 'REACTION'],
});
const cleverbot = require("cleverbot-free");
const coinhunt = require("./coinhunt");
const stacks = require("./stacks");
const PREFIX = "$";

client.on("ready", () => {
    client.user.setActivity({
        name: "$help",
        type: "PLAYING"
    });
    console.log(`${client.user.username} has logged in.`);
})

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
                coinhunt(client, msg.channel.id, msg.author.id, args[0], msg.guild.id);
                break;

            // Cleverbot
            case "chat":
                if (!args[0]) {
                    const chatEmbed = new MessageEmbed()
                        .setColor(0xd1d119)
                        .setTitle("Chat with Cleverbot")
                        .setDescription("Usage\n`$chat <message>`")
                        .setFooter("Sends and retrieves message from Cleverbot API");
                    msg.channel.send(chatEmbed);
                } else {
                    try {
                        cleverbot(args.join(" "))
                            .then((response) => {
                                msg.channel.startTyping();
                                setTimeout(() => {
                                    msg.channel.send(response).catch(console.error);
                                    msg.channel.stopTyping();
                                }, Math.random() * (1 - 3) + 1 * 1000)
                            })
                    } catch (err) {
                        msg.channel.send("There was an error!");
                    };
                }
                break;

            // Help
            case "help":
                const helpEmbed = new MessageEmbed()
                    .setColor(getRandomColor())
                    .setTitle("Help")
                    .setDescription("**Syntax**\n`$<command> *args`")
                    .addField("Available Commands", "`coinhunt`, `chat`, `choice`, `avatar`, `ping`, `ask`, `stacks`, `joe`")
                    .setFooter("New commands will be added soon!")
                    .setThumbnail("https://i.imgur.com/7qttfnm.gif");
                msg.channel.send(helpEmbed);
                break;

            // Choose
            case "choose":
            case "choice":
                if (args[0]) {
                    msg.channel.send(args[Math.floor(Math.random() * args.length)]);
                } else {
                    const choiceEmbed = new MessageEmbed()
                        .setColor(getRandomColor())
                        .setTitle("Choice Picker")
                        .setDescription("Usage\n`$choose choice1, choice2, ...`\n_or_\n`$choice choice1, choice2, ...`")
                        .setFooter("Selects a random item from the choices.");
                    msg.channel.send(choiceEmbed);
                }
                break;

            // Avatar tools
            case "avatar":
                var username = msg.author.username;
                var avatarURL = msg.author.avatarURL();
                if (args[0]) {
                    if (args[0] === "help") {
                        const avatarHelpEmbed = new MessageEmbed()
                            .setColor(getRandomColor())
                            .setTitle("Display Avatar")
                            .setDescription("Usage\n`$display`\n_or_\n`$display <mentioned_user>`")
                            .setFooter("Fetches and displays the avatar of the user.");
                        msg.channel.send(avatarHelpEmbed);
                        return;
                    }
                    const user = msg.guild.members.cache.get(msg.mentions.members.first().user.id || args[0]);
                    if (user) {
                        username = user.user.username;
                        avatarURL = user.user.avatarURL();
                    } else {
                        msg.channel.send("Please check the user ID.");
                        return;
                    }
                }
                const avatarEmbed = new MessageEmbed()
                    .setColor(getRandomColor())
                    .setDescription(username)
                    .setImage(avatarURL);
                msg.channel.send(avatarEmbed);
                break;

            // Ping
            case "ping":
                msg.channel.send("Pinging...")
                    .then((m) => {
                        m.delete();
                        const pingEmbed = new MessageEmbed()
                            .setTitle((m.createdTimestamp - msg.createdTimestamp) + "ms")
                            .setColor(getRandomColor())
                            .setDescription("Pong 🏓")
                            .setFooter(`API Latency: ${client.ws.ping}ms`);
                        msg.channel.send(pingEmbed);
                    });
                break;

            // Ask
            case "ask":
                if (args[0]) {
                    const len = args.length;
                    if (new RegExp("^\\?+$").test(args.join(""))) {
                        msg.channel.send("Don't just throw them ❔ at me, m8.");
                    } else if (args[len - 1] === "?" || args[len - 1].charAt(args[len - 1].length - 1) === "?") {
                        msg.channel.send(CHOICES[Math.floor(Math.random() * CHOICES.length)]);
                    } else {
                        msg.channel.send("That doesn't look like a valid question, m8.");
                    }
                } else {
                    const askEmbed = new MessageEmbed()
                        .setColor(getRandomColor())
                        .setTitle("Ask Bot")
                        .setDescription("Usage\n`$ask <question>`")
                        .setFooter("Bot replies to a Yes-No question.");
                    msg.channel.send(askEmbed);
                }
                break;

            // Stacks
            case 'stacks':
            case 'st':
                stacks(client, msg.channel.id, msg.author.id, args[0]);
                break;

            // Joe Mama
            case 'joe':
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