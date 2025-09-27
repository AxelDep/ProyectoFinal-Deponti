# ProyectoFinal-Deponti

## Simulador interactivo de inscripción a materias

Este proyecto es un **simulador interactivo en JavaScript** donde los alumnos pueden registrarse y anotarse en distintas materias. Se almacenan las inscripciones usando **localStorage** y se visualizan en tiempo real.

---

## Objetivos del proyecto

- Crear un simulador interactivo de inscripción a materias.
- Permitir que varios alumnos se inscriban en distintas materias.
- Usar datos externos simulados mediante JSON.
- Generar HTML dinámicamente desde JavaScript.
- Aplicar librerías externas (**SweetAlert2**) para interacción con el usuario.
- Implementar buenas prácticas de programación, escalabilidad y legibilidad.

---

## Funcionalidades

1. **Registro de alumno**  
   - El alumno ingresa su nombre y se habilitan las materias disponibles.

2. **Inscripción a materias**  
   - El alumno puede inscribirse en materias disponibles.
   - No puede inscribirse más de una vez en la misma materia.
   - Cada materia tiene un **cupo máximo de 5 alumnos**.

3. **Visualización de inscripciones**  
   - Lista de materias en las que el alumno ya está inscrito.
   - Botón **“Ver alumnos y materias”** que muestra una tabla con todos los alumnos inscritos por materia.

4. **Cerrar sesión y terminar inscripción**  
   - Botón **“Terminar inscripción”** guarda las inscripciones en `localStorage`.  
   - Botón **“Cerrar sesión”** alerta si no se terminó la inscripción y puede perder cambios.

5. **Persistencia**  
   - Todos los datos se guardan en `localStorage` y se cargan al volver a abrir la página.

---

## Estructura del proyecto