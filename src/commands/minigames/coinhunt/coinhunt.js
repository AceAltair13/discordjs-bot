// Dotenv
import dotenv from "dotenv";
dotenv.config();

// Imports
import pkg from "mongoose";
const { connect, Schema, model } = pkg;
import { MessageEmbed } from "discord.js";
connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
import { CoinGame, Direction } from "./coingame.js";
import { getRandomColor } from "../../../common/functions.js";
import { helpEmbeds, assetsLinks } from "../../../common/constants.js";

const coinhuntPlayerSchema = new Schema({
    userid: String,
    score: Number,
    guildid: String,
    maxscore: {
        type: Number,
        default: 0,
    },
});
const CoinhuntPlayer = new model("CoinhuntPlayer", coinhuntPlayerSchema);

function updateScore(senderID, userscore, guildid) {
    CoinhuntPlayer.find(
        {
            userid: senderID,
            guildid: guildid,
        },
        (e, retrieve) => {
            if (e) {
                console.log(e);
            } else {
                if (retrieve[0]) {
                    const prevScore = retrieve[0].score;
                    const prevMaxScore = retrieve[0].maxscore;

                    if (prevMaxScore < userscore) {
                        CoinhuntPlayer.updateOne(
                            {
                                userid: senderID,
                                guildid: guildid,
                            },
                            {
                                score: prevScore + userscore,
                                maxscore: userscore,
                            },
                            (err) => {
                                if (err) console.log(err);
                            }
                        );
                    } else {
                        CoinhuntPlayer.updateOne(
                            {
                                userid: senderID,
                                guildid: guildid,
                            },
                            {
                                score: prevScore + userscore,
                            },
                            (err) => {
                                if (err) console.log(err);
                            }
                        );
                    }
                } else {
                    const newPlayer = new CoinhuntPlayer({
                        userid: senderID,
                        score: userscore,
                        maxscore: userscore,
                        guildid: guildid,
                    });
                    newPlayer.save();
                }
            }
        }
    );
}

const addReactionsAndStart = async (msg, reactions, senderID, guildid) => {
    try {
        await msg.react(reactions[0]);
        reactions.shift();
        if (reactions.length > 0) {
            setTimeout(
                () => addReactionsAndStart(msg, reactions, senderID, guildid),
                100
            );
        } else {
            const game = new CoinGame();
            await msg.edit(`${game.renderMap()}`);
            while (
                game.stats.moves > 0 &&
                game.stats.coins < game.stats.max_coins
            ) {
                await msg
                    .awaitReactions(
                        (reactions, user) =>
                            ["◀️", "🔼", "🔽", "▶️", "❌"].includes(
                                reactions.emoji.name
                            ) && user.id === senderID,
                        {
                            time: 200,
                        }
                    )
                    .then(async (r) => {
                        if (r.first()) {
                            var direction;
                            const choice = r.first().emoji.name;
                            if (choice === "❌") {
                                await msg.reactions.removeAll();
                                await msg.edit("```\nGame was cancelled\n```");
                                return;
                            }
                            switch (choice) {
                                case "🔼":
                                    direction = Direction.up;
                                    break;
                                case "🔽":
                                    direction = Direction.down;
                                    break;
                                case "◀️":
                                    direction = Direction.left;
                                    break;
                                case "▶️":
                                    direction = Direction.right;
                                    break;
                            }
                            game.movePlayer(direction);
                            await msg.edit(`${game.renderMap()}`);
                            await msg.reactions
                                .resolve(choice)
                                .users.remove(senderID)
                                .catch(() => {});
                        }
                    })
                    .catch(() => {});
            }
            const score = game.stats.coins + game.stats.moves;
            if (game.stats.moves === 0) {
                await msg.edit(
                    "```\nUh oh, Game Over. Your score: " + score + "\n```"
                );
                updateScore(senderID, score, guildid);
            } else if (game.stats.coins === game.stats.max_coins) {
                await msg.edit(
                    "```\nCongratulations! You Win. Your Score: " +
                        score +
                        "\n```"
                );
                updateScore(senderID, score, guildid);
            }
            // console.log("addReactionsAndStart: " + guildid);
            await msg.reactions.removeAll();
        }
    } catch (er) {
        console.log(er);
        await msg.edit("```\nThere was an error! Quiting...\n```");
        await msg.reactions.removeAll();
    }
};

export default async (client, id, senderID, arg, guildid) => {
    const channel = await client.channels.fetch(id);
    switch (arg) {
        // Start CoinHunt
        case "play":
        case "start":
            channel.send("```Loading...```").then(async (message) => {
                try {
                    addReactionsAndStart(
                        message,
                        ["❌", "◀️", "🔼", "🔽", "▶️"],
                        senderID,
                        guildid
                    );
                } catch (err) {
                    await message.edit("```There was an error, exiting.```");
                    await message.reactions.removeAll();
                }
            });
            break;

        // User Highscore
        case "highscore":
        case "hs":
            CoinhuntPlayer.find(
                {
                    userid: senderID,
                },
                async (e, re) => {
                    if (e) {
                        console.log(e);
                    } else {
                        if (re[0]) {
                            const highscore = re[0].maxscore;
                            channel.send(
                                `Your high score in coinhunt is ${highscore}.`
                            );
                        } else {
                            channel.send("You have not started playing yet!");
                        }
                    }
                }
            );
            break;

        // Global Leaderboard
        case "leaderboard":
        case "lb":
            if (channel.type === "dm") {
                channel.send("Leaderboards are not available in DMs.");
            } else {
                CoinhuntPlayer.find({
                    guildid: guildid,
                })
                    .sort("-maxscore")
                    .limit(10)
                    .exec(async (err, results) => {
                        if (err) {
                            console.log(err);
                            // mongoose.connection.close();
                        } else {
                            if (!results[0]) {
                                channel.send(
                                    "Leaderboard for this server is empty."
                                );
                            } else {
                                var newRow =
                                    "```\n╔══════╦══════════════════════╦═══════════╗\n║ Rank ║         Name         ║ HighScore ║\n╠══════╬══════════════════════╬═══════════╣\n";
                                for (var item in results) {
                                    newRow += "║ ";
                                    const rank = parseInt(item) + 1;
                                    var space = 4 - rank.toString().length;
                                    var user = channel.guild.members.cache.get(
                                        results[item].userid
                                    );
                                    if (user) {
                                        user = user.user.username.slice(0, 20);
                                    } else {
                                        user = await channel.guild.members
                                            .fetch(results[item].userid)
                                            .then((user) => {
                                                return user.user.username.slice(
                                                    0,
                                                    20
                                                );
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                    }
                                    while (space) {
                                        newRow += " ";
                                        space--;
                                    }
                                    space = 20 - user.length;
                                    newRow += rank + ` ║ ${user}`;
                                    while (space) {
                                        newRow += " ";
                                        space--;
                                    }
                                    newRow += " ║ ";
                                    space =
                                        9 -
                                        results[item].maxscore.toString()
                                            .length;
                                    while (space) {
                                        newRow += " ";
                                        space--;
                                    }
                                    newRow += `${results[item].maxscore} ║\n`;
                                }
                                newRow +=
                                    "╚══════╩══════════════════════╩═══════════╝\n```";
                                const chlbEmbed = new MessageEmbed()
                                    .setAuthor(
                                        "Coinhunt Leaderboard",
                                        assetsLinks.coinhunt
                                    )
                                    .setDescription(newRow)
                                    .setColor(getRandomColor());
                                channel.send(chlbEmbed);
                            }
                        }
                    });
            }
            break;

        // Help
        case "help":
        case undefined:
            channel.send(helpEmbeds.coinhunt);
            break;

        default:
            channel.send("This argument does not exist for coinhunt!");
            break;
    }
};
