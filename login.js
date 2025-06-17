window.addEventListener('load', function () {
	openLoginModal()
});

function openLoginModal() {
	document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
	document.getElementById('loginModal').classList.remove('active');
	document.getElementById('loginForm').reset();
}

async function handleLogin() {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const rememberMe = document.getElementById('rememberMe').checked;

	if (!username || !password) {
		alert('Por favor ingresa tu nombre de usuario y contraseña');
		return;
	}

	try {
		const response = await fetch('http://127.0.0.1:8000/login/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user: username,
				password: password
			})
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		const data = await response.json();
		console.log('Token guardado:', data.access);
		localStorage.setItem('accessToken', data.access);
		localStorage.setItem('username', username);
		localStorage.setItem('password', password);
		closeLoginModal();
		loadContent();

	} catch (error) {
		console.error('Error durante el login:', error);
		alert('Error al iniciar sesión. Verifica tus credenciales.');
	}
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('loginModal').addEventListener('click', function (e) {
		if (e.target === this) {
			closeLoginModal();
		}
	});

	document.getElementById('loginForm').addEventListener('keydown', function (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleLogin();
		}
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && document.getElementById('loginModal').classList.contains('active')) {
			closeLoginModal();
		}
	});

	document.getElementById('loginButton').addEventListener('click', handleLogin);
});
