document.addEventListener('DOMContentLoaded', function () {
	const notebookBtn = document.querySelector('.notebook');
	const readingPage = document.querySelector('.reading_page');
	const notesWindow = document.getElementById('notesWindow');
	const notesContent = document.querySelector('.notes');
	let draggedText = '';
	let notes = loadNotesFromStorage();
	let draggedNote = null;
	let dragPlaceholder = null;

	initializeNotes();
	setupMobileSupport();

	notebookBtn.addEventListener('click', function () {
		notesWindow.classList.toggle('active');
		readingPage.classList.toggle('shifted');
	});

	function loadNotesFromStorage() {
		try {
			const stored = localStorage.getItem('readingNotes');
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error('Error loading notes from storage:', error);
			return [];
		}
	}

	function saveNotesToStorage() {
		try {
			localStorage.setItem('readingNotes', JSON.stringify(notes));
		} catch (error) {
			console.error('Error saving notes to storage:', error);
		}
	}

	function initializeNotes() {
		notesContent.innerHTML = '';
		notes.forEach((note, index) => {
			createNoteElement(note, index);
		});
	}

	function createNoteElement(note, index) {
		const noteEl = document.createElement('div');
		noteEl.className = 'note-item';
		noteEl.draggable = true;
		noteEl.dataset.index = index;

		if (note.type === 'text') {
			noteEl.innerHTML = `
                <div class="note-content" contenteditable="false">${note.content}</div>
                <div class="note-actions" style="display: none;">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                    <button class="save-btn" style="display: none;">Save</button>
                    <button class="cancel-btn" style="display: none;">Cancel</button>
                </div>
            `;
		} else if (note.type === 'image') {
			noteEl.innerHTML = `
                <div class="note-content">${note.content}</div>
                <div class="note-actions" style="display: none;">
                    <button class="delete-btn">Delete</button>
                </div>
            `;
		}

		noteEl.addEventListener('dblclick', function () {
			const actions = noteEl.querySelector('.note-actions');
			actions.style.display =
				actions.style.display === 'none' ? 'block' : 'none';
		});

		const editBtn = noteEl.querySelector('.edit-btn');
		if (editBtn) {
			editBtn.addEventListener('click', function () {
				startEditing(noteEl, index);
			});
		}

		const deleteBtn = noteEl.querySelector('.delete-btn');
		deleteBtn.addEventListener('click', function () {
			deleteNote(index);
		});

		const saveBtn = noteEl.querySelector('.save-btn');
		if (saveBtn) {
			saveBtn.addEventListener('click', function () {
				saveEdit(noteEl, index);
			});
		}

		const cancelBtn = noteEl.querySelector('.cancel-btn');
		if (cancelBtn) {
			cancelBtn.addEventListener('click', function () {
				cancelEdit(noteEl, index);
			});
		}

		noteEl.addEventListener('dragstart', function (e) {
			draggedNote = this;
			this.style.opacity = '0.5';

			dragPlaceholder = document.createElement('div');
			dragPlaceholder.className = 'drag-placeholder';
			dragPlaceholder.innerHTML = 'Drop note here';
		});

		noteEl.addEventListener('dragend', function () {
			this.style.opacity = '1';
			draggedNote = null;
			if (dragPlaceholder && dragPlaceholder.parentNode) {
				dragPlaceholder.parentNode.removeChild(dragPlaceholder);
			}
		});

		noteEl.addEventListener('dragover', function (e) {
			e.preventDefault();
			if (draggedNote && draggedNote !== this) {
				const rect = this.getBoundingClientRect();
				const midpoint = rect.top + rect.height / 2;

				if (e.clientY < midpoint) {
					this.parentNode.insertBefore(dragPlaceholder, this);
				} else {
					this.parentNode.insertBefore(dragPlaceholder, this.nextSibling);
				}
			}
		});

		noteEl.addEventListener('drop', function (e) {
			e.preventDefault();
			if (draggedNote && dragPlaceholder.parentNode) {
				const fromIndex = parseInt(draggedNote.dataset.index);
				const toIndex = Array.from(notesContent.children).indexOf(
					dragPlaceholder
				);

				reorderNotes(fromIndex, toIndex);
				dragPlaceholder.parentNode.removeChild(dragPlaceholder);
			}
		});

		notesContent.appendChild(noteEl);
	}

	function startEditing(noteEl, index) {
		const content = noteEl.querySelector('.note-content');
		const editBtn = noteEl.querySelector('.edit-btn');
		const saveBtn = noteEl.querySelector('.save-btn');
		const cancelBtn = noteEl.querySelector('.cancel-btn');

		content.contentEditable = true;
		content.focus();
		editBtn.style.display = 'none';
		saveBtn.style.display = 'inline-block';
		cancelBtn.style.display = 'inline-block';

		noteEl.dataset.originalContent = content.innerHTML;
	}

	function saveEdit(noteEl, index) {
		const content = noteEl.querySelector('.note-content');
		const editBtn = noteEl.querySelector('.edit-btn');
		const saveBtn = noteEl.querySelector('.save-btn');
		const cancelBtn = noteEl.querySelector('.cancel-btn');

		notes[index].content = content.innerHTML;
		saveNotesToStorage();

		content.contentEditable = false;
		editBtn.style.display = 'inline-block';
		saveBtn.style.display = 'none';
		cancelBtn.style.display = 'none';

		delete noteEl.dataset.originalContent;
	}

	function cancelEdit(noteEl, index) {
		const content = noteEl.querySelector('.note-content');
		const editBtn = noteEl.querySelector('.edit-btn');
		const saveBtn = noteEl.querySelector('.save-btn');
		const cancelBtn = noteEl.querySelector('.cancel-btn');

		content.innerHTML = noteEl.dataset.originalContent;
		content.contentEditable = false;
		editBtn.style.display = 'inline-block';
		saveBtn.style.display = 'none';
		cancelBtn.style.display = 'none';

		delete noteEl.dataset.originalContent;
	}

	function deleteNote(index) {
		if (confirm('Вы хотите удалить заметку?')) {
			notes.splice(index, 1);
			saveNotesToStorage();
			initializeNotes();
		}
	}
	function reorderNotes(fromIndex, toIndex) {
		const note = notes.splice(fromIndex, 1)[0];
		notes.splice(toIndex, 0, note);
		saveNotesToStorage();
		initializeNotes();
	}

	function addNote(content, type = 'text') {
		const note = {
			id: Date.now(),
			content: content,
			type: type,
			timestamp: new Date().toISOString()
		};

		notes.push(note);
		saveNotesToStorage();
		createNoteElement(note, notes.length - 1);
	}

	function setupMobileSupport() {
		let selectionTooltip = null;

		function isMobileDevice() {
			return (
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				) || window.innerWidth <= 768
			);
		}

		function showSelectionTooltip(selection, rect) {
			removeSelectionTooltip();

			selectionTooltip = document.createElement('div');
			selectionTooltip.className = 'selection-tooltip';
			selectionTooltip.innerHTML = 'Add to notes';
			selectionTooltip.style.cssText = `
                position: fixed;
                top: ${rect.top - 40}px;
                left: ${rect.left + rect.width / 2 - 50}px;
                background: #333;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                z-index: 10000;
                user-select: none;
            `;

			selectionTooltip.addEventListener('click', function () {
				addNote(selection.toString());
				removeSelectionTooltip();
				selection.removeAllRanges();
			});

			document.body.appendChild(selectionTooltip);

			setTimeout(removeSelectionTooltip, 3000);
		}

		function removeSelectionTooltip() {
			if (selectionTooltip) {
				selectionTooltip.remove();
				selectionTooltip = null;
			}
		}
		//??? добавить толко для мобилки
		// if (isMobileDevice()) {
		document.addEventListener('selectionchange', function () {
			const selection = window.getSelection();
			const selectedText = selection.toString().trim();

			if (selectedText.length > 0) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();

				setTimeout(() => {
					if (window.getSelection().toString().trim() === selectedText) {
						showSelectionTooltip(selection, rect);
					}
				}, 500);
			} else {
				removeSelectionTooltip();
			}
		});

		document.addEventListener('click', removeSelectionTooltip);
		// }
	}

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
				e.dataTransfer.setData('text/html', target.outerHTML);
			} else if (
				['P', 'SPAN', 'FIGURE', 'ABBR', 'DIV'].includes(target.tagName)
			) {
				e.dataTransfer.setData('text/html', target.outerHTML);
			}
		}
	});

	notesContent.addEventListener('dragover', function (e) {
		e.preventDefault();
	});

	notesContent.addEventListener('drop', function (e) {
		e.preventDefault();
		const htmlData = e.dataTransfer.getData('text/html');
		const textData = e.dataTransfer.getData('text/plain');

		if (htmlData) {
			const isImage = htmlData.includes('<img');
			addNote(htmlData, isImage ? 'image' : 'text');
		} else if (textData) {
			addNote(textData, 'text');
		}
	});
});
