# 🧪 Simulador de Aula Virtual - CPEM 30

Este proyecto es un simulador básico de una plataforma virtual de comunicación entre docentes y estudiantes, desarrollado en JavaScript. Forma parte de la primera preentrega del curso de JavaScript para principiantes en CoderHouse.

---

## 📌 Descripción general

El simulador está inspirado en plataformas como el aula virtual o SIU Guaraní, adaptado a la realidad del CPEM 30 (escuela secundaria de la Provincia de Neuquén). Propone un entorno donde cada persona usuaria puede interactuar con información académica relevante de acuerdo a su rol institucional.

La lógica permite validar si una persona está cargada en la base de datos institucional, para luego habilitar el registro de su cuenta. Una vez ingresada, accede a un dashboard con opciones específicas: los y las estudiantes pueden ver sus notas y tareas pendientes, mientras que el cuerpo docente puede leer mensajes recibidos y publicar avisos.

Todo el flujo del programa se ejecuta mediante interacciones en consola (prompt, alert, confirm), sin requerir diseño visual en esta etapa.

---

## 🧑‍🎓 Funcionalidades para estudiantes

- Registro con nombre, mail y contraseña (validado con DNI y número de legajo).
- Ingreso mediante mail y contraseña.
- Visualización de notas por materia.
- Consulta de tareas pendientes.

---

## 👩‍🏫 Funcionalidades para docentes

- Registro con nombre, mail, contraseña y materia
(validados previamente con número de empleadx y legajo).
- Ingreso mediante número de empleadx y contraseña.
- Visualización de mensajes recibidos.
- Posibilidad de redactar un aviso para estudiantes.

---

## 🛠️ Herramientas utilizadas

- JavaScript (vanilla)
- Arrays de objetos como base de datos simulada
- Funciones reutilizables
- Condicionales, bucles, validaciones
- Interacción mediante `prompt()`, `confirm()` y `alert()`

---

## 🗂️ Estructura del proyecto

📁 SIMULADOR/
├── 📁 js/
│   └── main.js
├── 📄 index.html
├── 📄 readme.md


