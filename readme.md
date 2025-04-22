# 🧪 Simulador de Aula Virtual - CPEM 30

Este proyecto es un simulador básico de una plataforma virtual de comunicación entre docentes y estudiantes, desarrollado en JavaScript. Forma parte de la primera preentrega del curso de JavaScript para principiantes en CoderHouse.

---

## 📌 Descripción general

El simulador está inspirado en plataformas como el aula virtual o SIU Guaraní, adaptado a la realidad del CPEM 30 (escuela secundaria de la Provincia de Neuquén). Propone un entorno donde cada persona usuaria puede interactuar con información académica relevante de acuerdo a su rol institucional.

La lógica permite validar si una persona está cargada en la base de datos institucional, para luego habilitar el registro de su cuenta. Una vez ingresada, accede a un dashboard con opciones específicas: los y las estudiantes pueden ver sus notas y tareas pendientes, mientras que el cuerpo docente puede leer mensajes recibidos y publicar avisos.

En esta segunda entrega, se integró JavaScript con HTML y se agregó interactividad mediante el DOM, reemplazando los cuadros de diálogo por formularios visuales y botones.

---

## 🧑‍🎓 Funcionalidades para estudiantes

- Registro con nombre, mail y contraseña (validado con DNI y número de legajo).
- Ingreso mediante mail y contraseña.
- Visualización de notas por materia.
- Consulta de tareas pendientes.
- Sesión recordada mediante localStorage.

---

## 👩‍🏫 Funcionalidades para docentes

- Registro con nombre, mail, contraseña y materia (validados con número de empleadx y legajo).
- Ingreso mediante mail y contraseña.
- Visualización de mensajes recibidos.
- Publicación de avisos para estudiantes.
- Sesión recordada mediante localStorage.

---

## 🛠️ Herramientas utilizadas

- JavaScript (vanilla)
- HTML5 + DOM API
- localStorage para persistencia de sesión y base de datos
- Regex para validación de mail y contraseña
- Clases, herencia, y estructura modular del código
- Funciones reutilizables, condicionales, bucles, eventos

---

## 🗂️ Estructura del proyecto

📁 SIMULADOR/ 
├── 📁 js/ 
│ ├── clases.js 
│ ├── data.js 
│ └── main.js 
├── 📁 css/ 
│ └── style.css 
├── 📄 index.html 
└── 📄 readme.md
