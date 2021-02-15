import { shuffleArray } from "../../../common/functions.js";

String.prototype.format = function () {
    var i = 0,
        args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != "undefined" ? args[i++] : "";
    });
};

class StackGame {
    constructor() {
        var shuffleCount = 10;
        const bufferSize = 4;
        const filler = [
            "A",
            "A",
            "A",
            "A",
            "B",
            "B",
            "B",
            "B",
            "C",
            "C",
            "C",
            "C",
        ];
        const uniqueChars = filler.length / bufferSize;
        while (shuffleCount) {
            shuffleArray(filler);
            shuffleCount--;
        }
        this.gameStack = [];
        for (var i = 0; i < uniqueChars; i++) {
            this.gameStack.push([]);
            var j = bufferSize;
            while (j) {
                this.gameStack[i].unshift(filler.shift());
                j--;
            }
        }
        this.gameStack.push([]);
    }

    move(a, b) {
        if (this.gameStack[a][0] && this.gameStack[b].length !== 4) {
            this.gameStack[b].unshift(this.gameStack[a].shift());
        }
    }

    playerWin() {
        var winFlag = true;
        this.gameStack.forEach((stack) => {
            if (stack[0]) {
                if (!stack.every((x) => x === stack[0])) {
                    winFlag = false;
                } else if (stack.length < 4) {
                    winFlag = false;
                }
            }
        });
        return winFlag;
    }

    renderMap(arrow, moves, arrowSymbol) {
        var mapString =
            "```\n" +
            "  {}     {}     {}     {}\n" +
            "║ {} ║ ║ {} ║ ║ {} ║ ║ {} ║\n" +
            "║ {} ║ ║ {} ║ ║ {} ║ ║ {} ║\n" +
            "║ {} ║ ║ {} ║ ║ {} ║ ║ {} ║\n" +
            "║ {} ║ ║ {} ║ ║ {} ║ ║ {} ║\n" +
            "╚═0═╝ ╚═1═╝ ╚═2═╝ ╚═3═╝\n" +
            "      Moves : {}" +
            "\n```";
        const fillerArray = [" ", " ", " ", " "];
        fillerArray[arrow] = arrowSymbol;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.gameStack[j].length === 4) {
                    fillerArray.push(this.gameStack[j][i]);
                } else {
                    var shift = this.gameStack[j].length - 4 + i;
                    if (!(shift < 0)) {
                        fillerArray.push(this.gameStack[j][shift]);
                    } else {
                        fillerArray.push(" ");
                    }
                }
            }
        }
        return mapString.format(...fillerArray, moves);
    }
}

const _StackGame = StackGame;
export { _StackGame as StackGame };
