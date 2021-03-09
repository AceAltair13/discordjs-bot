import { MessageEmbed } from "discord.js";
import { getRandomColor } from "../../common/functions.js";
import { helpEmbeds} from "../../common/constants.js";

export default async (msg, args) => {
    var username = msg.author.username;
    var avatarURL = msg.author.avatarURL();
    if (args[0]) {
        if (args[0].toLowerCase() === "help") {
            msg.channel.send(helpEmbeds.avatar);
            return;
        }
        const user = msg.guild.members.cache.get(
            msg.mentions.members.first()
                ? msg.mentions.members.first().user.id
                : await msg.guild.members
                      .fetch({ query: args[0], limit: 1 })
                      .then((user) => user.first().id)
                      .catch(() => {})
        );
        if (user) {
            username = user.user.username;
            avatarURL = user.user.avatarURL();
        } else {
            msg.channel.send("Please check the argument.");
            return;
        }
    }
    const avatarEmbed = new MessageEmbed()
        .setColor(getRandomColor())
        .setDescription(username)
        .setImage(avatarURL);
    msg.channel.send(avatarEmbed);
};
