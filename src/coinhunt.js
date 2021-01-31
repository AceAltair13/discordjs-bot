const {
    CoinGame,
    Direction
} = require("./coingame");

const addReactionsAndStart = async (msg, reactions, senderID) => {
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
                });
        }
        const score = game.stats.coins + game.stats.moves;
        if (game.stats.moves === 0) {
            await msg.edit("```Uh oh, Game Over. Your score: " + score + "```")
        } else if (game.stats.coins === game.stats.max_coins) {
            await msg.edit("```Congratulations! You Win. Your Score: " + score + "```");
        }
        await msg.reactions.removeAll();
    }
}

module.exports = async (client, id, text, reactions = [], senderID) => {
    const channel = await client.channels.fetch(id);
    channel.send(text).then(async message => {
        try {
            addReactionsAndStart(message, reactions, senderID);
        } catch (err) {
            await message.edit("```There was an error, exiting.```");
            await message.reactions.removeAll();
        }
    });
}