async function getPresignedUrl(filename, contentType) {
	const url = `https://ms-s3-presigned-2.onrender.com/generate-upload-url?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: getAuthHeaders(),
		});

		if (!response.ok) throw new Error(`Error al obtener URL: ${response.status}`);
		return await response.json();
	} catch (error) {
		console.error('getPresignedUrl error:', error);
		throw error;
	}
}

async function uploadFileToS3(presignedUrl, file) {
	try {
		const response = await fetch(presignedUrl, {
			method: 'PUT',
			headers: {
				'x-amz-acl': 'public-read',
				'Content-Type': file.type,
			},
			body: file
		});

		if (!response.ok) throw new Error(`Error en upload: ${response.status}`);
		return response;
	} catch (error) {
		console.error('uploadFileToS3 error:', error);
		throw error;
	}
}

async function handleUpload(file) {
	if (!file) return alert('No se seleccionó ningún archivo.');

	try {
		alert(`Subiendo archivo: ${file.name}`);

		const presignedResponse = await getPresignedUrl(file.name, file.type);

		await uploadFileToS3(presignedResponse.url, file);

		alert(`Archivo "${file.name}" subido exitosamente!`);
		
		return presignedResponse; // Retorna { uuid, url }
	} catch (error) {
		console.error("Error en el proceso completo:", error);
		alert("Error al subir el archivo. Revisa la consola para más detalles.");
	}
}

