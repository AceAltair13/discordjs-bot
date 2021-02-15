import { MessageEmbed } from "discord.js";
import { getRandomColor } from "../common/functions.js";

export default async (msg, args) => {
    var username = msg.author.username;
    var avatarURL = msg.author.avatarURL();
    if (args[0]) {
        if (args[0] === "help") {
            const avatarHelpEmbed = new MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("Display Avatar")
                .setDescription(
                    "Usage\n`$display`\n_or_\n`$display <mentioned_user>`"
                )
                .setFooter("Fetches and displays the avatar of the user.");
            msg.channel.send(avatarHelpEmbed);
            return;
        }
        const user = msg.guild.members.cache.get(
            msg.mentions.members.first().user.id || args[0]
        );
        if (user) {
            username = user.user.username;
            avatarURL = user.user.avatarURL();
        } else {
            msg.channel.send("Please check the user ID.");
            return;
        }
    }
    const avatarEmbed = new MessageEmbed()
        .setColor(getRandomColor())
        .setDescription(username)
        .setImage(avatarURL);
    msg.channel.send(avatarEmbed);
};
