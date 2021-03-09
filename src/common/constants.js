import { MessageEmbed } from "discord.js";
import { getRandomColor } from "../common/functions.js";

// Global Emojis
const emoji = {
    l: "<a:LLLLL:717681809768448121>",
}

// Link of various assets
const assetsLinks = {
    stacks:
        "https://github.com/AceAltair13/MyAssets/blob/master/discordjs-bot/commands/Stacks.png?raw=true",
    coinhunt:
        "https://github.com/AceAltair13/MyAssets/blob/master/discordjs-bot/commands/Coinhunt.png?raw=true",
};

// Help Embeds
const helpEmbeds = {
    coinhunt: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("CoinHunt")
        .setThumbnail(assetsLinks.coinhunt)
        .setDescription(
            "```\nIt is a small minigame where main objective is to collect coins in limited number of moves.\n\n[@] : Player\n[·] : Visited\n[○] : Coin\n[+] : Power-Ups (+5 Moves)\n[R] : Reveal-Shard\n```"
        )
        .addField("Usage", "`$coinhunt <option>` _or_ `$ch <option>`")
        .addField(
            "Options",
            "`play` _or_ `start`\nStarts a game of coinhunt\n`highscore/hs`\nShows the user's highscore.\n`leaderboard/lb`\nDisplays the leaderboard."
        )
        .setFooter(
            "A mini game where you try to collect all the coins in limited number of moves."
        ),

    stacks: new MessageEmbed()
        .setColor(getRandomColor())
        .setThumbnail(assetsLinks.stacks)
        .setTitle("Stacks!")
        .setDescription(
            "```\nStacks is a game where you are given jumbled stacks of different letters and you have to arrange them so that all stacks contain only one kind of letter, or no letter at all, in the LEAST number of moves!\n```"
        )
        .addField("Usage", "`$stacks <option>`\n _or_ \n`$st <option>`")
        .addField(
            "Option",
            "`play` _or_ `start`\nStarts a game of Stacks!\n`<difficulty>` (range 1-5)\nComing soon!"
        )
        .setFooter("Unjumble the jumbled stacks!"),

    ask: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("Ask")
        .setDescription("```\nBot replies to a Yes-No question.\n```")
        .addField("Usage", "`$ask <question>`\n Ask the bot a question"),
    avatar: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("Avatar")
        .setDescription("```\nDisplays avatar image of yourself or given user.\n```")
        .addField(
            "Usage",
            "`$avatar`\nDisplays your avatar\n`$avatar <user>`\nDisplays avatar of given user\n`$avatar help`\nShows this message"
        )
        .setFooter("Avatar, yes."),
    chat: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("Chat")
        .setDescription(
            "```\nChat with Cleverbot!\n```"
        )
        .addField("Usage", "`$chat start`\nStart a chat session with cleverbot\n`$chat end`\nStop the chat session with cleverbot.")
        .setFooter(
            "Sends and retrieves message from Cleverbot API (New and Improved!)"
        ),
    choose: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("Choice | Choose")
        .setDescription("```\nLet the bot choose something for you.\n```")
        .addField(
            "Usage", "`$choose choice1 choice2 ...`\n_or_\n`$choice choice1 choice2 ...`"
        )
        .setFooter("Selects a random item from the choices."),
    l: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle(emoji.l)
        .setDescription("```\nHave an L, or give someone else an L.\n```")
        .addField("Usage", "`$l`\nHave an L\n`$l <user>`\nGive someone an L.")
        .setFooter("Get L'd"),
    ping: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("Ping")
        .setDescription("```\nCheck your ping with the bot\n```")
        .addField("Usage", "`$ping`\nTest your ping with the bot.")
        .setFooter("Pong."),
    help: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("Help")
        .setDescription("```\nLists all the available commands.\n```")
        .addField(
            "Usage",
            "`$help <command>`\nShows help for the given command name."
        )
        .addField("Minigames", "`coinhunt`,`stacks`")
        .addField("Fun", "`chat`,`ask`,`joe`,`L`")
        .addField("Utilities", "`choice`, `avatar`, `ping`")
        .setFooter("New commands will be added soon!")
        .setThumbnail("https://i.imgur.com/7qttfnm.gif"),
    joe: new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("Joe Mama")
        .setDescription("```\nJoe Mama\n```")
        .setFooter("Joe Mama"),
};

export { helpEmbeds, assetsLinks, emoji };
