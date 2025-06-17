function createGradeCard(course, on_click) {
	const courseTitle = course.name;
	const grades = course.grades;

	const card = document.createElement('div');
	card.id = 'gradeCard';
	card.className = 'course_card';

	const h2 = document.createElement('h2');
	h2.textContent = courseTitle;
	card.appendChild(h2);

	const h3 = document.createElement('h3');
	h3.textContent = 'Calificaciones';
	card.appendChild(h3);

	const table = document.createElement('table');

	const thead = document.createElement('thead');
	thead.innerHTML = `
    <tr>
      <th>Evaluación</th>
      <th>Portal</th>
      <th>LMS</th>
    </tr>
  `;
	table.appendChild(thead);

	const tbody = document.createElement('tbody');
	table.appendChild(tbody);
	card.appendChild(table);

	// Función para rellenar las filas de notas
	function renderGrades(grades) {
		tbody.innerHTML = ''; // limpiar contenido previo
		grades.forEach(({ evaluation_name, portal_grade, lms_grade }) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
        <td>${evaluation_name}</td>
        <td>${portal_grade}</td>
        <td>${lms_grade}</td>
      `;
			tbody.appendChild(tr);
		});
	}

	renderGrades(grades); // render inicial

	const button = document.createElement('button');
	button.className = 'course_card_details_button';
	button.onclick = on_click;
	button.innerHTML = `
    Ver Detalles
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="m12 16 4-4-4-4" />
    </svg>
  `;
	card.appendChild(button);

	return {
		element: card,
		updateGrades(newGrades) {
			renderGrades(newGrades);
		}
	};
}

