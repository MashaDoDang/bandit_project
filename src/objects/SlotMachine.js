import Reel from "../objects/Reel.js";
import WinningLogic from "./WinningLogic.js";

export default class SlotMachine {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.winLogic = new WinningLogic(this.scene);
        this.index_spin = 0;
        this.sprite = scene.add.image(x, y, texture);
        this.sprite.setScale(0.9);
        
        const icons = ["lemon", "diamond", "cherry", "bar", "bell", "melon", "banana", "seven", "plum"];
         // Ваги для кожного барабана
         const weights1 = [25, 25, 20, 15, 10, 7, 5, 3, 3]; // Для першого барабана
         const weights2 = [20, 20, 15, 10, 7, 5, 5, 3, 3]; // Для другого барабана
         const weights3 = [15, 15, 10, 10, 5, 5, 3, 2, 2]; // Для третього барабана 
        
        this.reels = [
            new Reel(scene, x - 120, y, icons, weights1),
            new Reel(scene, x, y, icons, weights2),     
            new Reel(scene, x + 120, y, icons, weights3) 
        ];
    }

    spin() {

        return new Promise((resolve) => {
            const reelPromises = this.reels.map((reel, i) => {
                // Затримка запуску кожного барабану
                return new Promise((resolveReel) => {
                    setTimeout(() => {
                        reel.spin().then(resolveReel);
                    }, i * 300); // Затримка між запуском кожного барабана: 500 мс
                });
            });
    
            // Очікуємо завершення всіх барабанів
            Promise.all(reelPromises).then((results) => {

                const { scores, message } = this.winLogic.calculateScore(results, this.index_spin);
                this.isSpinning = false; // Скидаємо флаг після завершення
                resolve({ results, scores, message });
            }).catch((err) => {
                console.error("Помилка під час прокрутки:", err);
                this.isSpinning = false;
                return { results: [], scores: 0, message: '' }; // Повертаємо порожній об'єкт у разі помилки
            });
        });
    }
    
}