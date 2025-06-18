const courses = [
	{
		id: 101,
		name: "Calculo 1",
		grades: [
			{
				evaluation_name: "Evaluación 1",
				portal_grade: 8.2,
				lms_grade: null
			},
			{
				evaluation_name: "Evaluación 2",
				portal_grade: 7.0,
				lms_grade: 7.0
			},
			{
				evaluation_name: "Evaluación 3",
				portal_grade: 6.0,
				lms_grade: 5.0
			}
		],
		files: [
			{
				filename: 'Resumen Capítulo 33.docx',
				size: '1.2 MB',
				student_id: 'Juan Pérez',
				url: '#'
			},
			{
				filename: 'Guía de Ejercicios.pdf',
				size: '2.5 MB',
				student_id: 'Dr. Martínez',
				url: '#'
			}
		],
		events: [
			{
				id: 1,
				evaluation_name: 'Prueba Diagnóstica',
				description: 'Primera evaluación del semestre',
				evaluation_date: '2025-07-02T09:00:00'
			},
			{
				id: 2,
				evaluation_name: 'Prueba 1',
				description: 'Incluye unidades 1 y 2',
				evaluation_date: '2025-08-14T11:00:00'
			},
			{
				id: 3,
				evaluation_name: 'Examen Parcial',
				description: 'Evaluación acumulativa',
				evaluation_date: '2025-09-30T08:30:00'
			}
		]
	},
	{
		id: 102,
		name: "Física General",
		grades: [
			{
				evaluation_name: "Laboratorio 1",
				portal_grade: 9.0,
				lms_grade: 9.5
			},
			{
				evaluation_name: "Evaluación Parcial",
				portal_grade: 7.5,
				lms_grade: 7.0
			},
			{
				evaluation_name: "Proyecto Final",
				portal_grade: 8.7,
				lms_grade: null
			}
		],
		files: [
			{
				filename: 'Informe Laboratorio 1.pdf',
				size: '3.4 MB',
				student_id: 'Ana Gómez',
				url: '#'
			},
			{
				filename: 'Apuntes de Física.docx',
				size: '1.1 MB',
				student_id: 'Prof. López',
				url: '#'
			}
		],
		events: [
			{
				id: 4,
				evaluation_name: 'Examen Parcial',
				description: 'Primer examen parcial del curso',
				evaluation_date: '2025-07-15T10:00:00'
			},
			{
				id: 5,
				evaluation_name: 'Entrega Proyecto',
				description: 'Fecha límite para entrega de proyecto',
				evaluation_date: '2025-09-05T23:59:00'
			},
			{
				id: 6,
				evaluation_name: 'Examen Final',
				description: 'Evaluación final del semestre',
				evaluation_date: '2025-10-20T09:00:00'
			}
		]
	},
	{
		id: 103,
		name: "Programación Básica",
		grades: [
			{
				evaluation_name: "Quiz 1",
				portal_grade: 8.8,
				lms_grade: 9.0
			},
			{
				evaluation_name: "Quiz 2",
				portal_grade: 7.5,
				lms_grade: 7.0
			},
			{
				evaluation_name: "Proyecto Final",
				portal_grade: null,
				lms_grade: 9.2
			}
		],
		files: [
			{
				filename: 'Ejercicios Semana 3.zip',
				size: '5.6 MB',
				student_id: 'Carlos Ruiz',
				url: '#'
			},
			{
				filename: 'Guía de Laboratorio.pdf',
				size: '2.0 MB',
				student_id: 'Ing. Fernández',
				url: '#'
			}
		],
		events: [
			{
				id: 7,
				evaluation_name: 'Entrega Quiz 1',
				description: 'Evaluación corta sobre variables y tipos',
				evaluation_date: '2025-07-10T14:00:00'
			},
			{
				id: 8,
				evaluation_name: 'Examen Parcial',
				description: 'Prueba sobre estructuras de control',
				evaluation_date: '2025-08-22T16:00:00'
			},
			{
				id: 9,
				evaluation_name: 'Presentación Proyecto',
				description: 'Defensa del proyecto final',
				evaluation_date: '2025-10-01T13:00:00'
			}
		]
	},
	{
		id: 104,
		name: "Historia Mundial",
		grades: [
			{
				evaluation_name: "Ensayo 1",
				portal_grade: 9.5,
				lms_grade: 9.0
			},
			{
				evaluation_name: "Examen Parcial",
				portal_grade: 8.0,
				lms_grade: 8.0
			},
			{
				evaluation_name: "Examen Final",
				portal_grade: 7.5,
				lms_grade: null
			}
		],
		files: [
			{
				filename: 'Cronología Edad Media.pdf',
				size: '1.8 MB',
				student_id: 'María Sánchez',
				url: '#'
			},
			{
				filename: 'Mapa Conceptual.pptx',
				size: '3.0 MB',
				student_id: 'Prof. Ramírez',
				url: '#'
			}
		],
		events: [
			{
				id: 10,
				evaluation_name: 'Debate',
				description: 'Debate sobre la Revolución Francesa',
				evaluation_date: '2025-07-25T12:00:00'
			},
			{
				id: 11,
				evaluation_name: 'Examen Parcial',
				description: 'Preguntas sobre Edad Moderna',
				evaluation_date: '2025-09-10T09:30:00'
			},
			{
				id: 12,
				evaluation_name: 'Examen Final',
				description: 'Evaluación final del curso',
				evaluation_date: '2025-10-25T08:00:00'
			}
		]
	}
];

let portal_courses = [];
async function loadContent() {
	portal_courses = await get_portal_grades();

	portal_courses.map(x => {
		x.is_full_loaded = false;
		let card = createGradeCard(x, () => { openCourseDetail(x) });
		document.getElementById('course_card_container').appendChild(card.element);
	});

	await Promise.all(
		portal_courses.map(async x => {
			let files = [];
			let events = [];

			try {
				files = await getFilesByCourse(x.id);
			} catch (error) {
				console.error(`Error cargando archivos para el curso ${x.id}:`, error);
			}

			try {
				events = await getEvaluations(x.id);
			} catch (error) {
				console.error(`Error cargando evaluaciones para el curso ${x.id}:`, error);
			}

			x.files = files;
			x.events = events;
			x.is_full_loaded = true;
			console.log("Mutado:", x);
		})
	);
}

let current_course_id = "";
function openCourseDetail(course) {
	RenderCourseDetails(course)
	current_course_id = course.id;
	openCourseDetailModal()
}

/*
let portal_courses = get_portal_grades();

portal_courses.map(x => {
	let card = createGradeCard(x, () => {openCourseDetail(x)});
	document.getElementById('course_card_container').appendChild(card.element);
})		
*/