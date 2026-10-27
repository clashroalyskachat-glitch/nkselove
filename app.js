/*
 * Стартовая страница: тема, дата и мягкий переход по ссылкам.
 * Никаких зависимостей - файл подключается напрямую.
 */
(function () {
    'use strict';

    /*
     * Тема одна на все три страницы: меню, библиотека и доска пожеланий.
     * Расписание сюда не входит — у него свои пресеты, и его мы не трогаем.
     * Старый личный ключ читаем как запасной, чтобы переключение не
     * сбрасывалось у тех, кто уже успел его сохранить.
     */
    var THEME_KEY = 'nkse-theme';
    var THEME_LEGACY = 'hub.theme';

    var root = document.documentElement;
    var themeBtn = document.getElementById('theme-btn');
    var meta = document.querySelector('meta[name="theme-color"]');

    function paint(theme) {
        root.setAttribute('data-theme', theme);
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#08080a' : '#e9e5dd');
    }

    function readTheme() {
        try {
            var value = localStorage.getItem(THEME_KEY);
            if (value !== 'dark' && value !== 'light') value = localStorage.getItem(THEME_LEGACY);
            return value === 'light' ? 'light' : 'dark';
        } catch (e) {
            return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        }
    }

    function writeTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
            localStorage.setItem(THEME_LEGACY, theme);
        } catch (e) { /* приватный режим - просто не запоминаем */ }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            paint(next);
            writeTheme(next);
        });
    }

    /* Другая открытая вкладка переключается сразу, без перезагрузки. */
    window.addEventListener('storage', function (event) {
        if (event.key === THEME_KEY || event.key === THEME_LEGACY) paint(readTheme());
    });

    var today = document.getElementById('today');
    if (today) {
        var text = new Date().toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        today.textContent = 'Сегодня · ' + text.charAt(0).toUpperCase() + text.slice(1);
    }

    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    /*
     * Страница мягко растворяется перед переходом. Ссылки остаются обычными,
     * поэтому при отключённом JS и при Ctrl+клике всё работает как обычно.
     */
    Array.prototype.forEach.call(document.querySelectorAll('a.card'), function (link) {
        link.addEventListener('click', function (event) {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey ||
                event.shiftKey || event.altKey || event.button !== 0) return;

            var href = link.getAttribute('href');
            if (!href || href.charAt(0) === '#') return;

            event.preventDefault();
            document.body.classList.add('is-leaving');
            window.setTimeout(function () {
                window.location.href = href;
            }, 350);
        });
    });
})();
