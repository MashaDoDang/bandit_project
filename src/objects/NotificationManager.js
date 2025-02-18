export default class NotificationManager {
    constructor(containerId = "notification-container") {
        this.container = document.getElementById(containerId);

        if (!this.container) {
            console.error(`Контейнер з ID "${containerId}" не знайдено.`);
            return;
        }
    }

    // Метод для відображення пуш-повідомлення
    showNotification(title, message, amount=null) {
        // Створюємо новий елемент HTML для повідомлення
        const notification = document.createElement("div");
        notification.className = "notification"; 

        // Назва додатку з іконкою (фіксована)
        const appHeader = document.createElement("div");
        appHeader.className = "notification-app-header";
        appHeader.innerHTML = `<span class="notification-icon">🎰</span> Slot Machine`;
        notification.appendChild(appHeader);

        // Заголовок повідомлення
        const notificationHeader = document.createElement("div");
        notificationHeader.className = "notification-title";
        notificationHeader.innerHTML = `<strong>${title}</strong>`; // Текст заголовка у bold
        notification.appendChild(notificationHeader);

        // Текст повідомлення
        const messageElement = document.createElement("div");
        messageElement.className = "notification-message"; // Ось це можливо прибрати, або якось треба застосувати
        
        // Якщо є параметр `amount`, додаємо правильне відмінювання
        if (amount !== null) {
            const declension = this.getCoinDeclension(amount); 
            messageElement.innerText = `${message} на ${amount} ${declension}!`;
        } else {
            messageElement.innerText = message; // Звичайне повідомлення без "монет"
        }
        notification.appendChild(messageElement);

        // Додаємо хрестик для закриття
        const closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;"; // Символ хрестика
        closeButton.className = "close-button";
        closeButton.onclick = () => notification.remove(); // При натисканні видаляємо повідомлення
        notification.appendChild(closeButton);
    
        this.container.appendChild(notification); // Додаємо повідомлення до контейнера
    
        // Видаляємо повідомлення через певний час (12 с)
        setTimeout(() => {
            notification.remove();
        }, 12000);
    }

    // Метод для відмінювання слова "монета"
    getCoinDeclension(amount) {
        const lastDigit = amount % 10; // Остання цифра числа
        const lastTwoDigit = amount % 100; // Останні дві цифри числа

        if (lastTwoDigit >= 11 && lastTwoDigit <= 19) {
            return "монет";
        }

        if (lastDigit === 1) {
            return "монету";
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return "монети";
        } else {
            return "монет";
        }
    }
}