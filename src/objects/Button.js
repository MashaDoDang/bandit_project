export default class Button {
    constructor(scene, x, y, texture, toggleTexture = null, action = null, sound = null) {
        this.scene = scene; // Зберігаємо посилання на сцену
        this.defaultTexture = texture; // Текстура за замовчуванням
        this.toggleTexture = toggleTexture; // Текстура для активного стану
        this.isSelected = false; // Початковий стан кнопки
        this.action = action; // Дія при натисканні
        this.sound = sound; // Звук натискання кнопки

        // Додаємо кнопку на сцену
        this.sprite = scene.add.image(x, y, texture);

        // Встановлюємо масштаб
        this.sprite.setScale(0.2);

        // Робимо кнопку інтерактивною
        this.sprite.setInteractive();

        // Подія "наведення миші"
        this.sprite.on("pointerover", () => {
            this.scene.game.canvas.style.cursor = "pointer"; // Змінюємо курсор на "руку"
        });

        // Подія "зняття наведення миші"
        this.sprite.on("pointerout", () => {
            this.scene.game.canvas.style.cursor = "default"; // Повертаємо стандартний курсор
        });

        // Подія "натискання кнопки"
        this.sprite.on("pointerdown", () => {
            if (toggleTexture) {
                // Перемикання стану кнопки
                this.isSelected = !this.isSelected;
        
                // Вибираємо нову текстуру
                const newTexture = this.isSelected ? this.toggleTexture : this.defaultTexture;
        
                // Перевіряємо, чи існує текстура
                if (this.scene.textures.exists(newTexture)) {
                    // Змінюємо текстуру кнопки
                    this.sprite.setTexture(newTexture);
        
                    // Перевіряємо, яка текстура використовується, і встановлюємо відповідний масштаб
                    if (newTexture === "button_on") {
                        this.sprite.setScale(0.17); // Масштаб для "button_on"
                        this.sprite.y += 1.5; // Зміщення вниз на 1 піксель
                    } else {
                        this.sprite.setScale(0.2); // Масштаб для "button"
                        this.sprite.y -= 1.5; // Повернення в початкове положення
                    }
                } else {
                    console.error(`Texture "${newTexture}" not found.`); // Логування помилки, якщо текстура не знайдена
                }
            }
        
            // Відтворення звуку, якщо він переданий
            if (this.sound) {
                this.sound.play();
            }
        
            if (this.action) {
                this.action(); // Викликаємо функцію дії
            }
        });
    } 
     // Метод для перевірки, чи активна кнопка
     isActive() {
        return this.isSelected;
    }       
}