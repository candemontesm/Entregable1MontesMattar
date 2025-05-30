/* global Swal, Toastify */
const getUserName = (id, db) => {
  const u =
    db.students.find((s) => s.id === id) ||
    db.teachers.find((t) => t.id === id);
  return u ? `${u.firstName} ${u.lastName}` : "Desconocido";
};

import { dbSet } from "../services/database.js";
import { toast } from "../services/notify.js";

export function renderTeacherDash(container, teacher, db) {
  container.classList.remove("is-hidden");

  container.innerHTML = `
    <h2 class="dashboard-greeting">
      Hola, <br>
       Profe ${teacher.lastName}
    </h2>
  `;

  container.insertAdjacentHTML(
    "beforeend",
    `
      <div class="dashboard-header">
        <div class="buttons is-flex is-justify-content-center is-flex-wrap-wrap">
          <button id="btn-msgs" class="button is-warning m-1">
            <i class="fa-solid fa-envelope fa-fw"></i> Mensajes
          </button>
          <button id="btn-task" class="button is-success m-1">
            <i class="fa-solid fa-clipboard-list fa-fw"></i> Nueva tarea
          </button>
          <button id="btn-grade" class="button is-link m-1">
            <i class="fa-solid fa-pen-to-square fa-fw"></i> Nueva nota
          </button>
        </div>
      </div>

      <div class="logout-wrapper">
        <button id="btn-logout" class="button is-danger">
          <i class="fa-solid fa-right-from-bracket fa-fw"></i> Cerrar sesión
        </button>
      </div>

      <div id="teacher-content" class="mt-4"></div>
    `
  );

  const content = container.querySelector("#teacher-content");
  const wrapperLogout = container.querySelector(".logout-wrapper");
  const btnLogout = container.querySelector("#btn-logout");

  const btnMsgs = container.querySelector("#btn-msgs");
  const btnTask = container.querySelector("#btn-task");
  const btnGrade = container.querySelector("#btn-grade");

  let currentView = null;

  const placeLogoutAfterContent = () =>
    content.insertAdjacentElement("afterend", btnLogout);
  btnLogout.classList.add("is-pulled-right");

  const resetLogoutPosition = () => wrapperLogout.appendChild(btnLogout);
  const resetDashboard = () => {
    content.innerHTML = "";
    currentView = null;
    resetLogoutPosition();
  };

  btnLogout.onclick = () => {
    localStorage.removeItem("currentUser");
    location.reload();
  };

  /* NUEVA TAREA  */
  btnTask.onclick = async () => {
    if (currentView === "task") {
      resetDashboard();
      return;
    }

    const courseOptions = [...new Set(db.students.map((s) => s.course))]
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");

    const { value: form } = await Swal.fire({
      title: "Nueva tarea",
      html: `
        <select id="sw-course" class="swal2-select">${courseOptions}</select>
        <input id="sw-title" class="swal2-input" placeholder="Título">
        <textarea id="sw-desc" class="swal2-textarea" placeholder="Descripción"></textarea>
        <input id="sw-due" class="swal2-input" type="date">
      `,
      focusConfirm: false,
      preConfirm: () => ({
        course: document.getElementById("sw-course").value,
        title: document.getElementById("sw-title").value,
        description: document.getElementById("sw-desc").value,
        dueDate: document.getElementById("sw-due").value,
      }),
    });

    if (!form) return;

    const recipients = db.students.filter((s) => s.course === form.course);
    recipients.forEach((stu) =>
      db.tasks.push({
        id: Date.now() + Math.random(),
        teacherId: teacher.id,
        studentId: stu.id,
        subject: teacher.subject,
        done: false,
        ...form,
      })
    );
    dbSet(db);
    toast(`Tarea enviada a ${recipients.length} alumnxs`, "success");

    content.innerHTML = `<p class="has-text-success">
      Se envió la tarea a ${recipients.length} alumnxs de ${form.course}.
    </p>`;

    currentView = "task";
    placeLogoutAfterContent();
  };

  /* NUEVA NOTA  */
  btnGrade.onclick = async () => {
    if (currentView === "grade") {
      resetDashboard();
      return;
    }

    const studentOptions = db.students
      .map(
        (s) =>
          `<option value="${s.id}">
             ${s.firstName} ${s.lastName} (ID ${s.id})
           </option>`
      )
      .join("");

    const { value: form } = await Swal.fire({
      title: "Cargar nota",
      html: `
        <select id="sw-student-note" class="swal2-select">${studentOptions}</select>
        <input id="sw-grade" class="swal2-input" type="number" min="1" max="10" placeholder="Nota (1-10)">
        <input id="sw-date" class="swal2-input" type="date" value="${new Date()
          .toISOString()
          .slice(0, 10)}">
        <input id="sw-desc" class="swal2-input" placeholder="Descripción">
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
    toast("Nota cargada", "success");

    content.innerHTML = `<p class="has-text-success">
      Nota ${form.grade} cargada para el/la estudiante ID ${form.studentId}.
    </p>`;

    currentView = "grade";
    placeLogoutAfterContent();
  };

  /* MENSAJES */
  btnMsgs.onclick = () => {
    if (currentView === "msg") {
      resetDashboard();
      return;
    }

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
                <small class="has-text-grey">— de ${getUserName(
                  m.fromId,
                  db
                )}</small></p>
                <small>${new Date(m.timestamp).toLocaleString()}</small>
              </div>
              <div class="message-body">${m.body}</div>
            </article>`
            )
            .join("")
        : "<p class='mb-3'>Sin mensajes.</p>");

    content.innerHTML = `
      <button id="btn-new-msg" class="button is-small is-link mb-4">
        Nuevo mensaje
      </button>
      ${renderSection("📨 Nuevos mensajes", unread)}
      <hr>
      ${renderSection("📁 Mensajes leídos", readMsgs)}
    `;

    /* marcar como leído */
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

    /* nuevo mensaje */
    content.querySelector("#btn-new-msg").onclick = async () => {
      const studentOptions = db.students
        .map(
          (s) =>
            `<option value="${s.id}">
               ${s.firstName} ${s.lastName} (ID ${s.id})
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
      toast("Mensaje enviado", "success");
    };

    currentView = "msg";
    placeLogoutAfterContent();
  };
}
