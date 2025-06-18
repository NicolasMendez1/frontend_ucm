const CONFIG = {
	API_BASE_URL: 'http://127.0.0.1:8000',
	SUBJECT_ID: 101
};

const Utils = {
	formatDate(dateString) {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, "0");
		const month = date.toLocaleString("es-ES", { month: "short" });
		return `${day} ${month}`;
	},

	formatTime(dateString) {
		const date = new Date(dateString);
		return date.toLocaleTimeString("es-ES", {
			hour: "2-digit",
			minute: "2-digit"
		});
	},

	formatMonthYear(dateString) {
		const date = new Date(dateString);
		const month = date.toLocaleString("es-ES", { month: "long" });
		const year = date.getFullYear();
		return `${month} de ${year}`;
	},

	showError(message) {
		console.error(message);
	}
};

const ApiService = {
	async getEvaluations(subjectId) {
		try {
			const response = await fetch(`${CONFIG.API_BASE_URL}/evaluations/${subjectId}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			Utils.showError('Error al cargar evaluaciones: ' + error.message);
			return [];
		}
	},

	async deleteEvaluation(eventId) {
		try {
			const response = await fetch(`${CONFIG.API_BASE_URL}/evaluations/${eventId}`, {
				method: 'DELETE'
			});
			return response.ok;
		} catch (error) {
			Utils.showError('Error al eliminar evento: ' + error.message);
			return false;
		}
	},
	async getFilesByCourse(courseId) {
		try {
			const response = await fetch(`${CONFIG.API_BASE_URL}/files/by-course/${courseId}`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return await response.json();
		} catch (error) {
			Utils.showError('Error al cargar archivos: ' + error.message);
			return [];
		}
	}
};

const TabManager = {
	init() {
		const navTabs = document.getElementById('nav-tabs');
		navTabs.addEventListener('click', this.handleTabClick.bind(this));
	},

	handleTabClick(event) {
		const tabButton = event.target.closest('.nav-item');
		if (!tabButton) return;

		const tabName = tabButton.dataset.tab;
		this.showTab(tabName);
	},

	showTab(tabName) {
		document.querySelectorAll('.tab-content').forEach(tab => {
			tab.classList.remove('active');
		});

		document.querySelectorAll('.nav-item').forEach(item => {
			item.classList.remove('active');
		});

		const targetTab = document.getElementById(tabName);
		const targetButton = document.querySelector(`[data-tab="${tabName}"]`);

		if (targetTab && targetButton) {
			targetTab.classList.add('active');
			targetButton.classList.add('active');
		}
	}
};

const CalendarManager = {
	render(events) {
		const container = document.getElementById('calendar-container');
		container.innerHTML = '<div class="loading">Cargando eventos...</div>';

		if (events.length === 0) {
			container.innerHTML = '<div class="loading">No hay eventos programados</div>';
			return;
		}

		this.renderEvents(events);
	},

	renderEvents(events) {
		const container = document.getElementById('calendar-container');
		container.innerHTML = '';

		const grouped = this.groupEventsByMonth(events);

		Object.entries(grouped).forEach(([monthYear, eventList]) => {
			const monthSection = this.createMonthSection(monthYear, eventList);
			container.appendChild(monthSection);
		});
	},

	groupEventsByMonth(events) {
		const grouped = {};

		events.forEach(event => {
			const monthYear = Utils.formatMonthYear(event.evaluation_date);

			if (!grouped[monthYear]) {
				grouped[monthYear] = [];
			}

			grouped[monthYear].push({
				...event,
				dateObj: new Date(event.evaluation_date)
			});
		});

		Object.values(grouped).forEach(eventList => {
			eventList.sort((a, b) => a.dateObj - b.dateObj);
		});

		return grouped;
	},

	createMonthSection(monthYear, events) {
		const monthSection = document.createElement('div');
		monthSection.className = 'month-section';

		const header = document.createElement('div');
		header.className = 'month-header';
		header.innerHTML = `
			<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
				<line x1="16" x2="16" y1="2" y2="6"/>
				<line x1="8" x2="8" y1="2" y2="6"/>
				<line x1="3" x2="21" y1="10" y2="10"/>
			</svg>
			${monthYear}
		`;
		monthSection.appendChild(header);

		events.forEach(event => {
			const eventElement = this.createEventElement(event);
			monthSection.appendChild(eventElement);
		});

		return monthSection;
	},

	createEventElement(event) {
		const eventId = event.id;
		const eventItem = document.createElement('div');
		eventItem.className = 'event-item';
		eventItem.innerHTML = /*html*/`
			<div class="event-date">${Utils.formatDate(event.evaluation_date)}</div>
			<div class="event-details">
				<h4>${event.evaluation_name}</h4>
				<p>${event.description || ''}</p>
				<span class="event-author">Hora: ${Utils.formatTime(event.evaluation_date)}</span>
			</div>
			<div class="event-actions">
				<button class="btn-delete" title="Eliminar evento">
					<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 6h18"/>
						<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
						<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
						<line x1="10" x2="10" y1="11" y2="17"/>
						<line x1="14" x2="14" y1="11" y2="17"/>
					</svg>
				</button>
			</div>
		`;

		const deleteBtn = eventItem.querySelector('.btn-delete');
		deleteBtn.addEventListener('click', async () => {
			const confirmed = confirm(`¿Estás seguro de que quieres eliminar el evento "${event.evaluation_name}"?`);
			if (!confirmed) return;

			const success = await deleteEvaluationById(eventId);
			if (success) {
				eventItem.remove();
			}
		});

		return eventItem;
	}
};

const FileManager = {
	render(files) {
		const tableBody = document.querySelector('#files .table tbody');
		tableBody.innerHTML = `<tr><td colspan="4">Cargando archivos...</td></tr>`;

		if (files.length === 0) {
			tableBody.innerHTML = `<tr><td colspan="4">No hay archivos disponibles.</td></tr>`;
			return;
		}

		tableBody.innerHTML = '';
		files.forEach(file => {
			const row = this.createFileRow(file);
			tableBody.appendChild(row);
		});
	},

	createFileRow(file) {
		const row = document.createElement('tr');

		row.innerHTML = /*html*/ `
            <td>${file.filename}</td>
            <td>${file.size}</td>
            <td>${file.student_id}</td>
            <td>
                <button class="btn-download" data-url="${file.url}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                </button>
            </td>
        `;

		return row;
	},

};

const GradeManager = {
	render(grades) {
		const tableBody = document.querySelector('#grades .table tbody');
		const avgPortalEl = document.querySelector('.score_average_card:nth-child(1) .score_average_card_value');
		const avgLmsEl = document.querySelector('.score_average_card:nth-child(2) .score_average_card_value');

		tableBody.innerHTML = `<tr><td colspan="3">Cargando calificaciones...</td></tr>`;



		if (grades.length === 0) {
			tableBody.innerHTML = `<tr><td colspan="3">No hay calificaciones registradas.</td></tr>`;
			avgPortalEl.textContent = '--';
			avgLmsEl.textContent = '--';
			return;
		}

		tableBody.innerHTML = '';
		let portalSum = 0, lmsSum = 0, portalCount = 0, lmsCount = 0;

		grades.forEach(grade => {
			const row = this.createGradeRow(grade);
			tableBody.appendChild(row);

			if (grade.portal_grade != null) {
				portalSum += grade.portal_grade;
				portalCount++;
			}
			if (grade.lms_grade != null) {
				lmsSum += grade.lms_grade;
				lmsCount++;
			}
		});

		avgPortalEl.textContent = portalCount ? (portalSum / portalCount).toFixed(1) : '--';
		avgLmsEl.textContent = lmsCount ? (lmsSum / lmsCount).toFixed(1) : '--';
	},

	createGradeRow(grade) {
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${grade.evaluation_name}</td>
			<td>${grade.portal_grade ?? '--'}</td>
			<td>${grade.lms_grade ?? '--'}</td>
		`;
		return row;
	}
};

function RenderCourseDetails({name,files,events,grades}) {
	document.getElementById("course_detail_tittle").innerText = name
	TabManager.init();
	FileManager.render(files);
	CalendarManager.render(events);
	GradeManager.render(grades);
}