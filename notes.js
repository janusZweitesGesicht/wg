document.addEventListener('DOMContentLoaded', function () {
	const notebookBtn = document.querySelector('.notebook');
	const readingPage = document.querySelector('.reading_page');
	const notesWindow = document.getElementById('notesWindow');
	const notesContent = document.querySelector('.notes');
	let draggedText = '';

	notebookBtn.addEventListener('click', function () {
		notesWindow.classList.toggle('active');
		readingPage.classList.toggle('shifted');
	});

	document.addEventListener('selectionchange', function () {
		const selection = window.getSelection();
		draggedText = selection.toString().trim();
	});

	readingPage.addEventListener('dragstart', function (e) {
		const target = e.target;

		if (draggedText && window.getSelection().containsNode(target, true)) {
			e.dataTransfer.setData('text/plain', draggedText);
			e.dataTransfer.effectAllowed = 'copy';
			return;
		}

		if (target && target.closest && target.closest('.reading_page')) {
			if (target.tagName === 'IMG') {
				e.dataTransfer.setData(
					'text/html',
					`<div class="noteItem"><img src="${target.src}" alt="${target.alt}"></div>`
				);
			} else if (
				['P', 'SPAN', 'FIGURE', 'ABBR', 'DIV'].includes(target.tagName)
			) {
				e.dataTransfer.setData(
					'text/html',
					`<div class="noteItem">${target.outerHTML}</div>`
				);
			}

			target.style.opacity = '0.4';
		} else {
			e.preventDefault();
		}
	});

	document.addEventListener('dragend', function (e) {
		if (e.target.style) e.target.style.opacity = '1';
		draggedText = '';
	});

	notesWindow.addEventListener('dragover', function (e) {
		e.preventDefault();

		notesWindow.style.backgroundColor = '#e0d5c0';
	});

	notesWindow.addEventListener('dragleave', function () {
		notesWindow.style.backgroundColor = '#f0e6d2';
	});

	notesWindow.addEventListener('drop', function (e) {
		e.preventDefault();
		notesWindow.style.backgroundColor = '#f0e6d2';

		const note = document.createElement('div');
		note.className = 'note';

		const htmlData = e.dataTransfer.getData('text/html');
		// console.log(htmlData);

		if (htmlData) {
			if (notesContent.children.length > 0) {
				note.insertAdjacentHTML(
					'beforeend',
					'<div class="note-separator"></div>'
				);
			}
			note.insertAdjacentHTML('beforeend', htmlData);
		} else {
			const textData = e.dataTransfer.getData('text/plain');
			if (textData) {
				if (notesContent.children.length > 0) {
					note.insertAdjacentHTML(
						'beforeend',
						'<div class="note-separator"></div>'
					);
				}
				note.insertAdjacentHTML(
					'beforeend',
					`<div class="noteItem">${textData}</div>`
				);
			}
		}

		notesContent.appendChild(note);

		note.style.opacity = '0';
		setTimeout(() => {
			note.style.transition = 'opacity 0.3s ease';
			note.style.opacity = '1';
		}, 10);

		//!
		note.addEventListener('dblclick', function (event) {
			// Ищем конкретный элемент, по которому кликнули
			const target = event.target.closest('.noteItem');
			console.log(1);

			if (!target) return;

			const img = target.querySelector('img');
			const textElement = target.querySelector(':not(img)');

			// Если кликнули на изображение
			if (img) {
				// Плавно удаляем только контейнер noteItem с изображением
				target.style.transition = 'opacity 0.3s ease';
				target.style.opacity = '0';
				setTimeout(() => target.remove(), 300);
			}
			// Если кликнули на текстовый элемент
			else if (textElement) {
				// Включаем редактирование
				textElement.contentEditable = true;
				textElement.focus();

				// Выключаем редактирование при потере фокуса
				textElement.addEventListener('blur', function () {
					this.contentEditable = false;
				});
			}
		});
	});

	//!
});
