import { helpEmbeds} from "../../common/constants.js";

export default async (client, id, arg) => {
    const channel = await client.channels.fetch(id);

    if (arg) {
        let helpMsg;
        switch (arg) {
            case "coinhunt":
            case "ch":
                helpMsg = helpEmbeds.coinhunt;
                break;

            case "stacks":
            case "st":
                helpMsg = helpEmbeds.stacks;
                break;

            case "ask":
                helpMsg = helpEmbeds.ask;
                break;

            case "avatar":
                helpMsg = helpEmbeds.avatar;
                break;

            case "chat":
                helpMsg = helpEmbeds.chat;
                break;

            case "choose":
            case "choice":
                helpMsg = helpEmbeds.choose;
                break;

            case "l":
                helpMsg = helpEmbeds.l;
                break;

            case "ping":
                helpMsg = helpEmbeds.ping;
                break;

            case 'joe':
                helpMsg = helpEmbeds.joe;
                break;

            default:
                channel.send("Unknown command. Check `$help` for a list of commands.")
                break;
        }
        channel.send(helpMsg);
    } else {
        channel.send(helpEmbeds.help);
    }
};
