function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

String.prototype.format = function () {
    var i = 0,
        args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

class StackGame {

    constructor() {
        var shuffleCount = 10;
        const bufferSize = 4;
        const filler = ["A", "A", "A", "A", "B", "B", "B", "B", "C", "C", "C", "C"];
        const uniqueChars = filler.length / bufferSize;
        while (shuffleCount) {
            shuffle(filler);
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
            if (this.gameStack[a][0] === this.gameStack[b][0] || !this.gameStack[b][0]) {
                this.gameStack[b].unshift(this.gameStack[a].shift());
            }
        }
    }

    playerWin() {
        var winFlag = true;
        this.gameStack.forEach(stack => {
            if (stack[0]) {
                if (!stack.every(x => x === stack[0])) {
                    winFlag = false;
                } else if (stack.length < 4) {
                    winFlag = false;
                }
            }
        });
        return winFlag;
    }

    renderMap(arrow, moves, arrowSymbol) {
        var mapString = "```\n" +
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
                        fillerArray.push(this.gameStack[j][shift])
                    } else {
                        fillerArray.push(" ")
                    }
                }
            }
        }
        return mapString.format(...fillerArray, moves);
    }
}

module.exports.StackGame = StackGame;