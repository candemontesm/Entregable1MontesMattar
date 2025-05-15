/* global Swal, Toastify */
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import { ROLES } from "../models/ROLES.js";
import { dbSet } from "../services/database.js";
import { toast } from "../services/notify.js";

export async function openRegisterModal(db) {
  const { value: role } = await Swal.fire({
    title: "Elegí tu rol",
    input: "radio",
    inputOptions: {
      [ROLES.STUDENT]: "Alumnx",
      [ROLES.TEACHER]: "Profe",
    },
    inputValidator: (v) => (!v ? "Debes elegir un rol" : undefined),
    confirmButtonText: "Siguiente",
  });
  if (!role) return;

  // Formulario dinámico
  const htmlForm = `
    <input id="reg-name" class="swal2-input" placeholder="Nombre y Apellido">
    <input id="reg-email" class="swal2-input" type="email" placeholder="e‑mail">
    <input id="reg-pass" class="swal2-input" type="password" placeholder="Contraseña">
    <input id="reg-legajo" class="swal2-input" placeholder="N° legajo">
    ${
      role === ROLES.TEACHER
        ? '<input id="reg-subject" class="swal2-input" placeholder="Asignatura">'
        : '<input id="reg-course"  class="swal2-input" placeholder="Curso (por ej. 3°A)">'
    }
  `;

  const { value: form } = await Swal.fire({
    title: "Completa tus datos",
    html: htmlForm,
    focusConfirm: false,
    preConfirm: () => {
      const fullName = document.getElementById("reg-name").value.trim();
      const [firstName = "", lastName = ""] = fullName.split(" ");
      return {
        firstName,
        lastName,
        email: document.getElementById("reg-email").value.trim().toLowerCase(),
        password: document.getElementById("reg-pass").value,
        legajo: document.getElementById("reg-legajo").value.trim(),
        course: document.getElementById("reg-course")?.value.trim(),
        subject: document.getElementById("reg-subject")?.value.trim(),
      };
    },
  });

  if (!form) return;

  // Validaciones
  if (form.password.length < 6) {
    Swal.fire(
      "Error",
      "La contraseña debe tener al menos 6 caracteres",
      "error"
    );
    return;
  }
  const emailExists =
    db.students.some((u) => u.email === form.email) ||
    db.teachers.some((u) => u.email === form.email);
  if (emailExists) {
    Swal.fire("Error", "Ese e‑mail ya está registrado", "error");
    return;
  }

  // Crear instancia y guardar
  const newUserBase = {
    id: Date.now(),
    ...form,
  };

  if (role === ROLES.STUDENT) {
    db.students.push(new Student(newUserBase));
  } else {
    db.teachers.push(new Teacher(newUserBase));
  }

  dbSet(db);

  toast("¡Registro exitoso!", "success");

  //  Auto-login
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ id: newUserBase.id, role })
  );
  document.getElementById("login-container").classList.add("is-hidden");
  document.getElementById("main-title").classList.add("is-hidden");
  if (role === ROLES.STUDENT) {
    const { renderStudentDash } = await import("./student.js");
    renderStudentDash(
      document.getElementById("student-dashboard"),
      newUserBase,
      db
    );
  } else {
    const { renderTeacherDash } = await import("./teacher.js");
    renderTeacherDash(
      document.getElementById("teacher-dashboard"),
      newUserBase,
      db
    );
  }
}
