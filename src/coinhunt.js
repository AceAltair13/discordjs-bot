require("dotenv").config();
const mongoose = require("mongoose");
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
                await msg.awaitReactions((reactions, user) => reactions.emoji.name === "◀️" || reactions.emoji.name === "🔼" || reactions.emoji.name === "🔽" || reactions.emoji.name === "▶️" || reactions.emoji.name === "❌" && user.id === senderID, {
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
                        channel.send(`Your high score in CoinHunt is ${highscore}.`);
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
        default:
            channel.send("This argument does not exist for CoinHunt!");
            break;
    }
}