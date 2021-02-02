const {
    StackGame
} = require("./stackgame");
const { MessageEmbed } = require("discord.js");

function getRandomColor() {
    return '#' + (Math.random() * (1 << 24) | 0).toString(16);
}

const addReactionsAndStart = async (msg, reactions, senderID) => {
    try {
        await msg.react(reactions[0]);
        reactions.shift();
        if (reactions.length > 0) {
            setTimeout(() => addReactionsAndStart(msg, reactions, senderID), 100);
        } else {
            const game = new StackGame();
            var moves = 0
            const choiceArr = [];
            await msg.edit(`${game.renderMap(-1, moves, " ")}`);
            while (!game.playerWin()) {
                await msg.awaitReactions((reactions, user) => reactions.emoji.name === "0️⃣" || reactions.emoji.name === "1️⃣" || reactions.emoji.name === "2️⃣" || reactions.emoji.name === "3️⃣" || reactions.emoji.name === "❌" && user.id === senderID, {
                        time: 60
                    })
                    .then(async r => {

                        async function moveStack(pos) {
                            // console.log(pos);
                            // console.log(choiceArr);
                            if(!(choiceArr[0]+1)) {
                                choiceArr.push(pos);
                                await msg.edit(`${game.renderMap(choiceArr[0], moves, "⭡")}`);
                            } else {
                                game.move(choiceArr[0], pos);
                                moves++;
                                choiceArr.shift();
                                await msg.edit(`${game.renderMap(pos, moves, "⭣")}`);
                            }
                        }

                        if(r.first()) {
                            const choice = r.first().emoji.name;
                            if (choice === '❌') {
                                await msg.reactions.removeAll();
                                await msg.edit("```\nYou quit the game!\n```");
                                return;
                            }
                            switch(choice) {
                                case '0️⃣':
                                    moveStack(0);
                                    break;

                                case '1️⃣':
                                    moveStack(1);
                                    break;

                                case '2️⃣':
                                    moveStack(2);
                                    break;

                                case '3️⃣':
                                    moveStack(3);
                                    break;
                            }
                            await msg.reactions.resolve(choice).users.remove(senderID).catch((er) => {console.log(er)});
                        }
                    })
                    .catch((er) => {console.log(er)});
            }
            await msg.edit("```\n" + `Congratulations! You win with ${moves} moves.` + "```");
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

        // Start
        case 'play':
        case 'start':
            channel.send("```Loading...```").then(async message => {
                try {
                    addReactionsAndStart(message, ['❌', '0️⃣', '1️⃣', '2️⃣', '3️⃣'], senderID);
                } catch (err) {
                    await message.edit("```There was an error, exiting.```");
                    await message.reactions.removeAll();
                }
            });
            break;

        case 'help':
        case undefined:
            const stackEmbed = new MessageEmbed()
            .setTitle("Stacks!")
            .setColor(getRandomColor())
            .setDescription("Usage:\n`$stacks <args>`\n_or_\n`$st <args>`")
            .addField("What is Stacks!?", "Stacks is a game where you are given jumbled stacks of different letters and you have to arrange them so that all stacks contain only one kind of letter, or no letter at all. Only same letters can be dropped on each other!")
            .addField("Arguments", "`play` _or_ `start`\nStarts a game of Stacks!")
            .setFooter("Unjumble the jumbled stacks!")
            channel.send(stackEmbed);
            break;
    }
}