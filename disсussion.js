document.addEventListener('DOMContentLoaded', function () {
	const postForm = document.getElementById('postForm');
	const forumPosts = document.getElementById('forumPosts');
	const emptyMessage = document.getElementById('emptyMessage');
	const errorMessage = document.getElementById('errorMessage');

	// Загрузка сообщений с сервера
	loadPostsFromServer();

	postForm.addEventListener('submit', async function (e) {
		e.preventDefault();
		const username = document.getElementById('username').value.trim();
		const message = document.getElementById('message').value.trim();

		if (username && message) {
			try {
				await sendPostToServer(username, message);
				postForm.reset();
				errorMessage.textContent = '';
			} catch (error) {
				errorMessage.textContent =
					'Ошибка при отправке сообщения. Попробуйте позже.';
				console.error('Ошибка:', error);
			}
		}
	});

	// Отправка поста на сервер
	async function sendPostToServer(username, message) {
		const response = await fetch('https://ваш-сервер.com/api/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				message
			})
		});

		if (!response.ok) {
			throw new Error('Ошибка сервера');
		}

		const newPost = await response.json();
		renderPost(newPost);
	}

	// Загрузка постов с сервера
	async function loadPostsFromServer() {
		try {
			const response = await fetch('https://ваш-сервер.com/api/posts');
			const posts = await response.json();

			if (posts.length === 0) {
				emptyMessage.textContent = 'Пока нет сообщений. Будьте первым!';
			} else {
				emptyMessage.style.display = 'none';
				posts.forEach((post) => renderPost(post));
			}
		} catch (error) {
			emptyMessage.textContent =
				'Не удалось загрузить сообщения. Обновите страницу.';
			console.error('Ошибка загрузки:', error);
		}
	}

	// Отрисовка поста
	function renderPost(post) {
		if (emptyMessage) {
			emptyMessage.style.display = 'none';
		}

		const postElement = document.createElement('div');
		postElement.classList.add('post');
		postElement.innerHTML = `
         <h3>${escapeHtml(post.username)}</h3>
         <div class="post-date">${new Date(post.date).toLocaleString()}</div>
         <p>${escapeHtml(post.message)}</p>
         <div class="post-actions">
            <button class="like-btn" onclick="toggleLike(this, '${post.id
			}')">Нравится (${post.likes || 0})</button>
            <button class="reply-btn" onclick="replyToPost('${escapeHtml(
				post.username
			)}')">Ответить</button>
         </div>
         <hr />
      `;
		forumPosts.appendChild(postElement);
	}

	// Экранирование HTML
	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
});

// Глобальные функции для обработки событий
async function toggleLike(button, postId) {
	try {
		const response = await fetch(
			`https://ваш-сервер.com/api/posts/${postId}/like`,
			{
				method: 'POST'
			}
		);
		const data = await response.json();
		button.textContent = `Нравится (${data.likes})`;
	} catch (error) {
		console.error('Ошибка лайка:', error);
	}
}

function replyToPost(username) {
	const messageInput = document.getElementById('message');
	messageInput.value = `@${username}, `;
	messageInput.focus();
}
