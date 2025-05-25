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
//мигание
function animateBlinkGroup(groupClass) {
	const first = document.querySelector(`.${groupClass}.blink-first`);
	const second = document.querySelector(`.${groupClass}.blink-second`);
	const blinkDuration = 300;
	first.style.opacity = '0';
	second.style.opacity = '1';

	setTimeout(() => {
		first.style.opacity = '1';
		second.style.opacity = '0';
		const nextDelay = 3000 + Math.random() * 7000;
		setTimeout(() => animateBlinkGroup(groupClass), nextDelay);
	}, blinkDuration);
}

document.querySelectorAll('[class*="blink-group-"]').forEach((el) => {
	const classList = el.classList;
	const groupClass = Array.from(classList).find((c) =>
		c.startsWith('blink-group-')
	);

	if (groupClass) {
		const initialDelay = 1000 + Math.random() * 5000;
		setTimeout(() => animateBlinkGroup(groupClass), initialDelay);
	}
});
