/* global Swal, Toastify */
import { dbSet } from "../services/database.js";

export function renderTeacherDash(container, teacher, db) {
  container.classList.remove("is-hidden");
  container.innerHTML = `
    <h2 class="title is-4">Bienvenida/o, Prof. ${teacher.lastName}</h2>

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
  container.querySelector("#btn-grade").onclick = async () => {
    const { value: form } = await Swal.fire({
      title: "Cargar nota",
      html: `
      <input id="sw-student-note" class="swal2-input" placeholder="ID estudiante">
      <input id="sw-grade"       class="swal2-input" type="number" min="1" max="10" placeholder="Nota (1‑10)">
      <input id="sw-date"        class="swal2-input" type="date" value="${new Date()
        .toISOString()
        .slice(0, 10)}">
    `,
      focusConfirm: false,
      preConfirm: () => ({
        studentId: +document.getElementById("sw-student-note").value,
        grade: +document.getElementById("sw-grade").value,
        date: document.getElementById("sw-date").value,
      }),
    });

    if (!form) return;

    if (form.grade < 1 || form.grade > 10) {
      Swal.fire("Error", "La nota debe ser de 1 a 10", "error");
      return;
    }

    db.grades.push({
      id: Date.now(),
      ...form,
      subject: teacher.subject,
    });
    dbSet(db);
    Toastify({ text: "Nota cargada", duration: 2000 }).showToast();
  };

  //  VER / ENVIAR MENSAJES
  container.querySelector("#btn-msgs").onclick = () => {
    const msgs = db.messages.filter(
      (m) => m.toId === teacher.id || m.fromId === teacher.id
    );
    const content = container.querySelector("#teacher-content");
    content.innerHTML = `
    <h3 class="subtitle is-5">Mensajes</h3>
    <button id="btn-new-msg" class="button is-small is-link mb-3">Nuevo mensaje</button>
    ${
      msgs.length
        ? msgs
            .map(
              (m) => `
          <article class="message is-light mb-2">
            <div class="message-header">
              <p>${m.subject}</p>
              <small>${new Date(m.timestamp).toLocaleString()}</small>
            </div>
            <div class="message-body">${m.body}</div>
          </article>`
            )
            .join("")
        : "<p>No tienes mensajes.</p>"
    }
  `;

    // enviar nuevo mensaje
    content.querySelector("#btn-new-msg").onclick = async () => {
      const { value: form } = await Swal.fire({
        title: "Nuevo mensaje",
        html: `
        <input id="sw-to"  class="swal2-input" placeholder="ID destinatario">
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
