document.addEventListener('DOMContentLoaded', function () {
	const popup = document.getElementById('popup'); //это элемент , который появляетс при нажатии на назв главы
	if (popup) {
		const popupTitle = document.getElementById('popup-title');
		const popupList = document.getElementById('popup-list');
		const closeBtn = document.querySelector('.close-btn');

		const subTopics = {
			'Когнитивное восприятие': [
				{ name: 'Введение', link: '#' },
				{ name: 'Теории', link: '#' },
				{ name: 'Примеры', link: '#' }
			],
			'Представление графики в цифровом формате': [
				{ name: 'Растровая графика', link: '#' },
				{ name: 'Векторная графика', link: '#' },
				{ name: '3D графика', link: '#' }
			],
			'Веб-программирование': [
				{ name: 'HTML & CSS', link: 'read.html' },
				{ name: 'JavaScript', link: '#' },
				{ name: 'Фреймворки', link: '#' }
			],
			Мультимедиа: [
				{ name: 'Аудио', link: '#' },
				{ name: 'Видео', link: '#' },
				{ name: 'Анимация', link: '#' }
			]
		};

		document.querySelectorAll('.nav-text').forEach((item) => {
			item.addEventListener('click', function () {
				const topic = this.innerText;
				popupTitle.innerText = topic;
				popupList.innerHTML = '';
				subTopics[topic].forEach((sub) => {
					const li = document.createElement('li');
					const a = document.createElement('a');
					a.textContent = sub.name;
					a.href = sub.link;
					a.classList.add('popup-link');
					li.appendChild(a);
					popupList.appendChild(li);
				});
				popup.style.display = 'block';
			});
		});

		closeBtn.addEventListener('click', () => {
			popup.style.display = 'none';
		});

		window.addEventListener('click', (event) => {
			if (event.target === popup) {
				popup.style.display = 'none';
			}
		});
	}
});

//анимка точек при наведении на главу
document.querySelectorAll('.navigation-item').forEach((item) => {
	const text = item.querySelector('.nav-text');
	const dot = item.querySelector('.dot');
	if (text && dot) {
		text.addEventListener('mouseout', () => {
			dot.style.boxShadow = '0 2px 8px rgba(43, 204, 112, 0.5)';
		});

		text.addEventListener('mouseover', () => {
			dot.style.boxShadow = '0 0px 28px rgba(43, 204, 112, 0.5)';
		});
	}
});

const startButton = document.getElementById('startButton'); //да, я сделал это так, мне пофиг
if (startButton) {
	startButton.addEventListener('click', function () {
		window.location.href = 'read.html'; //!!!!!
	});
}
