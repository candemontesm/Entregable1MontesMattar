# Proyecto Final – Aula Virtual CPEM 30

Simulador interactivo • Curso JavaScript (Coderhouse)

## Descripción

Aplicación web que replica un aula virtual para el CPEM 30.  
Permite a **alumnos** y **profesores**:

| Rol      | Funciones                                                      |
| -------- | -------------------------------------------------------------- |
| Alumnx   | • Ver tareas pendientes • Ver sus notas • Leer/enviar mensajes |
| Profesor | • Cargar notas • Crear tareas (por curso)• Enviar mensajes     |

Datos iniciales se cargan desde JSON y se persisten en **localStorage**.

## Demo rápida

| Usuario demo                | Contraseña | Rol      |
| --------------------------- | ---------- | -------- |
| `juan.perez@cpem30.edu.ar`  | `Clave123` | Alumno   |
| `maria.gomez@cpem30.edu.ar` | `Profe123` | Profesor |

## Cómo ejecutar

1. Cloná el repo:
   ```bash
   git clone https://github.com/candemontesm/Entregable2MontesMattar.git
   cd Entregable2MontesMattar
   ```
2. Abrí index.html con Live Server (VS Code) o cualquier servidor estático.
3. Listo! (El sitio es 100 % front-end).

## Tecnologías

HTML5 + Bulma (estilos base)
CSS custom (paleta “Solar Green”, fuentes Poppins + Inter)
JavaScript ES Modules
SweetAlert2 (modales) • Toastify.js (notificaciones)
Font Awesome (iconos)

## Estructura

assets/
data/… → JSON simulados (alumnos, tareas, etc.)
css/
custom.css → paleta y overrides
js/
main.js → login + router
ui/… → dashboards
models/… → clases Usuario, Alumno, Profesor
services/… → fetch JSON, notificaciones, helpers

## Features destacadas

Auto-login: recuerda sesión y entra directo al dashboard.
Toggle de vistas: un segundo clic vuelve a la pantalla principal.
Botón “Cerrar sesión” que se reubica según el contenido mostrado.
Persistencia en LocalStorage (sin backend).

## Autora

Candela Montes Mattar • Coderhouse – Curso JavaScript (2025)
