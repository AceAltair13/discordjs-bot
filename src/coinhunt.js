require("dotenv").config();
const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js")
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const {
    CoinGame,
    Direction
} = require("./coingame");
const coinhuntPlayerSchema = new mongoose.Schema({
    userid: String,
    score: Number,
    maxscore: {
        type: Number,
        default: 0
    }
})
const CoinhuntPlayer = new mongoose.model("CoinhuntPlayer", coinhuntPlayerSchema);

function getRandomColor() {
    return '#' + (Math.random() * (1 << 24) | 0).toString(16);
}

function updateScore(senderID, userscore) {
    CoinhuntPlayer.find({
        userid: senderID
    }, (e, retrieve) => {
        if (e) {
            console.log(e);
        } else {
            if (retrieve[0]) {
                const prevScore = retrieve[0].score;
                const prevMaxScore = retrieve[0].maxscore;

                if (prevMaxScore < userscore) {
                    CoinhuntPlayer.updateOne({
                        userid: senderID
                    }, {
                        score: prevScore + userscore,
                        maxscore: userscore
                    }, err => {
                        if (err) console.log(err);
                    })
                } else {
                    CoinhuntPlayer.updateOne({
                        userid: senderID
                    }, {
                        score: prevScore + userscore
                    }, err => {
                        if (err) console.log(err);
                    })
                }
            } else {
                const newPlayer = new CoinhuntPlayer({
                    userid: senderID,
                    score: userscore,
                    maxscore: userscore
                });
                newPlayer.save();
            }
        }
    });
}

const addReactionsAndStart = async (msg, reactions, senderID) => {
    try {
        await msg.react(reactions[0]);
        reactions.shift();
        if (reactions.length > 0) {
            setTimeout(() => addReactionsAndStart(msg, reactions, senderID), 100);
        } else {
            const game = new CoinGame();
            await msg.edit(`${game.renderMap()}`);
            while (game.stats.moves > 0 && game.stats.coins < game.stats.max_coins) {
                await msg.awaitReactions((reactions, user) => (reactions.emoji.name === "◀️" || reactions.emoji.name === "🔼" || reactions.emoji.name === "🔽" || reactions.emoji.name === "▶️" || reactions.emoji.name === "❌") && user.id === senderID, {
                        time: 60
                    })
                    .then(async (r) => {
                        if (r.first()) {
                            var direction;
                            const choice = r.first().emoji.name;
                            if (choice === '❌') {
                                await msg.reactions.removeAll();
                                await msg.edit("```\nGame was cancelled\n```");
                                return;
                            }
                            switch (choice) {
                                case '🔼':
                                    direction = Direction.up;
                                    break;
                                case '🔽':
                                    direction = Direction.down;
                                    break;
                                case '◀️':
                                    direction = Direction.left;
                                    break;
                                case '▶️':
                                    direction = Direction.right;
                                    break;
                            }
                            game.movePlayer(direction);
                            await msg.edit(`${game.renderMap()}`);
                            await msg.reactions.resolve(choice).users.remove(senderID).catch(() => {});
                        }
                    })
                    .catch(() => {});
            }
            const score = game.stats.coins + game.stats.moves;
            if (game.stats.moves === 0) {
                await msg.edit("```Uh oh, Game Over. Your score: " + score + "```");
                updateScore(senderID, score);
            } else if (game.stats.coins === game.stats.max_coins) {
                await msg.edit("```Congratulations! You Win. Your Score: " + score + "```");
                updateScore(senderID, score);
            }
            await msg.reactions.removeAll();
        }
    } catch (er) {
        console.log(er);
        await msg.edit("```There was an error! Quiting...```");
        await msg.reactions.removeAll();
    }
}

module.exports = async (client, id, senderID, arg) => {
    const channel = await client.channels.fetch(id);
    switch (arg) {

        // Start CoinHunt
        case 'play':
        case 'start':
            channel.send("```Loading...```").then(async message => {
                try {
                    addReactionsAndStart(message, ['❌', '◀️', '🔼', '🔽', '▶️'], senderID);
                } catch (err) {
                    await message.edit("```There was an error, exiting.```");
                    await message.reactions.removeAll();
                }
            });
            break;

        // User Highscore  
        case 'highscore':
        case 'hs':
            CoinhuntPlayer.find({
                userid: senderID
            }, async (e, re) => {
                if (e) {
                    console.log(e);
                } else {
                    if (re[0]) {
                        const highscore = re[0].maxscore;
                        channel.send(`Your high score in coinhunt is ${highscore}.`);
                    } else {
                        channel.send("You have not started playing yet!");
                    }
                }
            });
            break;

        // Global Leaderboard
        case 'leaderboard':
        case 'lb':
            channel.send("This feature is currently in development 👷.");
            break;

        // Help
        case 'help':
        case undefined:
            const coinhuntEmbed = new MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("CoinHunt")
                .setDescription("Usage:\n`$coinhunt <args>`\n_or_\n`$ch <args>`")
                .addField("What is coinhunt?", "It is a small minigame where main objective is to collect coins in limited number of moves.\n```\n[@] : Player\n[·] : Visited\n[○] : Coin\n[+] : Power-Ups (+5 Moves)\n[R] : Reveal-Shard\n```")
                .addField("Arguments", "`play` _or_ `start`\nStarts a game of coinhunt\n`highscore/hs`\nShows the user's highscore.\n`leaderboard/lb`\nDisplays the leaderboard.")
                .setFooter("A mini game where you try to collect all the coins in limited number of moves.")
                .setThumbnail("https://control.do/wp-content/uploads/2020/09/coin.gif");
            channel.send(coinhuntEmbed);
            break;

        default:
            channel.send("This argument does not exist for coinhunt!");
            break;
    }
}