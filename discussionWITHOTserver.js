document.addEventListener('DOMContentLoaded', function () {
	const postForm = document.getElementById('postForm');
	const forumPosts = document.getElementById('forumPosts');
	const emptyMessage = document.getElementById('emptyMessage');

	loadPosts(); // загрузить сообщения из localStorage

	postForm.addEventListener('submit', function (e) {
		e.preventDefault();
		const username = document.getElementById('username').value.trim();
		const message = document.getElementById('message').value.trim();
		const replyTo = document.getElementById('replyTo').value;

		if (username && message) {
			addPost(username, message, replyTo);
			postForm.reset();
			document.getElementById('replyTo').value = '';
		}
	});

	function addPost(username, message, replyTo = '') {
		const postId = Date.now().toString();
		const postDate = new Date().toLocaleString();

		const post = document.createElement('div');
		post.classList.add('post');
		if (replyTo) post.classList.add('reply');
		post.dataset.id = postId;

		const processedMessage = processMentions(message);

		post.innerHTML = `
           <h3>${escapeHtml(username)}</h3>
           <div class="post-date">${postDate}</div>
           <p>${processedMessage}</p>
           <div class="post-actions">
               <button class="like-btn" data-id="${postId}" onclick="toggleLike(this)">Нравится (0)</button>
               <button class="reply-btn" onclick="replyToPost('${escapeHtml(username)}', '${postId}')">Ответить</button>
               <button class="delete-btn" onclick="deletePost('${postId}')">Удалить</button>
           </div>
           <hr />
       `;

		if (emptyMessage) emptyMessage.style.display = 'none';

		if (replyTo) {
			const parentPost = document.querySelector(`.post[data-id="${replyTo}"]`);
			if (parentPost) {
				parentPost.parentNode.insertBefore(post, parentPost.nextSibling);
			} else {
				forumPosts.appendChild(post);
			}
		} else {
			forumPosts.appendChild(post);
		}

		savePost(postId, username, message, postDate, replyTo);
	}

	function processMentions(message) {
		return escapeHtml(message).replace(
			/@(\w+)/g,
			'<span class="reply-username">@$1</span>'
		);
	}

	function savePost(id, username, message, date, replyTo = '') {
		let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
		posts.unshift({
			id,
			username,
			message,
			date,
			replyTo,
			likes: 0,
			likedBy: []
		});
		localStorage.setItem('forumPosts', JSON.stringify(posts));
	}

	function loadPosts() {
		let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];

		posts.sort((a, b) => {
			if (a.replyTo && !b.replyTo) return 1;
			if (!a.replyTo && b.replyTo) return -1;
			return b.id - a.id;
		});

		if (posts.length > 0 && emptyMessage) {
			emptyMessage.style.display = 'none';
		} else if (emptyMessage) {
			emptyMessage.style.display = 'block';
		}

		// сначала выводим посты без replyTo (родительские)
		posts.forEach(post => {
			if (!post.replyTo) createPostElement(post);
		});

		// потом выводим ответы
		posts.forEach(post => {
			if (post.replyTo) createPostElement(post);
		});
	}

	function createPostElement(post) {
		const postElement = document.createElement('div');
		postElement.classList.add('post');
		if (post.replyTo) postElement.classList.add('reply');
		postElement.dataset.id = post.id;

		const processedMessage = processMentions(post.message);

		postElement.innerHTML = `
           <h3>${escapeHtml(post.username)}</h3>
           <div class="post-date">${post.date}</div>
           <p>${processedMessage}</p>
           <div class="post-actions">
               <button class="like-btn" data-id="${post.id}" onclick="toggleLike(this)">Нравится (${post.likes || 0})</button>
               <button class="reply-btn" onclick="replyToPost('${escapeHtml(post.username)}', '${post.id}')">Ответить</button>
               <button class="delete-btn" onclick="deletePost('${post.id}')">Удалить</button>
           </div>
           <hr />
       `;

		if (post.replyTo) {
			const parentPost = document.querySelector(`.post[data-id="${post.replyTo}"]`);
			if (parentPost) {
				parentPost.parentNode.insertBefore(postElement, parentPost.nextSibling);
			} else {
				forumPosts.appendChild(postElement);
			}
		} else {
			forumPosts.appendChild(postElement);
		}
	}

	function escapeHtml(unsafe) {
		if (!unsafe) return '';
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
});

// Глобальные функции для кнопок (удалить, лайк, ответить)

function deletePost(postId) {
	let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
	posts = posts.filter(post => post.id != postId && post.replyTo != postId);
	localStorage.setItem('forumPosts', JSON.stringify(posts));

	const forumPosts = document.getElementById('forumPosts');
	if (forumPosts) forumPosts.innerHTML = '';

	const emptyMessage = document.getElementById('emptyMessage');
	if (emptyMessage) emptyMessage.style.display = posts.length === 0 ? 'block' : 'none';

	// Заново загрузить посты после удаления
	document.dispatchEvent(new Event('DOMContentLoaded'));
}

function toggleLike(button) {
	const postId = button.dataset.id;
	let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
	const postIndex = posts.findIndex(post => post.id == postId);

	if (postIndex !== -1) {
		const post = posts[postIndex];
		const currentUser = document.getElementById('username').value.trim() || 'anonymous';
		const userIndex = post.likedBy ? post.likedBy.indexOf(currentUser) : -1;

		if (userIndex === -1) {
			post.likes = (post.likes || 0) + 1;
			if (!post.likedBy) post.likedBy = [];
			post.likedBy.push(currentUser);
			button.textContent = `Не нравится (${post.likes})`;
		} else {
			post.likes = (post.likes || 1) - 1;
			post.likedBy.splice(userIndex, 1);
			button.textContent = `Нравится (${post.likes})`;
		}

		localStorage.setItem('forumPosts', JSON.stringify(posts));
	}
}

function replyToPost(username, postId) {
	const messageInput = document.getElementById('message');
	messageInput.value = `@${username}, `;
	document.getElementById('replyTo').value = postId;
	messageInput.focus();
}