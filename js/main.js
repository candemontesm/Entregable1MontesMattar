import { initDatabase, dbGet, dbSet } from "../services/database.js";
import { ROLES } from "../models/ROLES.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1) cargar BD (JSON -> LS)
  const db = await initDatabase();

  // 2) referenciar elementos
  const inputEmail = document.getElementById("login-email");
  const inputPass = document.getElementById("login-pass");
  const btnLogin = document.getElementById("btn-login");

  const studentDash = document.getElementById("student-dashboard");
  const teacherDash = document.getElementById("teacher-dashboard");
  const loginContainer = document.getElementById("login-container");

  // 3) handler login
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

    // persistimos sesión
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        role: user.course ? ROLES.STUDENT : ROLES.TEACHER,
      })
    );

    // lanzamos dashboard
    loginContainer.classList.add("is-hidden");
    if (user.course) renderStudentDash(studentDash, user, db);
    else renderTeacherDash(teacherDash, user, db);
  });
});

// 4) renderizadores provisionales

import { renderStudentDash } from "../ui/student.js";
import { renderTeacherDash } from "../ui/teacher.js";
