/*
 * Стартовая страница: тема, дата и мягкий переход по ссылкам.
 * Никаких зависимостей - файл подключается напрямую.
 */
(function () {
    'use strict';

    var KEY = 'hub.theme';
    var root = document.documentElement;
    var themeBtn = document.getElementById('theme-btn');
    var meta = document.querySelector('meta[name="theme-color"]');

    function paint(theme) {
        root.setAttribute('data-theme', theme);
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#08080a' : '#e9e5dd');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            paint(next);
            try {
                localStorage.setItem(KEY, next);
            } catch (e) { /* приватный режим - просто не запоминаем */ }
        });
    }

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
