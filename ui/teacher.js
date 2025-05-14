/* global Swal, Toastify */
const getUserName = (id, db) => {
  const u =
    db.students.find((s) => s.id === id) ||
    db.teachers.find((t) => t.id === id);
  return u ? `${u.firstName} ${u.lastName}` : "Desconocido";
};

import { dbSet } from "../services/database.js";

export function renderTeacherDash(container, teacher, db) {
  container.classList.remove("is-hidden");
  container.innerHTML = `
    <h2 class="title is-4"> ¡Hola, Profe ${teacher.lastName}!</h2>

    <div class="buttons">
      <button id="btn-msgs"   class="button is-warning">Mensajes</button>
      <button id="btn-task"   class="button is-success">Nueva tarea</button>
      <button id="btn-grade"  class="button is-link">Nueva nota</button>
    </div>

    <div id="teacher-content" class="mt-4"></div>
  `;

  // NUEVA TAREA
  container.querySelector("#btn-task").onclick = async () => {
    const { value: form } = await Swal.fire({
      title: "Nueva tarea",
      html: `
        <input id="sw-title"  class="swal2-input" placeholder="Título">
        <textarea id="sw-desc" class="swal2-textarea" placeholder="Descripción"></textarea>
        <input id="sw-student" class="swal2-input" placeholder="ID estudiante">
        <input id="sw-due"    class="swal2-input" type="date">
      `,
      focusConfirm: false,
      preConfirm: () => ({
        title: document.getElementById("sw-title").value,
        description: document.getElementById("sw-desc").value,
        studentId: +document.getElementById("sw-student").value,
        dueDate: document.getElementById("sw-due").value,
      }),
    });

    if (!form) return;

    // push en DB
    const newTask = {
      id: Date.now(),
      teacherId: teacher.id,
      subject: teacher.subject,
      done: false,
      ...form,
    };
    db.tasks.push(newTask);
    dbSet(db);
    Toastify({ text: "Tarea creada", duration: 2000 }).showToast();
  };

  // NUEVA NOTA
  /* ─── NUEVA NOTA ─── */
  container.querySelector("#btn-grade").onclick = async () => {
    /* opciones de alumnxs */
    const studentOptions = db.students
      .map(
        (s) =>
          `<option value="${s.id}">
           ${s.firstName} ${s.lastName} (ID ${s.id})
         </option>`
      )
      .join("");

    const { value: form } = await Swal.fire({
      title: "Cargar nota",
      html: `
      <select id="sw-student-note" class="swal2-select">
        ${studentOptions}
      </select>
      <input id="sw-grade" class="swal2-input" type="number" min="1" max="10"
             placeholder="Nota (1‑10)">
      <input id="sw-date" class="swal2-input" type="date"
             value="${new Date().toISOString().slice(0, 10)}">
      <input id="sw-desc" class="swal2-input" placeholder="Descripción (p.ej., Prueba 1)">
    `,
      focusConfirm: false,
      preConfirm: () => ({
        studentId: +document.getElementById("sw-student-note").value,
        grade: +document.getElementById("sw-grade").value,
        date: document.getElementById("sw-date").value,
        description: document.getElementById("sw-desc").value.trim(),
      }),
    });

    if (!form) return;
    if (form.grade < 1 || form.grade > 10) {
      Swal.fire("Error", "La nota debe ser de 1 a 10", "error");
      return;
    }

    db.grades.push({
      id: Date.now(),
      subject: teacher.subject,
      ...form,
    });
    dbSet(db);
    Toastify({ text: "Nota cargada", duration: 2000 }).showToast();
  };

  //  VER / ENVIAR MENSAJES

  container.querySelector("#btn-msgs").onclick = () => {
    const allMsgs = db.messages.filter(
      (m) => m.toId === teacher.id || m.fromId === teacher.id
    );
    const unread = allMsgs.filter((m) => !m.read && m.toId === teacher.id);
    const readMsgs = allMsgs.filter((m) => m.read || m.fromId === teacher.id);

    const renderSection = (title, arr) =>
      `<h4 class="subtitle is-6">${title}</h4>` +
      (arr.length
        ? arr
            .map(
              (m) => `
        <article class="message is-light mb-2" data-mid="${m.id}">
          <div class="message-header">
            <p>${m.subject}
            <small class="has-text-grey">— de ${getUserName(
              m.fromId,
              db
            )}</small>
            </p>
            <small>${new Date(m.timestamp).toLocaleString()}</small>
          </div>
          <div class="message-body">
            ${m.body}
          </div>
        </article>`
            )
            .join("")
        : "<p class='mb-3'>Sin mensajes.</p>");

    const content = container.querySelector("#teacher-content");
    content.innerHTML = `
    <button id="btn-new-msg" class="button is-small is-link mb-4">
      Nuevo mensaje
    </button>
    ${renderSection("📨 Nuevos mensajes", unread)}
    <hr>
    ${renderSection("📁 Mensajes viejos", readMsgs)}
  `;

    // Marcar como leído
    content.querySelectorAll("[data-mid]").forEach((art) => {
      art.addEventListener("click", () => {
        const id = +art.dataset.mid;
        const msg = db.messages.find((m) => m.id === id);
        if (msg && msg.toId === teacher.id && !msg.read) {
          msg.read = true;
          dbSet(db);
          art.remove();
          content.insertAdjacentHTML("beforeend", art.outerHTML);
        }
      });
    });

    // Nuevo mensaje
    content.querySelector("#btn-new-msg").onclick = async () => {
      const studentOptions = db.students
        .map(
          (s) =>
            `<option value="${s.id}">
             ${s.firstName} ${s.lastName} (ID ${s.id})
           </option>`
        )
        .join("");

      const { value: form } = await Swal.fire({
        title: "Nuevo mensaje",
        html: `
        <select id="sw-to" class="swal2-select">${studentOptions}</select>
        <input id="sw-subj" class="swal2-input" placeholder="Asunto">
        <textarea id="sw-body" class="swal2-textarea" placeholder="Mensaje"></textarea>
      `,
        focusConfirm: false,
        preConfirm: () => ({
          toId: +document.getElementById("sw-to").value,
          subject: document.getElementById("sw-subj").value,
          body: document.getElementById("sw-body").value,
        }),
      });
      if (!form) return;

      db.messages.push({
        id: Date.now(),
        fromId: teacher.id,
        timestamp: new Date().toISOString(),
        read: false,
        ...form,
      });
      dbSet(db);
      Toastify({ text: "Mensaje enviado", duration: 2000 }).showToast();
    };
  };
}
