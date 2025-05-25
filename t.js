// ------------------------
// const saveSnapshotBtn = document.getElementById('saveSnapshot');
// const loadSnapshotBtn = document.getElementById('loadSnapshot');

// // Загрузка заметок при старте
// loadNotes();

// // Функция сохранения заметок
// function saveNotes() {
// 	localStorage.setItem('notes', notesContent.innerHTML);
// }

// // Функция загрузки заметок
// function loadNotes() {
// 	const savedNotes = localStorage.getItem('notes');
// 	if (savedNotes) {
// 		notesContent.innerHTML = savedNotes;
// 		notesContent.querySelectorAll('.note').forEach((note) => {
// 			addNoteEventListeners(note);
// 		});
// 	}
// }

// // Обработчики для снапшотов
// saveSnapshotBtn.addEventListener('click', () => {
// 	localStorage.setItem('notes_snapshot', notesContent.innerHTML);
// });

// loadSnapshotBtn.addEventListener('click', () => {
// 	const snapshot = localStorage.getItem('notes_snapshot');
// 	if (snapshot) {
// 		notesContent.innerHTML = snapshot;
// 		notesContent.querySelectorAll('.note').forEach((note) => {
// 			addNoteEventListeners(note);
// 		});
// 		saveNotes();
// 	}
// });

// // Общая функция для обработки заметок
// function addNoteEventListeners(note) {
// 	note.addEventListener('dblclick', function () {
// 		const img = this.querySelector('img');
// 		const textElement = this.querySelector(
// 			'.noteItem, p, span, div:not(.note-separator), abbr, i, dfn'
// 		);

// 		if (img) {
// 			img.style.opacity = '0';
// 			setTimeout(() => {
// 				this.remove();
// 				saveNotes();
// 			}, 300);
// 		}

// 		if (textElement && !img) {
// 			this.contentEditable = true;
// 			this.focus();
// 			textElement.addEventListener('blur', function () {
// 				this.contentEditable = false;
// 				saveNotes();
// 			});
// 		}
// 	});
// }

// // В обработчике drop заменим
// notesContent.appendChild(note);
// addNoteEventListeners(note);
// note.style.opacity = '0';
// setTimeout(() => {
// 	note.style.opacity = '1';
// }, 10);
// saveNotes(); // Добавляем сохранение

// -------------------
