/* global Swal, Toastify */

import { dbSet } from "../services/database.js";
import { toast } from "../services/notify.js";

const getUserName = (id, db) => {
  const u =
    db.students.find((s) => s.id === id) ||
    db.teachers.find((t) => t.id === id);
  return u ? `${u.firstName} ${u.lastName}` : "Desconocido";
};

export function renderStudentDash(container, student, db) {
  container.classList.remove("is-hidden");

  container.innerHTML = `
    <h2 class="dashboard-greeting">
      Hola, <br>
       ${student.firstName}
    </h2>
  `;

  container.insertAdjacentHTML(
    "beforeend",
    `
      <div class="dashboard-header">
        <div class="buttons is-flex is-justify-content-center is-flex-wrap-wrap">
          <button id="btn-tasks" class="button is-link m-1">
            <i class="fa-solid fa-list-check fa-fw"></i> Actividades
          </button>
          <button id="btn-grades" class="button is-info m-1">
            <i class="fa-solid fa-chart-column fa-fw"></i> Notas
          </button>
          <button id="btn-msg" class="button is-warning m-1">
            <i class="fa-solid fa-envelope fa-fw"></i> Mensajes
          </button>
        </div>
      </div>

      <div class="logout-wrapper">
        <button id="btn-logout" class="button is-danger">
          <i class="fa-solid fa-right-from-bracket fa-fw"></i> Cerrar sesión
        </button>
      </div>

      <div id="student-content" class="mt-4"></div>
    `
  );

  /* ----------  referencias a nodos ---------- */
  const content = container.querySelector("#student-content");
  const wrapperLogout = container.querySelector(".logout-wrapper");
  const btnLogout = container.querySelector("#btn-logout");

  const btnTasks = container.querySelector("#btn-tasks");
  const btnGrades = container.querySelector("#btn-grades");
  const btnMsg = container.querySelector("#btn-msg");

  /* ----------  helpers y estado ---------- */
  let currentView = null; // "tasks" | "grades" | "msg" | null

  const placeLogoutAfterContent = () => {
    content.insertAdjacentElement("afterend", btnLogout);
  };
  const resetLogoutPosition = () => {
    wrapperLogout.appendChild(btnLogout);
  };
  const resetDashboard = () => {
    content.innerHTML = "";
    currentView = null;
    resetLogoutPosition();
  };

  /* ----------  listeners ---------- */

  /* CERRAR SESIÓN */
  btnLogout.onclick = () => {
    localStorage.removeItem("currentUser");
    location.reload();
  };

  /* ----- TAREAS ----- */
  btnTasks.onclick = () => {
    if (currentView === "tasks") {
      resetDashboard();
      return;
    }

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
        <div class="message-body">
          ${t.description}<br>Vence: ${t.dueDate}
        </div>
      </article>`
          )
          .join("")
      : "<p>No hay tareas pendientes 🎉</p>";

    /* marcar como hecha */
    content.querySelectorAll("[data-id]").forEach((btn) => {
      btn.onclick = () => {
        const id = +btn.dataset.id;
        const task = db.tasks.find((t) => t.id === id);
        task.done = true;
        dbSet(db);
        toast("¡Tarea completada!", "success");
        btn.closest("article").remove();
      };
    });

    currentView = "tasks";
    placeLogoutAfterContent();
  };

  /* ----- NOTAS ----- */
  btnGrades.onclick = () => {
    if (currentView === "grades") {
      resetDashboard();
      return;
    }

    const grades = db.grades
      .filter((g) => g.studentId === student.id)
      .sort((a, b) => b.date.localeCompare(a.date));

    content.innerHTML = grades.length
      ? `<table class="table is-fullwidth">
         <thead>
           <tr><th>Materia</th><th>Nota</th><th>Fecha</th><th>Descripción</th></tr>
         </thead>
         <tbody>
           ${grades
             .map(
               (g) => `
                 <tr>
                   <td>${g.subject}</td>
                   <td>${g.grade}</td>
                   <td>${g.date}</td>
                   <td>${g.description || ""}</td>
                 </tr>`
             )
             .join("")}
         </tbody>
       </table>`
      : "<p>Aún no hay notas registradas.</p>";

    currentView = "grades";
    placeLogoutAfterContent();
  };

  /* ----- MENSAJES ----- */
  btnMsg.onclick = () => {
    if (currentView === "msg") {
      resetDashboard();
      return;
    }

    const allMsgs = db.messages.filter(
      (m) => m.toId === student.id || m.fromId === student.id
    );
    const unread = allMsgs.filter((m) => !m.read && m.toId === student.id);
    const readMsgs = allMsgs.filter((m) => m.read || m.fromId === student.id);

    const renderSection = (title, arr) =>
      `<h4 class="subtitle is-6">${title}</h4>` +
      (arr.length
        ? arr
            .map(
              (m) => `
        <article class="message is-link-light mb-2" data-mid="${m.id}">
          <div class="message-header">
            <p>
              ${m.subject}
              <small class="has-text-grey">— de ${getUserName(
                m.fromId,
                db
              )}</small>
            </p>
            <small>${new Date(m.timestamp).toLocaleString()}</small>
          </div>
          <div class="message-body">
            ${m.body}
            ${
              m.fromId !== student.id
                ? `<button class="button is-small is-light mt-2"
                          data-reply="${m.fromId}">
                     Responder
                   </button>`
                : ""
            }
          </div>
        </article>`
            )
            .join("")
        : "<p class='mb-3'>Sin mensajes.</p>");

    content.innerHTML =
      renderSection("📨 Nuevos mensajes", unread) +
      "<hr>" +
      renderSection("📁 Mensajes leídos", readMsgs);

    /* marcar como leído */
    content.querySelectorAll("[data-mid]").forEach((art) => {
      art.addEventListener("click", () => {
        const id = +art.dataset.mid;
        const msg = db.messages.find((m) => m.id === id);
        if (msg && msg.toId === student.id && !msg.read) {
          msg.read = true;
          dbSet(db);
          art.remove();
          content.insertAdjacentHTML("beforeend", art.outerHTML);
        }
      });
    });

    /* responder */
    content.querySelectorAll("[data-reply]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
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
        toast("Respuesta enviada", "success");
      });
    });

    currentView = "msg";
    placeLogoutAfterContent();
  };
}
