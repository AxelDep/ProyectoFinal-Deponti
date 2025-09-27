// Variables globales
let materias = [];
let alumno = null;
let materiasTemp = [];

document.addEventListener('DOMContentLoaded', () => {

    // Cargar materias desde JSON externo
    fetch('data/materias.json')
        .then(res => res.json())
        .then(data => {
            materias = JSON.parse(localStorage.getItem('materias')) || data;
        })
        .catch(err => console.error("Error cargando materias:", err));

    // Registro de alumno
    document.getElementById('btn-registrar').addEventListener('click', () => {
        const nombreInput = document.getElementById('nombre-alumno').value.trim();
        if (!nombreInput) {
            Swal.fire({ icon: 'warning', title: 'Ingrese su nombre' });
            return;
        }
        alumno = { nombre: nombreInput, termino: false };
        materiasTemp = materias.map(m => ({ ...m, inscriptos: [...m.inscriptos] }));
        Swal.fire({ icon: 'success', title: `Bienvenido, ${alumno.nombre}` });
        document.getElementById('registro').classList.add('hidden');
        document.getElementById('materias-container').classList.remove('hidden');
        document.getElementById('inscripciones').classList.remove('hidden');
        mostrarMaterias();
        actualizarInscripciones();
    });

    // Botón Terminar inscripción
    document.getElementById('btn-terminar').addEventListener('click', () => {
        if (!alumno) return;
        const inscritas = materiasTemp.filter(m => m.inscriptos.find(a => a.nombre === alumno.nombre));
        if (inscritas.length === 0) {
            Swal.fire({ icon: 'warning', title: 'No te has inscrito en ninguna materia' });
            return;
        }
        materias = materiasTemp.map(m => ({ ...m, inscriptos: [...m.inscriptos] }));
        localStorage.setItem('materias', JSON.stringify(materias));
        alumno.termino = true;

        let resumen = inscritas.map(m => m.nombre).join('<br>');
        Swal.fire({
            icon: 'success',
            title: `Inscripción completada para ${alumno.nombre}`,
            html: `Materias inscritas:<br>${resumen}`
        });

        document.getElementById('lista-materias').querySelectorAll('button').forEach(btn => btn.disabled = true);
    });

    // Botón Cerrar sesión
    document.getElementById('btn-cerrar').addEventListener('click', () => {
        if (alumno && !alumno.termino) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'No terminaste la inscripción. Los cambios podrían perderse.',
                showCancelButton: true,
                confirmButtonText: 'Salir de todos modos',
                cancelButtonText: 'Cancelar'
            }).then(result => {
                if (result.isConfirmed) cerrarSesion(false); 
            });
        } else {
            cerrarSesion(true); 
        }
    });

    // Botón Ver alumnos y materias
    const btnVerAlumnos = document.createElement('button');
    btnVerAlumnos.id = 'btn-ver-alumnos';
    btnVerAlumnos.classList.add('btn');
    btnVerAlumnos.textContent = 'Ver Alumnos y Materias';
    document.getElementById('inscripciones').appendChild(btnVerAlumnos);

    btnVerAlumnos.addEventListener('click', () => {
        const data = JSON.parse(localStorage.getItem('materias')) || [];
        let tabla = `<table style="width:100%; border-collapse: collapse;">
                        <tr style="background:#0b1d4a; color:#fff;">
                            <th style="border:1px solid #ccc; padding:8px;">Materia</th>
                            <th style="border:1px solid #ccc; padding:8px;">Alumnos</th>
                        </tr>`;

        data.forEach(m => {
            const nombres = m.inscriptos.length > 0 ? m.inscriptos.map(a => a.nombre).join(', ') : '---';
            tabla += `<tr>
                        <td style="border:1px solid #ccc; padding:8px;">${m.nombre}</td>
                        <td style="border:1px solid #ccc; padding:8px;">${nombres}</td>
                      </tr>`;
        });

        tabla += '</table>';

        Swal.fire({
            icon: 'info',
            title: 'Alumnos y Materias',
            html: tabla,
            width: '600px'
        });
    });
});

// Funciones globales

function mostrarMaterias() {
    const container = document.getElementById('lista-materias');
    container.innerHTML = '';
    materiasTemp.forEach(m => {
        const yaInscripto = m.inscriptos.find(a => alumno && a.nombre === alumno.nombre);
        const div = document.createElement('div');
        div.classList.add('materia');
        div.innerHTML = `
            <h3>${m.nombre}</h3>
            <p>Cupo disponible: ${m.cupo - m.inscriptos.length}</p>
            <button ${yaInscripto ? 'disabled' : ''} onclick="inscribirMateria(${m.id})">
                ${yaInscripto ? 'Ya inscrito' : 'Inscribirse'}
            </button>
        `;
        container.appendChild(div);
    });
}

function inscribirMateria(materiaId) {
    if (!alumno) return;
    const materia = materiasTemp.find(m => m.id === materiaId);
    const yaInscripto = materia.inscriptos.find(a => a.nombre === alumno.nombre);

    if (yaInscripto) {
        Swal.fire({ icon: 'info', title: 'Materia ya inscrita', text: `Ya estás inscrito en ${materia.nombre}` });
        return;
    }

    if (materia.inscriptos.length >= materia.cupo) {
        Swal.fire({ icon: 'error', title: 'Cupo lleno', text: `La materia ${materia.nombre} no tiene cupos disponibles` });
        return;
    }

    materia.inscriptos.push({ nombre: alumno.nombre });
    Swal.fire({ icon: 'success', title: `Inscripción en ${materia.nombre} exitosa` });
    mostrarMaterias();
    actualizarInscripciones();
}

function actualizarInscripciones() {
    const lista = document.getElementById('lista-inscripciones');
    lista.innerHTML = '';
    if (!alumno) return;
    const inscritas = materiasTemp.filter(m => m.inscriptos.find(a => a.nombre === alumno.nombre));
    inscritas.forEach(m => {
        const li = document.createElement('li');
        li.textContent = m.nombre;
        lista.appendChild(li);
    });
}

function cerrarSesion(guardar) {
    if (!guardar) {
        materiasTemp = materias.map(m => ({ ...m, inscriptos: [...m.inscriptos] }));
    }
    alumno = null;
    materiasTemp = [];
    document.getElementById('nombre-alumno').value = '';
    document.getElementById('registro').classList.remove('hidden');
    document.getElementById('materias-container').classList.add('hidden');
    document.getElementById('inscripciones').classList.add('hidden');
    Swal.fire({ icon: 'info', title: 'Sesión cerrada' });
}