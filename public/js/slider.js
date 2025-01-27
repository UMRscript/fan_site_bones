// Получаем основные элементы слайдера из DOM
const slider = document.querySelector('.slider'); // Главный контейнер слайдера
const track = document.querySelector('.slider-track'); // Элемент, содержащий все слайды (движущаяся дорожка)
const slides = Array.from(document.querySelectorAll('.slide')); // Массив слайдов
const prevButton = document.querySelector('.prev'); // Кнопка для перехода к предыдущему слайду
const nextButton = document.querySelector('.next'); // Кнопка для перехода к следующему слайду
const dotsContainer = document.querySelector('.dots'); // Контейнер для точек навигации

// Устанавливаем начальный индекс текущего слайда
let currentIndex = 0;

// === Создание точек навигации (dots) ===
// Для каждого слайда создаём соответствующую точку навигации
slides.forEach((_, index) => {
    const dot = document.createElement('div'); // Создаём div для точки
    dot.classList.add('dot'); // Добавляем класс "dot"
    if (index === 0) dot.classList.add('active'); // Первую точку делаем активной
    dotsContainer.appendChild(dot); // Добавляем точку в контейнер для точек
});

// Получаем массив всех точек
const dots = Array.from(document.querySelectorAll('.dot'));

// === Функция для обновления слайдера ===
function updateSlider() {
    // Перемещаем дорожку слайда влево на текущую позицию
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Обновляем активное состояние точек (dots)
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex); // Активной становится точка, соответствующая текущему слайду
    });
}

// === Функция для показа следующего слайда ===
function showNextSlide() {
    // Увеличиваем индекс, возвращаясь к первому слайду, если текущий — последний
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider(); // Обновляем слайдер
}

// === Функция для показа предыдущего слайда ===
function showPrevSlide() {
    // Уменьшаем индекс, переходя к последнему слайду, если текущий — первый
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider(); // Обновляем слайдер
}

// === Функция для перехода к конкретному слайду ===
function goToSlide(index) {
    currentIndex = index; // Устанавливаем текущий индекс на переданный индекс
    updateSlider(); // Обновляем слайдер
}

// === Добавляем обработчики событий для кнопок ===
// При клике на кнопку "следующий" переходим к следующему слайду
nextButton.addEventListener('click', showNextSlide);

// При клике на кнопку "предыдущий" переходим к предыдущему слайду
prevButton.addEventListener('click', showPrevSlide);

// === Добавляем обработчики событий для точек навигации ===
dots.forEach((dot, index) => {
    // При клике на точку переходим к соответствующему слайду
    dot.addEventListener('click', () => goToSlide(index));
});

// === Автоматическая прокрутка слайдов ===
// Каждые 5 секунд вызываем функцию для показа следующего слайда
setInterval(showNextSlide, 5000);
