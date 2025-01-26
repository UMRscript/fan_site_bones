// Получаем ссылку на поле ввода для поиска
const searchInput = document.querySelector('input[name="query"]');

// Создаем элемент для отображения подсказок (в виде выпадающего списка)
const suggestionsBox = document.createElement('ul');

// Настраиваем стили для контейнера с подсказками
suggestionsBox.style.position = 'absolute'; // Фиксируем контейнер относительно поля ввода
suggestionsBox.style.background = 'white'; // Фон подсказок белый
suggestionsBox.style.border = '1px solid #ccc'; // Добавляем серую рамку вокруг подсказок
suggestionsBox.style.listStyle = 'none'; // Убираем маркеры у списка
suggestionsBox.style.padding = '0'; // Убираем внутренние отступы
suggestionsBox.style.margin = '0'; // Убираем внешние отступы
suggestionsBox.style.zIndex = '1000'; // Делаем контейнер верхним слоем

// Добавляем этот контейнер в тело HTML (он будет отображаться при вводе текста)
document.body.appendChild(suggestionsBox);

// Обработчик события ввода текста в поле поиска
searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim().toLowerCase(); // Получаем текст из поля поиска и приводим его к нижнему регистру

    // Если поле пустое, скрываем подсказки
    if (!query) {
        suggestionsBox.style.display = 'none';
        return;
    }

    // Отправляем запрос на сервер к маршруту `/autocomplete` с параметром `query`
    const response = await fetch(`/autocomplete?query=${query}`);
    const suggestions = await response.json(); // Получаем массив подсказок из ответа сервера

    // Очищаем предыдущие подсказки
    suggestionsBox.innerHTML = '';

    // Добавляем каждую подсказку в контейнер
    suggestions.forEach(suggestion => {
        const item = document.createElement('li'); // Создаем элемент списка для подсказки
        item.style.padding = '8px'; // Отступы внутри подсказки
        item.style.cursor = 'pointer'; // Устанавливаем указатель мыши (курсор) для кликабельного элемента
        item.textContent = suggestion.name; // Добавляем текст подсказки (имя эпизода, актёра или персонажа)

        // Обработчик клика по подсказке
        item.addEventListener('click', () => {
            searchInput.value = suggestion.name; // Заполняем поле ввода текстом выбранной подсказки
            suggestionsBox.style.display = 'none'; // Скрываем контейнер с подсказками
        });

        // Добавляем текущую подсказку в список
        suggestionsBox.appendChild(item);
    });

    // Определяем положение контейнера с подсказками относительно поля ввода
    const { bottom, left, width } = searchInput.getBoundingClientRect();
    suggestionsBox.style.top = `${bottom + window.scrollY}px`; // Устанавливаем верхнее положение
    suggestionsBox.style.left = `${left + window.scrollX}px`; // Устанавливаем левое положение
    suggestionsBox.style.width = `${width}px`; // Устанавливаем ширину подсказок равной ширине поля ввода
    suggestionsBox.style.display = suggestions.length ? 'block' : 'none'; // Показываем подсказки, если они есть
});


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#search-input');
    const resultsBox = document.querySelector('#search-results');
  
    // Отслеживание ввода текста
    searchInput.addEventListener('input', async () => {
      const query = searchInput.value.trim().toLowerCase();
  
      // Если поле пустое, очищаем результаты и скрываем контейнер
      if (!query) {
        resultsBox.innerHTML = '';
        resultsBox.style.display = 'none';
        return;
      }
  
      try {
        // Отправляем запрос на сервер к маршруту /autocomplete
        const response = await fetch(`/autocomplete?query=${query}`);
        const suggestions = await response.json();
  
        // Очищаем результаты перед обновлением
        resultsBox.innerHTML = '';
  
        if (suggestions.length === 0) {
          resultsBox.style.display = 'none';
          return;
        }
  
        // Добавляем каждую подсказку в список
        suggestions.forEach(suggestion => {
          const li = document.createElement('li');
          li.textContent = `${suggestion.name} (${suggestion.type})`; // Имя и тип (эпизод, актёр, персонаж)
          li.addEventListener('click', () => {
            // Переход по ссылке при клике
            if (suggestion.type === 'episode') {
              window.location.href = `/episode/${suggestion.id}`;
            } else if (suggestion.type === 'character') {
              window.location.href = `/character/${suggestion.id}`;
            } else if (suggestion.type === 'actor') {
              window.location.href = `/actor/${suggestion.id}`;
            }
          });
          resultsBox.appendChild(li);
        });
  
        // Показываем контейнер с результатами
        resultsBox.style.display = 'block';
      } catch (error) {
        console.error('Ошибка при загрузке подсказок:', error);
      }
    });
  
    // Скрываем результаты при клике вне области поиска
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsBox.contains(e.target)) {
        resultsBox.style.display = 'none';
      }
    });
  });
  