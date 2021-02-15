import { randInt , shuffleArray } from "../../../common/functions.js";

const Direction = {
    right: 0,
    up: 1,
    left: 2,
    down: 3,
};

const Pickup = {
    empty: 0,
    coin: 1,
    power: 2,
    reveal: 3,
};

String.prototype.format = function () {
    var i = 0,
        args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != "undefined" ? args[i++] : "";
    });
};

class Cell {
    constructor() {
        this.has = Pickup.empty;
        this.visible = false;
    }

    reveal() {
        this.visible = true;
    }

    collect() {
        const ret = this.has;
        this.has = Pickup.empty;
        return ret;
    }

    setPickup(has) {
        this.has = has;
    }

    showSymbol() {
        if (this.visible) {
            switch (this.has) {
                case Pickup.coin:
                    return "○";
                case Pickup.power:
                    return "+";
                case Pickup.reveal:
                    return "R";
                case Pickup.empty:
                    return ".";
            }
        } else {
            return " ";
        }
    }
}

class CoinGame {
    revealNear() {
        const x = this.player.x;
        const y = this.player.y;
        for (var dx = -1; dx < 2; dx++) {
            for (var dy = -1; dy < 2; dy++) {
                if (!(dx || dy)) continue;
                let revealCell = this.coinMap[`x${x + dx}y${y + dy}`];
                if (revealCell) revealCell.reveal();
            }
        }
    }

    constructor() {
        this.stats = {
            coins: 0,
            power: 0,
            reveal: 0,
            max_coins: 0,
            max_power: 0,
            max_reveal: 0,
            moves: 25,
            max_moves: 25,
        };

        this.player = {
            x: 8,
            y: 4,
        };
        this.coinMap = new Object();
        const emptyCells = [];

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                this.coinMap[`x${i}y${j}`] = new Cell();
                if (i !== this.player.x && j !== this.player.y) {
                    emptyCells.push(this.coinMap[`x${i}y${j}`]);
                }
            }
        }

        shuffleArray(emptyCells);

        function putStuff(item, min, max) {
            const qty = randInt(min, max);
            for (let q = 0; q < qty; q++) {
                let randomCell = emptyCells.pop();
                randomCell.setPickup(item);
            }
            return qty;
        }

        this.stats.max_coins = putStuff(Pickup.coin, 30, 35);
        this.stats.max_power = putStuff(Pickup.power, 5, 10);
        this.stats.max_reveal = putStuff(Pickup.reveal, 0, 1);
        this.revealNear();
    }

    movePlayer(dir) {
        // | 0: right | 1: up | 2: left | 3: down |
        var x = this.player.x;
        var y = this.player.y;

        switch (dir) {
            case Direction.right:
                if (!(y === 8)) y++;
                break;
            case Direction.down:
                if (!(x === 8)) x++;
                break;
            case Direction.left:
                if (!(y === 0)) y--;
                break;
            case Direction.up:
                if (!(x === 0)) x--;
        }

        this.player.x = x;
        this.player.y = y;
        const itemCollect = this.coinMap[`x${x}y${y}`].collect();

        switch (itemCollect) {
            case Pickup.coin:
                this.stats.coins++;
                break;
            case Pickup.power:
                this.stats.power++;
                this.stats.max_moves += 5;
                this.stats.moves += 6;
                break;
            case Pickup.reveal:
                this.stats.reveal++;
                for (const cell in this.coinMap) {
                    this.coinMap[cell].reveal();
                }
                break;
        }

        this.coinMap[`x${x}y${y}`].reveal();
        this.stats.moves--;
        this.revealNear();
    }

    renderMap() {
        const symbols = [];
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (i === this.player.x && j === this.player.y) {
                    symbols.push("@");
                } else {
                    symbols.push(this.coinMap[`x${i}y${j}`].showSymbol());
                }
            }
        }

        var mapString =
            "╔═══════════════════╗\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "║ {} {} {} {} {} {} {} {} {} ║\n" +
            "╚═══════════════════╝\n" +
            "Moves 🏃: {}\n" +
            "Coins 💰: {} / {}\n" +
            "Power-Ups ⚡: {} / {}\n" +
            "Reveals 🔮: {} / {}";

        return (
            "```\n" +
            mapString.format(
                ...symbols,
                this.stats.moves,
                this.stats.coins,
                this.stats.max_coins,
                this.stats.power,
                this.stats.max_power,
                this.stats.reveal,
                this.stats.max_reveal
            ) +
            "\n```"
        );
    }
}

const _CoinGame = CoinGame;
export { _CoinGame as CoinGame };
const _Direction = Direction;
export { _Direction as Direction };
