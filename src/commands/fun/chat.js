import cleverbot from "cleverbot-free";
import { helpEmbeds} from "../../common/constants.js";

// Timeout Limit Units
const timeoutUnitLimit = 60;

// Default Export
export default async (client, id, senderID, arg) => {
    const channel = await client.channels.fetch(id);
    switch (arg) {
        case "start":
            const chatContext = [];
            var timeoutUnits = 0;
            var endChat = false;
            channel
                .send(
                    "```\nChat mode activated. Send a message to start chat.\n```"
                )
                .then(async () => {
                    while (!endChat && timeoutUnits < timeoutUnitLimit) {
                        await channel
                            .awaitMessages((m) => m.author.id === senderID, {
                                max: 1,
                                time: 1000,
                            })
                            .then((chatMsg) => {
                                if (chatMsg.first()) {
                                    timeoutUnits = 0;
                                    var chat = chatMsg.first().content;
                                    if (chat.toLowerCase() === "$chat start") {
                                        channel.send(
                                            "```\nA chat session is already active\n```"
                                        );
                                        endChat = true;
                                    } else if (
                                        chat.toLowerCase() === "$chat end"
                                    ) {
                                        endChat = true;
                                    } else {
                                        if (!chatContext[0]) {
                                            chatContext.push(chat);
                                            cleverbot(chat)
                                                .then((rep) => {
                                                    chatContext.push(rep);
                                                    channel.startTyping();
                                                    setTimeout(() => {
                                                        channel.send(rep);
                                                        channel.stopTyping();
                                                    }, Math.random() * (1 - 3) + 1 * 1000);
                                                })
                                                .catch((er) => {
                                                    console.log(er);
                                                });
                                        } else {
                                            chatContext.push(chat);
                                            cleverbot(chat, chatContext)
                                                .then((rep) => {
                                                    chatContext.push(rep);
                                                    channel.startTyping();
                                                    setTimeout(() => {
                                                        channel.send(rep);
                                                        channel.stopTyping();
                                                    }, Math.random() * (1 - 3) + 1 * 1000);
                                                })
                                                .catch((er) => {
                                                    console.log(er);
                                                });
                                        }
                                    }
                                } else {
                                    timeoutUnits++;
                                }
                            })
                            .catch((er) => {
                                console.log(er);
                                console.log(timeoutUnits);
                                timeoutUnits++;
                            });
                    }
                    if (timeoutUnits === timeoutUnitLimit) {
                        channel.send("```\nChat ended due to inactivity!\n```");
                    } else {
                        channel.send("```\nChat session ended.\n```");
                    }
                    // console.log(chatContext);
                });
            break;

        case "help":
        case undefined:
            channel.send(helpEmbeds.chat);
            break;
    }
};
