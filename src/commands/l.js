export default async (msg, args) => {
    const emojiL = msg.client.emojis.cache.get("717681809768448121");
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
            reply = `Get L'd ${emojiL} ${user.user.toString()}`;
        } else {
            reply =
                `No such user found, have an L instead ${emojiL}`;
        }
        msg.channel.send(reply);
    } else {
        msg.channel.send(`Get L'd ${emojiL}`);
    }
};
