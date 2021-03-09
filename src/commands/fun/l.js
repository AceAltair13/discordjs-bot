import { emoji } from "../../common/constants.js";

export default async (msg, args) => {
    if (args[0]) {
        const user = msg.guild.members.cache.get(
            msg.mentions.members.first()
                ? msg.mentions.members.first().user.id
                : await msg.guild.members
                      .fetch({ query: args[0], limit: 1 })
                      .then((user) => user.first().id)
                      .catch(() => {})
        );
        var reply = "";
        if (user) {
            reply = `Get L'd ${emoji.l} ${user.user.toString()}`;
        } else {
            reply =
                `No such user found, have an L instead ${emoji.l}`;
        }
        msg.channel.send(reply);
    } else {
        msg.channel.send(`Get L'd ${emoji.l}`);
    }
};
