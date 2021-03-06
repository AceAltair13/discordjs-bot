import { StackGame } from "./stackgame.js";
import { helpEmbeds} from "../../../common/constants.js";

const addReactionsAndStart = async (msg, reactions, senderID) => {
    try {
        await msg.react(reactions[0]);
        reactions.shift();
        if (reactions.length > 0) {
            setTimeout(
                () => addReactionsAndStart(msg, reactions, senderID),
                100
            );
        } else {
            const game = new StackGame();
            var moves = 0;
            const choiceArr = [];
            await msg.edit(`${game.renderMap(-1, moves, " ")}`);
            while (!game.playerWin()) {
                await msg
                    .awaitReactions(
                        (reactions, user) =>
                            ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "❌"].includes(
                                reactions.emoji.name
                            ) && user.id === senderID,
                        {
                            time: 200,
                        }
                    )
                    .then(async (r) => {
                        function moveStack(pos) {
                            if (!(choiceArr[0] + 1)) {
                                choiceArr.push(pos);
                                msg.edit(
                                    `${game.renderMap(
                                        choiceArr[0],
                                        moves,
                                        "⭡"
                                    )}`
                                );
                            } else {
                                game.move(choiceArr[0], pos);
                                moves++;
                                choiceArr.shift();
                                msg.edit(`${game.renderMap(pos, moves, "⭣")}`);
                            }
                        }

                        if (r.first()) {
                            const choice = r.first().emoji.name;
                            if (choice === "❌") {
                                await msg.reactions.removeAll();
                                await msg.edit("```\nYou quit the game!\n```");
                                return;
                            }
                            switch (choice) {
                                case "0️⃣":
                                    moveStack(0);
                                    break;

                                case "1️⃣":
                                    moveStack(1);
                                    break;

                                case "2️⃣":
                                    moveStack(2);
                                    break;

                                case "3️⃣":
                                    moveStack(3);
                                    break;
                            }
                            await msg.reactions
                                .resolve(choice)
                                .users.remove(senderID)
                                .catch((er) => {
                                    console.log(er);
                                });
                        }
                    })
                    .catch((er) => {
                        console.log(er);
                    });
            }
            await msg.edit(
                "```\n" +
                    `Congratulations! You win with ${moves} moves.` +
                    "\n```"
            );
            await msg.reactions.removeAll();
        }
    } catch (er) {
        console.log(er);
        await msg.edit("```\nThere was an error! Quiting...\n```");
        await msg.reactions.removeAll();
    }
};

export default async (client, id, senderID, arg) => {
    const channel = await client.channels.fetch(id);

    switch (arg) {
        // Start
        case "play":
        case "start":
            channel.send("```\nLoading...\n```").then(async (message) => {
                try {
                    addReactionsAndStart(
                        message,
                        ["❌", "0️⃣", "1️⃣", "2️⃣", "3️⃣"],
                        senderID
                    );
                } catch (err) {
                    await message.edit("```\nThere was an error, exiting.\n```");
                    await message.reactions.removeAll();
                }
            });
            break;

        case "help":
        case undefined:
            channel.send(helpEmbeds.stacks);
            break;
    }
};
