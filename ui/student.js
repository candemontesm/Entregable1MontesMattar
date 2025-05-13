/* global Swal, Toastify */
import { dbSet } from "../services/database.js";

export function renderStudentDash(container, student, db) {
  container.classList.remove("is-hidden");
  container.innerHTML = `
    <h2 class="title is-4">Hola, ${student.firstName}</h2>

    <div class="buttons">
      <button id="btn-tasks"   class="button is-link">Actividades</button>
      <button id="btn-grades"  class="button is-info">Notas</button>
      <button id="btn-msg"     class="button is-warning">Mensajes</button>
    </div>

    <div id="student-content" class="mt-4"></div>
  `;

  const content = container.querySelector("#student-content");

  container.querySelector("#btn-tasks").onclick = () => {
    const tasks = db.tasks.filter((t) => t.studentId === student.id && !t.done);
    content.innerHTML = tasks.length
      ? tasks
          .map(
            (t) => `
        <article class="message is-light mb-3">
          <div class="message-header">
            <p>${t.title} <small>(${t.subject})</small></p>
            <button class="button is-small is-success" data-id="${t.id}">
              Marcar hecha
            </button>
          </div>
          <div class="message-body">${t.description}<br>Vence: ${t.dueDate}</div>
        </article>`
          )
          .join("")
      : "<p>No hay tareas pendientes 🎉</p>";

    // marcar como hecha
    content.querySelectorAll("[data-id]").forEach((btn) => {
      btn.onclick = () => {
        const id = +btn.dataset.id;
        const task = db.tasks.find((t) => t.id === id);
        task.done = true;
        dbSet(db);
        Toastify({ text: "¡Tarea completada!", duration: 2000 }).showToast();
        btn.closest("article").remove();
      };
    });
  };

  container.querySelector("#btn-msg").onclick = () => {
    const msgs = db.messages.filter(
      (m) => m.toId === student.id || m.fromId === student.id
    );

    content.innerHTML = `
      <h3 class="subtitle is-5">Mensajes</h3>
      ${
        msgs.length
          ? msgs
              .map(
                (m) => `
          <article class="message is-link-light mb-3">
            <div class="message-header">
              <p>${m.subject}</p>
              <small>${new Date(m.timestamp).toLocaleString()}</small>
            </div>
            <div class="message-body">
              ${m.body}
              <!-- Botón de respuesta solo si el mensaje vino de otra persona -->
              ${
                m.fromId !== student.id
                  ? `<button class="button is-small is-light mt-2" data-reply="${m.fromId}">
                       Responder
                     </button>`
                  : ""
              }
            </div>
          </article>`
              )
              .join("")
          : "<p>No tienes mensajes.</p>"
      }
    `;

    // responder
    content.querySelectorAll("[data-reply]").forEach((btn) => {
      btn.onclick = async () => {
        const toId = +btn.dataset.reply;
        const { value: body } = await Swal.fire({
          title: "Responder mensaje",
          input: "textarea",
          inputPlaceholder: "Escribe tu respuesta…",
        });
        if (!body) return;

        db.messages.push({
          id: Date.now(),
          fromId: student.id,
          toId,
          subject: "Re:",
          body,
          timestamp: new Date().toISOString(),
          read: false,
        });
        dbSet(db);
        Toastify({ text: "Respuesta enviada", duration: 2000 }).showToast();
      };
    });
  };
}
