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

  // ——— LISTENERS ———
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

  container.querySelector("#btn-grades").onclick = () => {
    const grades = db.grades
      .filter((g) => g.studentId === student.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    content.innerHTML = grades.length
      ? `<table class="table is-fullwidth">
          <thead><tr><th>Materia</th><th>Nota</th><th>Fecha</th></tr></thead>
          <tbody>
            ${grades
              .map(
                (g) =>
                  `<tr><td>${g.subject}</td><td>${g.grade}</td><td>${g.date}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>`
      : "<p>Aún no hay notas registradas.</p>";
  };

  container.querySelector("#btn-msg").onclick = () => {
    const msgs = db.messages.filter(
      (m) => m.toId === student.id || m.fromId === student.id
    );
    content.innerHTML = msgs.length
      ? msgs
          .map(
            (m) => `
        <article class="message is-link-light mb-3">
          <div class="message-header">
            <p>${m.subject}</p>
            <small>${new Date(m.timestamp).toLocaleString()}</small>
          </div>
          <div class="message-body">${m.body}</div>
        </article>`
          )
          .join("")
      : "<p>No tienes mensajes.</p>";
  };
}
