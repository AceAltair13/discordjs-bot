import { helpEmbeds} from "../common/constants.js";

const CHOICES = [
    "Yes 👍",
    "No 👎",
    "Probably 🤷",
    "Probably Not 🙇",
    "Definitely! ✋",
    "Definitely Not! 🤞",
];

export default async (client, id, args) => {
    const channel = await client.channels.fetch(id);
    if (args[0]) {
        const len = args.length;
        if (new RegExp("^\\?+$").test(args.join(""))) {
            channel.send("Don't just throw them ❔ at me, m8.");
        } else if (
            args[len - 1] === "?" ||
            args[len - 1].charAt(args[len - 1].length - 1) === "?"
        ) {
            channel.send(CHOICES[Math.floor(Math.random() * CHOICES.length)]);
        } else {
            channel.send("That doesn't look like a valid question, m8.");
        }
    } else {
        channel.send(helpEmbeds.ask);
    }
};
