async function getEvaluations(course_id) {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		throw new Error('Token no encontrado. El usuario no ha iniciado sesión.');
	}
	const url = `http://127.0.0.1:8000/evaluations/${course_id}/`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) {
			throw new Error(`Error al obtener evaluaciones: ${response.status}`);
		}
		const data = await response.json();
		console.log('Evaluaciones:', data);
		return data;
	} catch (error) {
		console.error('Error en getEvaluations:', error);
		throw error;
	}
}

function getAuthHeaders() {
	const token = localStorage.getItem('accessToken');
	if (!token) throw new Error('Token no disponible');
	return {
		'Authorization': `Bearer ${token}`,
		'Content-Type': 'application/json'
	};
}

async function createEvaluation(data) {
	const url = 'http://127.0.0.1:8000/evaluations/';
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify(data)
		});

		const responseText = await response.text();

		if (!response.ok) {
			console.error('Error al crear evaluación:', response.status, responseText);
			throw new Error(responseText);
		}

		const result = JSON.parse(responseText);
		console.log('Evaluación creada:', result);
		return result;

	} catch (error) {
		console.error('Catch error:', error);
		throw error;
	}
}

async function updateEvaluation(data) {
	const url = 'http://127.0.0.1:8000/evaluations/edit/';
	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers: getAuthHeaders(),
			body: JSON.stringify(data)
		});

		if (!response.ok) throw new Error(`Error al actualizar evaluación: ${response.status}`);
		const result = await response.json();
		console.log('Evaluación actualizada:', result);
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteEvaluationById(evaluation_id) {
	const url = `http://127.0.0.1:8000/evaluations/delete/${evaluation_id}/`;
	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: getAuthHeaders()
		});

		if (!response.ok) throw new Error(`Error al eliminar evaluación: ${response.status}`);
		const result = await response.json();
		console.log('Evaluación eliminada:', result);
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
