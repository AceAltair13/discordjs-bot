export default async (msg, args) => {
    if (args[0]) {
        const user = msg.guild.members.cache.get(
            msg.mentions.members.first()
                ? msg.mentions.members.first().user.id
                : await msg.guild.members
                      .fetch({ query: args[0], limit: 1 })
                      .then((user) => user.first().id)
        );
        var reply = "";
        if (user) {
            reply = `Get L'd <a:LLLLL:717681809768448121> ${user.user.toString()}`;
        } else {
            reply =
                "No such user found, have an L instead <a:LLLLL:717681809768448121>";
        }
        msg.channel.send(reply);
    } else {
        msg.channel.send("Get L'd <a:LLLLL:717681809768448121>");
    }
};
