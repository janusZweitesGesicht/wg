// const notesContainer = document.getElementById('notes-container');
// let draggedNote = null;

// // Удаление, копирование и вставка — отключены
// document.addEventListener('copy', (e) => e.preventDefault());
// document.addEventListener('cut', (e) => e.preventDefault());
// document.addEventListener('paste', (e) => {
// 	e.preventDefault();
// 	const text = (e.clipboardData || window.clipboardData).getData('text/plain');
// 	const selection = window.getSelection();
// 	if (!selection.rangeCount) return;

// 	const range = selection.getRangeAt(0);
// 	const div = document.createElement('div');
// 	div.style.textAlign = 'justify';
// 	div.style.textIndent = '1em';
// 	div.innerHTML = text.replace(/\n/g, '<br>');
// 	range.deleteContents();
// 	range.insertNode(div);
// 	range.setStartAfter(div);
// 	selection.removeAllRanges();
// 	selection.addRange(range);
// });

// document.getElementById('add-note').addEventListener('click', () => {
// 	const note = document.createElement('div');
// 	note.className = 'note';
// 	note.draggable = true;
// 	note.innerHTML = `
//     <div class="content" contenteditable="true">Новая заметка</div>
//     <div class="delete-button">✖</div>
//     <div class="color-popup">
//       <div class="color-option" style="background-color: white;" data-color="white"></div>
//       <div class="color-option" style="background-color: yellow;" data-color="yellow"></div>
//       <div class="color-option" style="background-color: lightblue;" data-color="lightblue"></div>
//       <div class="color-option" style="background-color: lightgreen;" data-color="lightgreen"></div>
//     </div>
//   `;
// 	notesContainer.appendChild(note);
// 	addNoteEventListeners(note);
// });

// function addNoteEventListeners(note) {
// 	const content = note.querySelector('.content');
// 	const deleteButton = note.querySelector('.delete-button');
// 	const popup = note.querySelector('.color-popup');
// 	const colorOptions = popup.querySelectorAll('.color-option');

// 	note.addEventListener('dragstart', (e) => {
// 		draggedNote = note;
// 		note.classList.add('dragging');
// 	});

// 	note.addEventListener('dragend', (e) => {
// 		draggedNote = null;
// 		note.classList.remove('dragging');
// 	});

// 	notesContainer.addEventListener('dragover', (e) => e.preventDefault());

// 	notesContainer.addEventListener('drop', (e) => {
// 		e.preventDefault();
// 		if (draggedNote && e.target.closest('.note')) {
// 			const targetNote = e.target.closest('.note');
// 			notesContainer.insertBefore(draggedNote, targetNote.nextSibling);
// 		}
// 	});

// 	deleteButton.addEventListener('click', () => {
// 		note.remove();
// 	});

// 	content.addEventListener('mouseup', () => {
// 		const selection = window.getSelection();
// 		if (selection.toString().length > 0) {
// 			popup.style.display = 'block';
// 			const rect = selection.getRangeAt(0).getBoundingClientRect();
// 			popup.style.left = `${rect.left + window.scrollX}px`;
// 			popup.style.top = `${rect.top + window.scrollY - 30}px`;
// 		} else {
// 			popup.style.display = 'none';
// 		}
// 	});

// 	// Закрыть popup при клике вне его
// 	document.addEventListener('click', (e) => {
// 		if (!note.contains(e.target)) {
// 			popup.style.display = 'none';
// 		}
// 	});

// 	colorOptions.forEach((option) => {
// 		option.addEventListener('click', (e) => {
// 			const color = option.getAttribute('data-color');
// 			popup.style.display = 'none';
// 			document.execCommand('backColor', false, color); // окрашиваем выделенный текст
// 		});
// 	});
// }
