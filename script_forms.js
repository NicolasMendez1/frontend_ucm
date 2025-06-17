
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

function uploadEvent() {
	const title = document.getElementById('eventTitle').value;
	const date = document.getElementById('eventDate').value;
	const description = document.getElementById('eventDescription').value;

	if (!title || !date) {
		alert('Por favor completa el título y la fecha del evento');
		return;
	}

	closeModal('event');
}

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
