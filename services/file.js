async function registerFile(data) {
	const url = 'http://127.0.0.1:8000/files/register/';
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			console.error('Error al crear evaluación:', response.status, responseText);
			throw new Error(responseText);
		}
		return await response.json();
	} catch (error) {
		console.error('registerFile error:', error);
		throw error;
	}
}
async function getFilesByCourse(course_id) {
	const url = `http://127.0.0.1:8000/files/by-course/${course_id}/`;
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: getAuthHeaders()
		});
		if (!response.ok) throw new Error(`Error al obtener archivos: ${response.status}`);
		return await response.json();
	} catch (error) {
		console.error('getFilesByCourse error:', error);
		throw error;
	}
}
/*
async function updateFileName(file_id, newFilename) {
	const url = `http://127.0.0.1:8000/update-file-name/${file_id}/`;
	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers: getAuthHeaders(),
			body: JSON.stringify({ filename: newFilename })
		});
		if (!response.ok) throw new Error(`Error al actualizar nombre: ${response.status}`);
		return await response.json();
	} catch (error) {
		console.error('updateFileName error:', error);
		throw error;
	}
}
*/
async function deleteFile(file_id) {
	const url = `http://127.0.0.1:8000/delete-file/${file_id}/`;
	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: getAuthHeaders()
		});
		if (!response.ok) throw new Error(`Error al eliminar archivo: ${response.status}`);
		return await response.json();
	} catch (error) {
		console.error('deleteFile error:', error);
		throw error;
	}
}
