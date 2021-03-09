import { MessageEmbed } from "discord.js";
import { getRandomColor } from "../../common/functions.js";

export default async (client, id, createdTimestamp) => {
    const channel = await client.channels.fetch(id);
    channel.send("Pinging...").then((m) => {
        m.delete();
        const pingEmbed = new MessageEmbed()
            .setTitle(m.createdTimestamp - createdTimestamp + "ms")
            .setColor(getRandomColor())
            .setDescription("Pong 🏓")
            .setFooter(`API Latency: ${client.ws.ping}ms`);
        channel.send(pingEmbed);
    });
};
