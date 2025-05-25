window.addEventListener('scroll', () => {
	const progressBar = document.getElementById('progressbar');
	const totalHeight = document.body.scrollHeight - window.innerHeight;
	const progress = (window.scrollY / totalHeight) * 100;
	progressBar.style.width = progress + '%';
});

//назад
document.querySelector('.back-btn').addEventListener('click', () => {
	window.location.href = 'index.html';
});

// Листание главы влево
document.querySelector('.toggler-left a').addEventListener('click', (e) => {
	e.preventDefault();
	window.location.href = 'index.html';
});

// Листание главы вправо
document.querySelector('.toggler-right a').addEventListener('click', (e) => {
	e.preventDefault();
	alert('Переключение на следующую главу.');
});

// Закладка
document.addEventListener('DOMContentLoaded', () => {
	const currentUrl = window.location.href;
	const savedUrl = localStorage.getItem('bookmarkUrl');
	const bookmarkBtn = document.querySelector('.bookmark');

	if (savedUrl === currentUrl) {
		bookmarkBtn.classList.add('active');
	}
});

document.querySelector('.bookmark').addEventListener('click', () => {
	const bookmarkBtn = document.querySelector('.bookmark');
	const currentUrl = window.location.href;
	const savedUrl = localStorage.getItem('bookmarkUrl');

	if (savedUrl === currentUrl) {
		localStorage.removeItem('bookmarkUrl');
		bookmarkBtn.classList.remove('active');
	} else {
		localStorage.setItem('bookmarkUrl', currentUrl);
		bookmarkBtn.classList.add('active');
	}
});

//Смена темы
const themeBtn = document.querySelector('.changeTheme');

const savedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
	document.body.classList.toggle('light-theme', savedTheme === 'light');
} else {
	document.body.classList.toggle('light-theme', !systemDark);
}

themeBtn.addEventListener('click', () => {
	const isLight = document.body.classList.toggle('light-theme');
	const theme = isLight ? 'light' : 'dark';
	localStorage.setItem('theme', theme);
});

window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			document.body.classList.toggle('light-theme', !e.matches);
		}
	});

// Беседа
document.querySelector('.conversation').addEventListener('click', () => {
	window.location.href = 'discussion.html';
});

//копировать код
function copyCode(button) {
	const codeBlock = button.previousElementSibling;
	const code = codeBlock.innerText;
	navigator.clipboard.writeText(code).then(() => {
		button.textContent = '✅';
		setTimeout(() => {
			button.textContent = '📋';
		}, 1500);
	});
}

function randomBlink() {
	const path1 = document.getElementById('path1');
	const path2 = document.getElementById('path2');

	// Анимация мигания
	path1.style.opacity = '0';
	path2.style.opacity = '1';

	setTimeout(() => {
		path1.style.opacity = '1';
		path2.style.opacity = '0';
	}, 300); // Длительность мигания (0.3s)

	// Случайный интервал до следующего мигания (3-10 секунд)
	const nextTime = 3000 + Math.random() * 7000;
	setTimeout(randomBlink, nextTime);
}

// Запускаем первый раз через случайный интервал
setTimeout(randomBlink, 3000 + Math.random() * 7000);
