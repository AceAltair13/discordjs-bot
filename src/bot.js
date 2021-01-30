require("dotenv").config();
// const EMOJIS = ('❌', '◀️', '🔼', '🔽', '▶️');

function getRandomColor() {
    return '#' + (Math.random() * (1 << 24) | 0).toString(16);
}

const {
    Client,
    MessageEmbed,
} = require("discord.js");
const client = new Client({
    partials: ['MESSAGE', 'REACTION'],
});
const PREFIX = "$";

const cleverbot = require("cleverbot-free");

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

        switch (CMD_NAME) {

            // Coinhunt
            case "coinhunt":
                if (args[0] === "help" || !args[0]) {
                    msg.channel.send("Welcome to coinhunt! This game is currently in development. ◀️ 🔼 🔽 ▶️");
                } else {
                    switch (args[0]) {
                        case "play":
                            msg.channel.send("This game is currently in developement.");
                            break;
                        case "highscore":
                        case "hs":
                        case "leaderboard":
                        case "lb":
                            msg.channel.send("This feature is currently in development.");
                            break;
                    }
                };
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
                    .addField("Coinhunt", "`$coinhunt`", true)
                    .addField("Cleverbot", "`$chat`", true)
                    .addField("Choice", "`$choice`", true)
                    .addField("Avatar", "`$avatar`", true)
                    .setFooter("New commands to be added soon!")
                    .setThumbnail("https://i.imgur.com/7qttfnm.gif");
                // msg.channel.send("```Syntax:\n=======\n$<command> <optional args>```");
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
                // console.log("command activated");
                var username = msg.author.username;
                var avatarURL = msg.author.avatarURL();
                if (args[0]) {
                    if(args[0] === "help") {
                        const avatarHelpEmbed = new MessageEmbed()
                        .setColor(getRandomColor())
                        .setTitle("Display Avatar")
                        .setDescription("Usage\n`$display`\n_or_\n`$display <mentioned_user>`")
                        .setFooter("Fetches and displays the avatar of the user.");
                        msg.channel.send(avatarHelpEmbed);
                        return;
                    }
                    const user = msg.guild.members.cache.get(msg.mentions.members.first().user.id || args[0]);
                    // console.log(args[0]);
                    // console.log(user);
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
                .then( (m) => {
                    const pingEmbed = new MessageEmbed()
                    .setTitle((m.createdTimestamp - msg.createdTimestamp) + "ms")
                    .setColor(getRandomColor())
                    .setDescription(`API Latency: ${client.ws.ping}ms`)
                    .setFooter("Pong 🏓");
                    msg.channel.send(pingEmbed);
                });
                break;
        }

    }
});

client.login(process.env.DISCORD_BOT_TOKEN);