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

// Маршрут для поиска 
app.get('/search', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';

    // Фильтрация эпизодов, персонажей и актёров по названию
    const filteredEpisodes = episodes.filter(episode =>
        episode.title.toLowerCase().includes(query)
    );
    const filteredCharacters = characters.filter(character =>
        character.name.toLowerCase().includes(query)
    );
    const filteredActors = actors.filter(actor =>
        actor.name.toLowerCase().includes(query)
    );

    res.render('search_results', {
        query,
        filteredEpisodes,
        filteredCharacters,
        filteredActors,
    });
});

// Маршрут для автодополнения
app.get('/autocomplete', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
  
    // Собираем данные для поиска
    const suggestions = [
      ...episodes.map(e => ({ id: e.id, name: e.title, type: 'episode' })),
      ...characters.map(c => ({ id: c.id, name: c.name, type: 'character' })),
      ...actors.map(a => ({ id: a.id, name: a.name, type: 'actor' })),
    ].filter(item => item.name.toLowerCase().includes(query));
  
    res.json(suggestions.slice(0, 10)); // Возвращаем максимум 10 совпадений
  });
  

// Главная страница
app.get('/', (req, res) => {
    res.render('homepage'); // Рендер представления 'homepage.ejs'
});

const episodes = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'episodes.json'), 'utf-8')); // Импорт episodes.json и создание алфавита 
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Страница эпизодов с списком по алфавиту 
app.get('/episodes', (req, res) => {
    const selectedLetter = req.query.letter || ""; // Получаем выбранную букву из параметров
    const filteredEpisodes = selectedLetter
        ? episodes.filter(episode => episode.title.toUpperCase().startsWith(selectedLetter.toUpperCase()))
        : episodes; // Фильтруем серии по букве или показываем всё
    res.render('episodes', { episodes: filteredEpisodes, alphabet, selectedLetter });
});

// Страница отдельного эпизода
app.get('/episode/:id', (req, res) => {
    const episodeId = parseInt(req.params.id, 10); // Получаем ID серии из параметров URL
    const episode = episodes.find(e => e.id === episodeId); // Находим серию по ID

    if (!episode) {
        return res.status(404).send('Эпизод не найден');
    }

    res.render('episode_detail', { episode });
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

const actors = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'actors.json'), 'utf-8'));


// Главная траница актёрского состава
app.get('/actors', (req, res) => {
    res.render('actors', {actors}); // Рендер представления 'actors.ejs'
});

//Страница конкретного актёра
app.get('/actor/:id', (req, res) => {

    const actorId = parseInt(req.params.id, 10); // Получаем ID актёра из параметров URL
    const actor = actors.find(c => c.id === actorId); // Ищем актёра по id

    if (!actor){
        return res.status(404).send('Актёр не найден');
    }

    res.render('actor', {actor});
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
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
    
