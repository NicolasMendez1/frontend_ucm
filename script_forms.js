
function openCourseDetailModal() {
	document.getElementById('courseDetailModal').classList.add('active');
}

function openEventFormModal() {
	document.getElementById('eventModal').classList.add('active');
}

function openUploadFileModal() {
	document.getElementById('fileModal').classList.add('active');
}

function closeCourseDetailModal(){
	document.getElementById('courseDetailModal').classList.remove('active');	
}

function closeEventModal(){
	document.getElementById('eventModal').classList.remove('active');
	document.getElementById('eventForm').reset();
}

function closeFileModal(){
	document.getElementById('fileModal').classList.remove('active');
	document.getElementById('fileForm').reset();
	resetFileUpload();	
}

document.getElementById('courseDetailModal').addEventListener('click', function (e) {
	if (e.target === this) {
		closeCourseDetailModal();
	}
});

document.getElementById('eventModal').addEventListener('click', function (e) {
	if (e.target === this) {
		closeEventModal();
	}
});

document.getElementById('fileModal').addEventListener('click', function (e) {
	if (e.target === this) {
		closeFileModal();
	}
});

/*
function uploadFile() {
	const fileName = document.getElementById('fileName').value;
	const fileInput = document.getElementById('fileUpload');

	if (!fileName || !fileInput.files.length) {
		alert('Por favor completa el nombre del archivo y selecciona un archivo');
		return;
	}

	const file = fileInput.files[0];

	console.log('Subiendo archivo:', {
		name: fileName,
		file: file.name,
		size: file.size,
		type: file.type
	});

	closeModal('file');
}
*/


function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}


async function uploadFile() {
	const fileName = document.getElementById('fileName').value;
	const fileInput = document.getElementById('fileUpload');

	if (!fileName || !fileInput.files.length) {
		alert('Por favor completa el nombre del archivo y selecciona un archivo');
		return;
	}

	const file = fileInput.files[0];

	const response = await handleUpload(file);

	if (!response) return; // Error manejado ya en handleUpload

	const { uuid, url } = response;

	const data = {
		file_id: uuid,
		course_id: current_course_id,
		student_id: localStorage.getItem('username'),
		filename: fileName,
		aws_id: uuid,
		url: `https://sample-loader.s3.us-east-2.amazonaws.com/${uuid}`,
		mimetype: file.type,
		size: file.size,
		upload_date: new Date().toISOString(),
	};

	registerFile(data);
}


function uploadEvent() {
	const evaluation_name = document.getElementById('eventTitle').value;
	const evaluation_date = document.getElementById('eventDate').value;
	const description = document.getElementById('eventDescription').value;

	const eventData = {
		student_id: localStorage.getItem('username'),
		course_id: current_course_id,
		evaluation_name: evaluation_name,
		evaluation_date: evaluation_date,
		description: description
	};

	if (!evaluation_name || !evaluation_date) {
		alert('Por favor completa el título y la fecha del evento');
		return;
	}

	console.log('Datos del evento:', JSON.stringify(eventData, null, 2));
	createEvaluation(eventData);
}

function updateFileName() {
	const fileInput = document.getElementById('fileUpload');
	const fileUploadText = document.getElementById('fileUploadText');
	const fileUploadArea = document.querySelector('.file-upload-area');

	if (fileInput.files.length > 0) {
		const file = fileInput.files[0];
		fileUploadText.textContent = file.name;
		fileUploadArea.classList.add('file-selected');

		const nameInput = document.getElementById('fileName');
		if (!nameInput.value) {
			const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
			nameInput.value = nameWithoutExtension;
		}
	}
}

function resetFileUpload() {
	const fileUploadText = document.getElementById('fileUploadText');
	const fileUploadArea = document.querySelector('.file-upload-area');

	fileUploadText.textContent = 'Haz clic para seleccionar un archivo';
	fileUploadArea.classList.remove('file-selected');
}
