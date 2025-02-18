export default class Reel {
    constructor(scene, x, y, icons, weights) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        // this.icons = this.shuffleArrayWithWeights(icons, weights);
        this.icons = this.shuffleArray(icons);
        this.weights = weights;

        this.iconSprites =  icons.map((icon, i) => {
            let sprite = scene.add.image(this.x-25, this.y - 115 + i * 60, icon);
            sprite.setDisplaySize(60, 60);
            return sprite;
        });

        this.createMask();
    }

    shuffleArrayWithWeights(array, weights) { // Перемішує масив із врахуванням ваг елементів
        let weightedArray = [];
        for (let i = 0; i < array.length; i++) {
            // Додаємо елемент стільки разів, скільки зазначено у вагах
            for (let j = 0; j < weights[i]; j++) {
                weightedArray.push(array[i]);
            }
        }

        // Перетасовка масиву
        for (let i = weightedArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [weightedArray[i], weightedArray[j]] = [weightedArray[j], weightedArray[i]];
        }

        return weightedArray.slice(0, array.length); // Повертаємо частину, рівну довжині початкового масиву
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Випадковий індекс
            [array[i], array[j]] = [array[j], array[i]]; // Обмін місцями
        }
        return array;
    }

    createMask() {
        const maskShape = this.scene.make.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(this.x - 55, this.y - 140, 70, 170);
        const mask = maskShape.createGeometryMask();

        this.iconSprites.forEach((sprite) => {
            sprite.setMask(mask);
        });
    }

    spin() {
        const delta = this.icons.length*3; 
        const duration = 3500;

        // this.icons = this.shuffleArrayWithWeights(this.icons, this.weights);
        this.icons = this.shuffleArray(this.icons);
        this.iconSprites.forEach((sprite, i) => {
            sprite.setTexture(this.icons[i]);
        });

        return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: this.iconSprites,
                y: `+=${delta * 60}`,
                ease: "Cubic.easeOut",
                duration: duration,
                onUpdate: () => {
                    this.iconSprites.forEach((sprite) => {
                        while (sprite.y >= this.y + 60 * (this.icons.length - 3)) {
                            sprite.y -= 60 * this.icons.length;
                        }
                    });
                },
                onComplete: () => {
                    const visibleOffset = Math.floor(this.icons.length / 2);
                    let centralIndex = this.iconSprites.findIndex(sprite =>
                        Math.abs(sprite.y - this.y) < 1
                    );
                    const stopIndex = (centralIndex + delta - visibleOffset) % this.icons.length; 

                    this.iconSprites.forEach((sprite, i) => {
                        const correctedIndex = (i - visibleOffset + this.icons.length) % this.icons.length;
                        sprite.y = this.y - (visibleOffset * 60) + correctedIndex * 60;
                    });             
                    console.log("Icons before stop:", this.icons);
                    
                    this.iconSprites.forEach((sprite, i) => {
                        console.log(`Sprite ${i}: texture = ${sprite.texture.key}, y = ${sprite.y}`);
                    });
                    


                    // this.iconSprites.forEach((sprite, i) => {
                    //     const correctedIndex = (i - visibleOffset + this.icons.length) % this.icons.length;
                    //     sprite.y = this.y + correctedIndex * 60;
                    // });
                    console.log("centralIndex = ", centralIndex);
                    console.log("stopIndex = ", stopIndex);


                   
                    resolve(this.iconSprites[7].texture.key);

                }
            });

        });
    }
}