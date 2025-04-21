const express = require('express'); // Импортируем библиотеку Express для создания серверного приложения
const nodemailer = require('nodemailer'); // Импортируем Nodemailer для отправки электронной почты
const bodyParser = require('body-parser'); // Импортируем body-parser для обработки JSON-данных

const app = express(); // Создаем экземпляр приложения Express
const port = process.env.PORT || 8000; // Устанавливаем порт, используемый для прослушивания (по умолчанию 3000)

app.use(bodyParser.json()); // Используем middleware для обработки JSON-формата

// Обработка POST-запросов на маршрут /mailer
app.post('/mailer', (req, res) => {
    const { finishLevelValue, finishLevel, userData } = req.body; // Извлекаем данные из запроса

    // Создание транспортера для отправки электронной почты через Яндекс Почту
    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.com', // Хост SMTP-сервера Яндекса
        port: 465, // Порт для подключения (465 для SSL)
        secure: true, // Используем SSL
        auth: {
            user: 'fenixzaec@yandex.ru', // Замените на ваш адрес электронной почты
            pass: 'yhewxnpleqxikcre', // Замените на пароль приложения из Яндекс.Почты
        },
    });

    // Настройки отправляемого письма, включая получателя и содержание
    const mailOptions = {
        from: 'fenixzaec@yandex.ru', // Отправляемый адрес (должен совпадать с адресом в auth)
        to: userData.email, // Адрес получателя из данных пользователя
        subject: 'Результаты тестирования', // Тема письма
        text: `Общий уровень: ${finishLevelValue}\nУровни: ${JSON.stringify(finishLevel)}\nПользователь: ${JSON.stringify(userData)}`, // Текст письма
    };

    // Отправка письма
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Ошибка отправки:', error); // Логирование ошибки в случае неудачи
            return res.status(500).send({ message: 'Ошибка отправки' }); // Ответ с ошибкой
        }
        res.send({ message: 'Результаты отправлены' }); // Ответ при успешной отправке
    });
});

// Запускаем сервер и слушаем указанный порт
app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port}`); // Лог запуска сервера
});