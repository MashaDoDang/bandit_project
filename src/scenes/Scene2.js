import SlotMachine from "../objects/SlotMachine.js";
import Button from "../objects/Button.js";
import Balance from "../objects/Balance.js";
import NotificationManager from "../objects/NotificationManager.js";


export default class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");

        this.notificationManager = new NotificationManager();
    }
    
    create() {
        this.background = this.add.image(0, 0, "background");
        this.background.setScale(1, 0.8);
        this.background.setOrigin(0, 0);
        
        this.slotMachines = [];
        this.buttons = [];
        const positionsX = [this.scale.width / 5, this.scale.width / 2, (this.scale.width / 5) * 4];

        this.scoreBg = this.add.image(this.scale.width / 2 - 10, this.scale.height / 15, "scoreBg");
        this.scoreBg.setScale(3, 0.4);//має бути в ширину трьох машин


        //всяка фігня в зеленій рамці
        this.balance = new Balance(this, 1000);
        // this.scoreText = this.createText(-85, 20, `Balance: ${this.balance.amount}`);
        // this.totalBetText = this.createText(-680, 20, `Total Bet: ${this.balance.totalBet}`);
        // this.winText = this.createText(400, 20, `Win: ${this.balance.curentWin}`);

            // Створення постійних чорних рамок
        const rectWidth = 322; // Ширина рамки
        const rectHeight = 60; // Висота рамки

        positionsX.forEach((x) => {
            const y = this.scale.height * 0.5 - 57; // Центрування рамки по вертикалі

            // Додавання чорної рамки
            const blackFrame = this.add.graphics().setDepth(1); // Глибина рамки
            blackFrame.lineStyle(4, 0x000000); // Чорна обводка шириною 4 пікселі
            blackFrame.strokeRect(x - rectWidth / 2 - 22, y - rectHeight / 2, rectWidth, rectHeight); // Малюємо рамку

        });
        // Завантажуємо звуки
        this.schelchokSound = this.sound.add("schelchok");
        this.playButtonSound = this.sound.add("press_play_button");
        this.wrongActionSound = this.sound.add("smth_wrong");
        this.redButtonSound = this.sound.add("press_red_button");

        
        positionsX.forEach((x) => {
            const y = this.scale.height * 0.5 - 57; // Центрування рамки по вертикалі

            // Додавання чорної рамки
            const blackFrame = this.add.graphics().setDepth(1); // Глибина рамки
            blackFrame.lineStyle(4, 0x000000); // Чорна обводка шириною 4 пікселі
            blackFrame.strokeRect(x - rectWidth / 2 - 22, y - rectHeight / 2, rectWidth, rectHeight); // Малюємо рамку
        });
        

        positionsX.forEach((x, index) => {
            // const redButtonSound = this.sound.add("press_red_button"); // Додаємо звук
            this.sound.add("press_red_button");
            // Створення слот-машини
            const slotMachine = new SlotMachine(this, x, this.scale.height * 0.5, "0armbandit");
            this.slotMachines.push(slotMachine);
        
            // Додавання червоної кнопки

            const button = new Button(
                this, 
                x - 20, 
                this.scale.height * 0.6, 
                "button", 
                "button_on", 
                null, // Дія (якщо є)
                this.sound.add("press_red_button") // Звук
            );
            // let bets = [0, 0, 0]; // Початкові ставки для трьох автоматів
            // let isActive = [false, false, false]; // Стан червоних кнопок для автоматів

            button.sprite.on("pointerdown", () => {
                // Перемикаємо текстуру кнопки між "button" і "button_on"
                
                if (button.sprite.texture.key === "button") {
                    button.sprite.setTexture("button");
                    button.sprite.y -= 5;
                    this.balance.slotStates[index].active = false;
                } else {
                    button.sprite.setTexture("button_on");
                    button.sprite.y += 5;
                    this.balance.slotStates[index].active = true;
                }
                this.balance.updateTotalBet();
            
            });
     

            this.buttons.push(button);
        
            // Додавання ставок
            const betSettings = [
                { min: 10, max: 1000, step: 10 },
                { min: 15, max: 1500, step: 15 },
                { min: 20, max: 2000, step: 20 }
            ];
            let bet = betSettings[index].min;
        
            // Текст відображення ставки
            const betText = this.add.text(x - 20, this.scale.height * 0.745, `Bet: ${bet}`, {
                fontSize: "22px",
                fill: "#ffffff",
                fontStyle: "bold",
            }).setOrigin(0.5);
        
            // Кнопка +
            const plusButton = this.add.text(x + 99, this.scale.height * 0.734, "+", {
                fontSize: "42px",
                fill: "#00ff00",
            }).setOrigin(0.5).setInteractive();
        
            plusButton.on("pointerdown", () => {
                const slotState = this.balance.slotStates[index];
                if (bet + betSettings[index].step <= betSettings[index].max) {
                    bet += betSettings[index].step;
                    slotState.bet += betSettings[index].step;
                    betText.setText(`Bet: ${bet}`);
                    this.schelchokSound.play(); // Відтворення звуку
                    console.log(`Slot ${index + 1} Bet increased to: ${bet}`);
                     
                }
                this.balance.updateTotalBet();
            });
        
            // Кнопка -
            const minusButton = this.add.text(x - 141, this.scale.height * 0.734, "-", {
                fontSize: "42px",
                fill: "#ff0000",
            }).setOrigin(0.5).setInteractive();
        
            minusButton.on("pointerdown", () => {
                const slotState = this.balance.slotStates[index];

                if (bet - betSettings[index].step >= betSettings[index].min) {
                    bet -= betSettings[index].step;
                    slotState.bet -= betSettings[index].step;
                    betText.setText(`Bet: ${bet}`);
                    this.schelchokSound.play(); // Відтворення звуку
                    console.log(`Slot ${index + 1} Bet decreased to: ${bet}`)
                }
                this.balance.updateTotalBet();

            });
        });
        


        // Зелена кнопка Play
        const buttonPlay = new Button(this, this.scale.width / 2 - 10, this.scale.height * 0.92, "buttonPlay", "buttonPlay_on");
        // Встановлюємо масштаб кнопки Play
        buttonPlay.sprite.setScale(0.8); // Задаємо потрібний масштаб
        // Логіка для натискання зеленої кнопки
        buttonPlay.sprite.on("pointerdown", () => {
            // Відтворення звуку
            this.playButtonSound.play();
            // Змінюємо текстуру на "buttonPlay_on"
            buttonPlay.sprite.setTexture("buttonPlay_on");
            // Встановлюємо масштаб кнопки Play
        buttonPlay.sprite.setScale(0.8); // Задаємо потрібний масштаб
            
        if (this.balance.totalBet > this.balance.amount) {
            console.log("Not enough money");
            console.log(`${this.balance.totalBet} > ${this.balance.amount}`);
            this.wrongActionSound.play(); // Відтворення звуку помилкової дії
            this.notificationManager.showNotification("Помилка", "Недостатньо коштів на рахунку");
            buttonPlay.sprite.setTexture("buttonPlay");
            return; // Вихід із методу, оскільки недостатньо коштів
        }

        // Починаємо обертання вибраних слотів
        const spinningSlots = [];
        this.slotMachines.forEach((slotMachine, index) => {
            if (this.buttons[index].isActive()) {
                this.balance.decrease(this.balance.slotStates[index].bet);
                this.balance.updateBalance();
                this.balance.updateWin();
                
                // Перевірка та запуск автооновлення після кожного прокруту
                if (this.balance.amount <= 250) {
                    this.balance.startAutoIncrease(30000); // Інтервал 30 с
                }
                slotMachine.index_spin = index;
                spinningSlots.push(slotMachine.spin()); // Додаємо обіцянки (Promises), якщо spin() повертає їх
            }
        });
        
          buttonPlay.sprite.disableInteractive();

            // Викликаємо spin(), щоб запустити обертання слотів
            this.spin();


            // Чекаємо завершення прокрутки всіх вибраних слотів
            Promise.all(spinningSlots).then(() => {
                // Після завершення змінюємо текстуру назад на "buttonPlay"
                buttonPlay.sprite.setTexture("buttonPlay");
                buttonPlay.sprite.setInteractive();
            }).catch((err) => {
                console.error("Помилка під час прокрутки:", err);
                buttonPlay.sprite.setTexture("buttonPlay");
                buttonPlay.sprite.setInteractive();
            });;
        });

        const infoButton = new Button(this, 50, 50, "buttonInfo", null,   () => {
            this.showGameRules(); // Викликаємо функцію для показу правил
        });

                // Збільшуємо розмір картинки кнопки
        infoButton.sprite.setScale(0.6); // Змінюємо масштаб 

    }

    spin() {
        // Перевіряємо, чи є хоча б один активний слот
        const activeSlots = this.slotMachines.some((slotMachine, index) => this.buttons[index].isActive());
    
        if (!activeSlots) {
            console.log("No active slots. Playing wrong action sound.");
            this.wrongActionSound.play(); // Відтворення звуку помилкової дії
            this.notificationManager.showNotification("Помилка", "Оберіть слот-машини для початку гри");
            return; // Вихід із методу, оскільки немає активних слотів
        }
        
        // Отримуємо тільки активні слоти
        const spinningSlots = this.slotMachines.map((slotMachine, index) => {
            if (this.buttons[index].isActive()) {
                return slotMachine.spin().then(({ results, scores, message }) => {
                    console.log(`Slot ${index} result: ${results}, Message: ${message}`); // Лог
                    this.showSlotMessage(index, message); // Відображення повідомлення
                    return scores;
                });
            } else {
                console.log(`Slot ${index} is not active`); // Лог для неактивних слотів
                return Promise.resolve(0); // Повертаємо 0 для неактивних слотів
            }
        });
    
        // Після завершення обертання слотів обчислюємо загальний результат
        Promise.all(spinningSlots).then((scoresArray) => {
            const totalScore = scoresArray.reduce((sum, score) => sum + score, 0);
            console.log(`Total score: ${totalScore}`); // Лог
            this.balance.increase(totalScore);
            this.balance.updateBalance();
            this.balance.curentWin += totalScore;
            this.balance.updateWin();
        });
    }  

    showSlotMessage(index, message) {
        console.log(`Displaying message for slot ${index}: ${message}`); // Лог
            
            // Перевірка на виграшну комбінацію
            if (message === "Big Win!" || message === "Small Win!") {
                // Отримуємо слот-машину за індексом
                const slotMachine = this.slotMachines[index];
        
                // Початковий стан
                let textures = ["0armbandit_yellow", "0armbandit_red"];
                let currentTextureIndex = 0;
        
                // Змінюємо текстуру кожні 0.5 секунди
                // const loopEvent = 
                this.time.addEvent({
                    delay: 500, // Кожні 0.5 секунди
                    callback: () => {
                        slotMachine.sprite.setTexture(textures[currentTextureIndex]);
                        currentTextureIndex = (currentTextureIndex + 1) % textures.length; // Перемикаємо між текстурами
                    },
                    repeat: 5 // Повторюємо 6 разів (3 секунди / 0.5 секунди = 6)
                });
        
                // Повертаємо початкову текстуру після 3 секунд
                this.time.delayedCall(3000, () => {
                    slotMachine.sprite.setTexture("0armbandit");
                    console.log(`Slot ${index} texture reset to 0armbandit`);
                });
            }
    
        // Позиції для повідомлень над слотами
        const messagePositions = [
            { x: this.scale.width / 5 - 20, y: this.scale.height / 4 + 20 }, // Ліва слот-машина
            { x: this.scale.width / 2 - 20, y: this.scale.height / 4 + 20 }, // Центральна слот-машина
            { x: (this.scale.width / 5) * 4 - 20, y: this.scale.height / 4 + 20 }, // Права слот-машина
        ];
    
        // Позиції для рамки навколо середнього ряду
        const framePositions = [
            { x: this.scale.width / 5 - 22, y: this.scale.height * 0.5 - 57 }, // Ліва слот-машина
            { x: this.scale.width / 2 - 22, y: this.scale.height * 0.5 - 57 }, // Центральна слот-машина
            { x: (this.scale.width / 5) * 4 - 22, y: this.scale.height * 0.5 - 57 }, // Права слот-машина
        ];
    
        // Розміри рамки
        const rectWidth = 322; // Ширина рамки
        const rectHeight = 1; // Висота рамки
    
        // Розташування повідомлення
        const messageX = messagePositions[index].x;
        const messageY = messagePositions[index].y;
    
        // Розташування рамки
        const frameX = framePositions[index].x;
        const frameY = framePositions[index].y;
    
        // Стиль тексту
        const style = {
            fontSize: "30px", // Збільшений розмір тексту
            fill: "#fcfadc", // Білий текст
            stroke: "#1e1e1e", // Чорний обвід
            strokeThickness: 5, // Товстіший обвід
            fontStyle: "bold",
        };
    
        // Додавання повідомлення
        const slotMessage = this.add.text(messageX, messageY, message, style).setOrigin(0.5).setDepth(100);
    
        console.log(`Created message for slot ${index}: ${slotMessage.text}`); // Лог
    
        // Додавання рамки тільки для виграшних повідомлень
        if (message === "Big Win!" || message === "Small Win!") {
            const frame = this.add.graphics().setDepth(99); // Глибина рамки
            frame.lineStyle(4, 0xff0000); // Червона обводка шириною 4 пікселі
            frame.strokeRect(frameX - rectWidth / 2, frameY - rectHeight / 2, rectWidth, rectHeight); // Малюємо рамку
    
            // Видалення рамки через 3 секунди
            this.time.delayedCall(3000, () => {
                frame.destroy();
                console.log(`Frame destroyed for slot ${index}`);
            });
        }
    
        // Видалення повідомлення через 3 секунди
        this.time.delayedCall(3000, () => {
            slotMessage.destroy();
            console.log(`Message destroyed for slot ${index}`);
        });
    }

    showGameRules() {
        let width = this.scale.width;
        let height = this.scale.height;
    
        // Створюємо затемнення фону
        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);
        
        // Блокування шару зі слотами під час показу правил
        this.blocker = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0).setDepth(101);
        this.blocker.setInteractive();
    
        // Створюємо прямокутник для правил
        this.rulesBox = this.add.image(width / 2, height / 2, 'rules_bg');
        this.rulesBox.setScale(3).setDepth(102);


        this.prizes = this.add.image(width * 0.37, height / 2, 'prizes').setDepth(103);
        // this.prizes.setScale(0.75);
    
        // Додаємо текст із правилами
        this.rulesText = this.add.text(width * 0.6, height / 2, 
            "Правила гри:\n\n1. Виберіть слот-машину натиском на червону кнопку.\n\n2. Натисніть кнопку PLAY.\n\n3. Зберіть виграшну комбінацію!",
            {
                fontSize: '24px',
                color: '#000000',
                align: 'left',
                wordWrap: { width: 400 }
            }
        ).setOrigin(0.5).setDepth(104);
    
        // Додаємо кнопку закриття через клас Button
        this.closeButton = new Button(this, width * 0.7, height * 0.3, "buttonClose", null, () => {
            this.close();
        });
        this.closeButton.sprite.setScale(0.17); // Збільшуємо розмір кнопки
        this.closeButton.sprite.setDepth(104);

    }
    
    //характеристики тексту для балансу і тд
    createText(xOffset, yOffset, text, fontSize = "32px", color = "#000", fontStyle = "bold") {
        return this.add.text(this.scale.width / 2 + xOffset, this.scale.height / yOffset, text, {
            fontSize: fontSize,
            fill: color,
            fontStyle: fontStyle,
        });
    }
    

    close() {
        this.overlay.destroy();
        this.rulesBox.destroy();
        this.rulesText.destroy();
        this.closeButton.sprite.destroy();
        this.blocker.destroy();
        this.prizes.destroy();
    }
    
    update() {
        // Логіка оновлення (якщо потрібно)

        // Маша блондинка лох

    }
}
