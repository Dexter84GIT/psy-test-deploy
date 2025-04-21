const cors = require('cors');
const express = require('express'); // Импортируем библиотеку Express
const bodyParser = require('body-parser'); // Импортируем библиотеку для работы с телом запроса
const fs = require('fs'); // Импортируем файл для работы с файловой системой
const app = express(); // Создаем экземпляр приложения Express
const PORT = process.env.PORT || 3100; // Определяем порт для сервера, по умолчанию 3000

app.use(cors());
app.use(express.static('/'));
app.use(express.json()); 

app.use(bodyParser.json()); // Используем middlewares для обработки JSON в запросах

// Обработчик POST-запроса по пути /submit
app.post('/submit', (req, res) => {
    // Получаем данные, отправленные клиентом
    const newData = req.body;

    // Читаем файл data.json, чтобы получить существующие данные
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка чтения файла.' }); // Возвращаем ошибку, если чтение файла не удалось
        }

        // Инициализируем jsonData
        let jsonData = [];

        // Проверяем, если файл не пуст
        if (data) {
            try {
                // Парсим данные JSON из файла
                jsonData = JSON.parse(data);
            } catch (parseError) {
                return res.status(500).json({ message: 'Ошибка разбора файла JSON.' }); // Обрабатываем ошибки при разборе JSON
            }
        }

        // Добавляем новые данные в массив jsonData
        jsonData.push(newData);

        // Записываем обновленные данные обратно в файл
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ message: 'Ошибка записи в файл.' }); // Возвращаем ошибку, если запись в файл не удалась
            }
            res.json({ message: 'Данные успешно сохранены!' }); // Отправляем ответ клиенту о успешном сохранении данных
        });
    });
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`); // Лог, подтверждающий запуск сервера
});