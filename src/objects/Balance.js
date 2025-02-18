import NotificationManager from "./NotificationManager.js";

export default class Balance {
    constructor(scene, initialAmount = 0) {
        this.scene = scene;
        this.amount = initialAmount;
        this.autoIncreaseLimit = 250; // Максимальна сума автоматичного поповнення
        this.maxBalanceAfterAutoIncrease = 500; // Максимальний баланс після автоматичного поповнення
        this.incrementInterval = null; // Інтервал для автоматичного оновлення
        this.totalBet = 0;
        this.tmp = 0;
        this.curentWin = 0;
        this.priceMachine_1 = 10;
        this.priceMachine_2 = 15;
        this.priceMachine_3 = 20;
        this.slotStates = [
            { active: false, bet: this.priceMachine_1 }, // Автомат 1
            { active: false, bet: this.priceMachine_2 }, // Автомат 2
            { active: false, bet: this.priceMachine_3 }  // Автомат 3
        ];
        

        this.scoreText = this.scene.createText(-85, 20, `Balance: ${this.amount}`);
        this.totalBetText = this.scene.createText(-680, 20, `Total Bet: ${this.totalBet}`);
        this.winText = this.scene.createText(400, 20, `Win: ${this.curentWin}`);

        this.notificationManager = new NotificationManager();
    }

    // Збільшення балансу
    increase(amount) {

        if (amount === 0) return; // Якщо сума дорівнює 0, нічого не робимо

        this.amount += amount;
        console.log(`Баланс збільшено на ${amount}.`);
        this.updateBalance(); 
        this.notificationManager.showNotification("Поповнення балансу", "Баланс збільшено", amount); // Пуш-повідомлення
    }

    // Зменшення балансу
    decrease(amount) {
        if (this.amount >= amount) {
            this.amount -= amount;

            console.log(`Баланс зменшено на ${amount}. Поточний баланс: ${this.amount}`);
        } else {
            console.log('Недостатньо коштів на балансі.'); //TODO придумати щось для цього випадку
        }
    }

    // Отримання поточного балансу
    updateBalance() {
        this.scoreText.setText(`Balance: ${this.amount}`);
        console.log(`Поточний баланс: ${this.amount}`);
    }

    updateTotalbet(){
        this.totalBetText.setText(`Total Bet: ${this.totalBet}`);
    }

    updateWin(){
        this.winText.setText(`Win: ${this.curentWin}`);
        this.curentWin = 0;
    }

    
    updateTotalBet() {
        console.log(`Bet: ${this.slotStates[0].bet}`);
        console.log(`Bet: ${this.slotStates[0].active}`);
        this.totalBet = this.slotStates
            .filter(slot => slot.active) // Враховуємо лише активні автомати
            .reduce((sum, slot) => sum + slot.bet, 0);
    
        console.log(`Total Bet: ${this.totalBet}`);
        this.updateTotalbet(); // Оновлення відображення
    }
    // Автоматичне поповнення
    startAutoIncrease(interval = 5000) { // Час інтервалу за замовчуванням 5 с
        if (this.incrementInterval) {
            clearInterval(this.incrementInterval);
        }

        let sessionIncrement = 0; // Локальний лічильник автоматично доданих монет за сесію

        this.incrementInterval = setInterval(() => {
            // Перевірка: перевищує поріг для автопоповнення
            if (this.amount >= this.maxBalanceAfterAutoIncrease) {
                console.log("Баланс досягнув максимального порогу автопоповнення.");
                this.stopAutoIncrease();
                return;
            }

            // Перевірка: перевищує ліміт автопоповнення
            if (sessionIncrement >= this.autoIncreaseLimit) {
                console.log("Досягнуто ліміту автопоповнення.");
                this.stopAutoIncrease();
                return;
            }

            const incrementAmount = 10; // Кількість монет автоматичного поповнення (За замовчуванням 10)
            const potentialBalance = this.amount + incrementAmount;

            // Перевірка: перевищує допустимий баланс після автопоповнення
            if (potentialBalance > this.maxBalanceAfterIncrease) {
                const remainingIncrease = this.maxBalanceAfterIncrease - this.amount;
                this.increase(remainingIncrease); // Додаємо залишок до досягнення максимуму
                this.stopAutoIncrease();
            } else {
                this.increase(incrementAmount);
                sessionIncrement += incrementAmount;
            }
        }, interval);
    }

    // Зупинка автоматичного поповнення
    stopAutoIncrease() {
        if (this.incrementInterval) {
            clearInterval(this.incrementInterval);
            this.incrementInterval = null;
            console.log("Автоматичне поповнення зупинено.");
        }
    }
}
