import { helpEmbeds} from "../../common/constants.js";

export default async (client, id, args) => {
    const channel = await client.channels.fetch(id);
    if (args[0]) {
        channel.send(args[Math.floor(Math.random() * args.length)]);
    } else {
        channel.send(helpEmbeds.choose);
    }
};
