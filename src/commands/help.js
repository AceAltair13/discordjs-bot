import { MessageEmbed } from "discord.js";
import { getRandomColor } from "../common/functions.js";

export default async (client, id) => {
    const channel = await client.channels.fetch(id);
    const helpEmbed = new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("Help")
        .setDescription("**Syntax**\n`$<command> *args`")
        .addField(
            "Available Commands",
            "`coinhunt`, `chat`, `choice`, `avatar`, `ping`, `ask`, `stacks`, `joe`"
        )
        .setFooter("New commands will be added soon!")
        .setThumbnail("https://i.imgur.com/7qttfnm.gif");
    channel.send(helpEmbed);
};
