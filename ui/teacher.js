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

  // ——— NUEVA TAREA ———
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

  // (botones #btn-grade y #btn-msgs los completaremos en la siguiente iteración)
}
