document.getElementById('formPrestamo').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const estudianteId = parseInt(document.getElementById('estudianteId').value);
    const materiaNombre = document.getElementById('materiaNombre').value;
    const equipos = document.getElementById('equipos').value.split(',').map(Number);
    const horasAntelacion = parseInt(document.getElementById('horasAntelacion').value);
    const esGrupal = document.getElementById('esGrupal').checked;

    const ahora = new Date();
    const fechaRetiro = new Date(ahora.getTime() + horasAntelacion * 60 * 60 * 1000).toISOString();
    const fechaDevolucion = new Date(ahora.getTime() + (horasAntelacion + 48) * 60 * 60 * 1000).toISOString();

    const payload = { estudianteId, materiaNombre, equipos, fechaRetiro, fechaDevolucion, esGrupal };
    const divResultado = document.getElementById('resultado');

    try {
        const response = await fetch('/api/prestamos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        divResultado.style.display = 'block';
        if (response.ok) {
            divResultado.className = 'exito';
            divResultado.innerHTML = `
                <strong>¡Solicitud Registrada!</strong><br>
                ID Solicitud: #${data.solicitudId}<br>
                Estado: <em>${data.estado}</em><br>
                Es Excepcional: ${data.esExcepcional ? 'Sí (Requiere Autorización Extraordinaria)' : 'No'}
            `;
        } else {
            divResultado.className = 'error';
            divResultado.innerHTML = `<strong>Solicitud Rechazada:</strong> ${data.error}`;
        }
    } catch (err) {
        divResultado.style.display = 'block';
        divResultado.className = 'error';
        divResultado.innerHTML = `<strong>Error de Conexión:</strong> ${err.message}`;
    }
});