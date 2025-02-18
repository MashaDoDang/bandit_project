export default class WinningLogic {
    constructor(scene) {
        this.scene = scene;

        this.values = {
            lemon: 4,
            cherry: 4,
            banana: 5,
            melon: 7,
            bell: 10,
            plum: 14,
            bar: 20,
            diamond: 40,
            seven: 50,
        };
    }

    calculateScore(results, index_spin) {
        const bet = this.scene.balance.slotStates[index_spin].bet;
        let scores = 0;
        let message = "No win, try again!";

        const matches = [
            results[0] === results[1],
            results[1] === results[2],
            results[0] === results[2]
        ];

        const isBigWin = matches.every(Boolean);
        const isSmallWin = matches.some(Boolean);

        if (isBigWin || isSmallWin) {
            const resultIcon = isBigWin ? results[1] : matches[0] ? results[0] : results[2];
            let multiplier;

            if (resultIcon === "seven") {
                multiplier = isBigWin ? this.values[resultIcon] ** 2 * 1.5 : this.values[resultIcon];
            } if (resultIcon === "diamond") {   
                multiplier = isBigWin ? this.values[resultIcon] ** 2 * 1.2 : this.values[resultIcon];
            } else {
                multiplier = isBigWin ? this.values[resultIcon] ** 2 : this.values[resultIcon];
            }

            scores += multiplier * bet;
            message = isBigWin ? "Big Win!" : "Small Win!";
        }

        console.log(message);
        return { scores, message };
    }
}
