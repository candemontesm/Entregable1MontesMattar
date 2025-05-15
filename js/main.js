import { initDatabase } from "../services/database.js";
import { ROLES } from "../models/ROLES.js";
import { openRegisterModal } from "../ui/register.js";
import { renderStudentDash } from "../ui/student.js";
import { renderTeacherDash } from "../ui/teacher.js";

/* global Swal */

document.addEventListener("DOMContentLoaded", async () => {
  const db = await initDatabase();

  const current = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (current) {
    const user =
      current.role === ROLES.STUDENT
        ? db.students.find((s) => s.id === current.id)
        : db.teachers.find((t) => t.id === current.id);

    if (user) {
      document.getElementById("login-container").classList.add("is-hidden");
      document.getElementById("main-title").classList.add("is-hidden");

      if (current.role === ROLES.STUDENT) {
        renderStudentDash(
          document.getElementById("student-dashboard"),
          user,
          db
        );
      } else {
        renderTeacherDash(
          document.getElementById("teacher-dashboard"),
          user,
          db
        );
      }
      return;
    } else {
      localStorage.removeItem("currentUser");
    }
  }

  const inputEmail = document.getElementById("login-email");
  const inputPass = document.getElementById("login-pass");
  const btnLogin = document.getElementById("btn-login");
  const btnShowRegister = document.getElementById("btn-show-register");

  const studentDash = document.getElementById("student-dashboard");
  const teacherDash = document.getElementById("teacher-dashboard");
  const loginContainer = document.getElementById("login-container");

  btnShowRegister.addEventListener("click", () => openRegisterModal(db));

  btnLogin.addEventListener("click", () => {
    const email = inputEmail.value.trim().toLowerCase();
    const pass = inputPass.value.trim();

    const user =
      db.students.find((s) => s.email === email && s.password === pass) ||
      db.teachers.find((t) => t.email === email && t.password === pass);

    if (!user) {
      Swal.fire("Error", "Credenciales incorrectas", "error");
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        role: user.course ? ROLES.STUDENT : ROLES.TEACHER,
      })
    );

    loginContainer.classList.add("is-hidden");
    document.getElementById("main-title").classList.add("is-hidden");

    if (user.course) {
      renderStudentDash(studentDash, user, db);
    } else {
      renderTeacherDash(teacherDash, user, db);
    }
  });
});
