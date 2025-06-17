async function get_portal_grades() {
	const username = localStorage.getItem('username');
	const password = localStorage.getItem('password');
	if (!username) throw new Error('user no disponible');
	if (!password) throw new Error('password no disponible');
	try {
		const response = await fetch('https://ucm-api.onrender.com/api/notas_portal', {
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
		let format = transformarCursos(data);
		console.log('Evaluaciones PORTAL:', format);
		return format;		
	} catch (error) {
		//
	}
}

async function get_lms_grades() {
	const username = localStorage.getItem('username');
	const password = localStorage.getItem('password');
	if (!username) throw new Error('user no disponible');
	if (!password) throw new Error('password no disponible');
	try {
		const response = await fetch('https://ucm-api.onrender.com/api/notas_lms', {
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
		console.log('Evaluaciones LMS:', data);		
	} catch (error) {
		//
	}
}

function transformarCursos(data) {
    return data.map(curso => ({
        id: curso.CODIGO_CURSO,
        name: curso.NOMBRE_CURSO,
        grades: curso.NOTAS.map(nota => ({
            evaluation_name: nota.DESCRIPCION,
            portal_grade: nota.NOTA.replace(',', '.') || "--",
			lms_grade: "--",
            porcentaje: nota.PORCENTAJE
        })),
		files: [],
		events: []
    }));
}
