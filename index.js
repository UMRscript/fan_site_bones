const express = require('express');
const morgan = require('morgan'); // Для логирования запросов
const fs = require('fs'); // Для работы с файловой системой
const path = require('path'); // Для работы с путями
const app = express();

// Установка движка представлений EJS
app.set('view engine', 'ejs');

// Подключение статических файлов из папки 'public'
app.use(express.static('public'));

// Подключение middleware для логирования запросов
app.use(morgan('dev'));

// Middleware для парсинга тела запросов (JSON и формы)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Главная страница
app.get('/', (req, res) => {
    res.render('homepage'); // Рендер представления 'homepage.ejs'
});

// Страница эпизода
app.get('/episode', (req, res) => {
    res.render('episode'); // Рендер представления 'episode.ejs'
});

const characters = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'characters.json'), 'utf-8'));


//Главаная страница с персонажами
app.get('/characters', (req, res) => {
    res.render('characters', {characters}); //Рендер character
});

//Страница конкретного персонажа
app.get('/character/:id', (req, res) => {
    const characterId = parseInt(req.params.id, 10); // Получаем ID персонажа из параметров URL 
    const character = characters.find(c => c.id === characterId); //Ищем персонажа по ID

    if (!character) {
        return res.status(404).send('Персонаж не найден');
    }

    res.render('character', {character});
});


// Страница актёрского состава
app.get('/cast', (req, res) => {
    res.render('cast'); // Рендер представления 'cast.ejs'
});

// Обработка 404 (Страница не найдена)
app.use((req, res, next) => {
    res.status(404).send('Страница не найдена');
});

// Общий обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack); // Логирование ошибки в консоль
    res.status(500).send('Что-то пошло не так!');
});

// Конфигурация порта
const PORT = 3000;

// Запуск сервера
app.listen(PORT, () => {
<<<<<<< HEAD
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});

    
