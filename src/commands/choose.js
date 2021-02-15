import { MessageEmbed } from "discord.js";
import { getRandomColor } from "../common/functions.js";

export default async (client, id, args) => {
    const channel = await client.channels.fetch(id);
    if (args[0]) {
        channel.send(args[Math.floor(Math.random() * args.length)]);
    } else {
        const choiceEmbed = new MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("Choice Picker")
            .setDescription(
                "Usage\n`$choose choice1 choice2 ...`\n_or_\n`$choice choice1 choice2 ...`"
            )
            .setFooter("Selects a random item from the choices.");
        channel.send(choiceEmbed);
    }
};
