// Variable para guardar el rol seleccionado
let currentRole = null;

// Bases de datos activas (se recuperan del ls o se cargan desde data.js)
let studentDataBase = JSON.parse(localStorage.getItem("studentDataBase")) || [...initialStudents];
let teacherDataBase = JSON.parse(localStorage.getItem("teacherDataBase")) || [...initialTeachers];


// Función para mostrar/ocultar secciones
function mostrarSeccion(id) {
    document.getElementById(id).style.display = "block";
};

function ocultarSeccion(id) {
    document.getElementById(id).style.display = "none";
};

function validateInput(value, type) {
    if (!value) return false;

    switch (type) {
        case "email":
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case "password":
            return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
        default:
            return true;
    };
};

function cerrarSesion() {
    localStorage.removeItem("lastUser");
    ocultarSeccion("dashboard");
    mostrarSeccion("seleccion-inicial");
};


function showStudentDashboard(base, index) {
    const user = base[index];
    const dashboard = document.getElementById("dashboard");

    dashboard.innerHTML = `
        <h2>Bienvenidx, ${user.nombre} 👋</h2>
        <p><strong>Notas:</strong></p>
        <ul>
            <li>Matemática: ${user.notas.matematica ?? "Sin nota"}</li>
            <li>Lengua: ${user.notas.lengua ?? "Sin nota"}</li>
            <li>Historia: ${user.notas.historia ?? "Sin nota"}</li>
        </ul>

        <p><strong>Tareas pendientes:</strong></p>
        <ul>
            ${user.tareasPendientes.length > 0
            ? user.tareasPendientes.map(tarea => `<li>${tarea}</li>`).join("")
            : "<li>No tenés tareas pendientes 🥳</li>"
        }
        </ul>

        <button id="btn-cerrar-sesion">Cerrar sesión</button>

    `;

    ocultarSeccion("formulario-contenedor");
    mostrarSeccion("dashboard");
};

function showTeacherDashboard(base, index) {
    const user = base[index];
    const dashboard = document.getElementById("dashboard");

    dashboard.innerHTML = `
        <h2>Hola profe ${user.nombre} 👨‍🏫</h2>
        <p>Materia: <strong>${user.materia}</strong></p>

        <p><strong>Mensajes recibidos:</strong></p>
        <ul>
            ${user.mensajes.length > 0
            ? user.mensajes.map(msg => `<li>${msg}</li>`).join("")
            : "<li>No tiene mensajes nuevos 📬</li>"
        }
        </ul>

        <button id="btn-cerrar-sesion">Cerrar sesión</button>

    `;

    ocultarSeccion("formulario-contenedor");
    mostrarSeccion("dashboard");
};

function mostrarFormularioRegistro() {
    const extraFields = document.getElementById("extra-fields");
    extraFields.innerHTML = ""; // Limpia campos anteriores

    if (currentRole === ROLES.STUDENT) {
        extraFields.innerHTML += `
        <label for="register-dni">DNI:</label>
        <input type="text" id="register-dni" required>
  
        <label for="register-legajo">Legajo:</label>
        <input type="text" id="register-legajo" required>
      `;
    } else if (currentRole === ROLES.TEACHER) {
        extraFields.innerHTML += `
        <label for="register-dni">DNI:</label>
        <input type="text" id="register-dni" required>
  
        <label for="register-legajo">Legajo:</label>
        <input type="text" id="register-legajo" required>
  
        <label for="register-numeroEmpleado">Número de Empleadx:</label>
        <input type="text" id="register-numeroEmpleado" required>
  
        <label for="register-materia">Materia:</label>
        <input type="text" id="register-materia" required>
      `;
    }

    ocultarSeccion("seleccion-rol");
    mostrarSeccion("form-register");
};

// Al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    const lastUser = JSON.parse(localStorage.getItem("lastUser"));

    if (lastUser) {
        // Si hay usuarix guardado, mostramos el login directo
        mostrarSeccion("inicio-sesion");

        const saludo = document.getElementById("saludo-personalizado");
        saludo.textContent = `Bienvenidx ${lastUser.nombre} al Aula Virtual del CPEM 30`;

    } else {
        // Si no hay sesión guardada, mostramos opciones básicas
        mostrarSeccion("seleccion-inicial");
    };
});

// Botón "Ingresar" desde página inicial (sin sesión previa)
document.getElementById("btn-ingresar").addEventListener("click", () => {
    ocultarSeccion("seleccion-inicial");
    mostrarSeccion("seleccion-rol");
});

// Botón "Registrarse" desde página inicial
document.getElementById("btn-registrarse").addEventListener("click", () => {
    ocultarSeccion("seleccion-inicial");
    mostrarSeccion("seleccion-rol");
});

// Botón "Ingresar con usuario diferente"
document.getElementById("btn-cambiar-usuario").addEventListener("click", () => {
    localStorage.removeItem("lastUser"); // Eliminamos sesión guardada
    ocultarSeccion("inicio-sesion");
    mostrarSeccion("seleccion-rol");
});

// Botón "Registrarse" desde sesión
document.getElementById("btn-registrarse-desde-sesion").addEventListener("click", () => {
    ocultarSeccion("inicio-sesion");
    mostrarSeccion("seleccion-rol");
});

document.getElementById("btn-alumnx").addEventListener("click", () => {
    currentRole = ROLES.STUDENT;
    ocultarSeccion("seleccion-rol");
    mostrarSeccion("formulario-contenedor");
    mostrarSeccion("form-login");
});

document.getElementById("btn-profe").addEventListener("click", () => {
    currentRole = ROLES.TEACHER;
    ocultarSeccion("seleccion-rol");
    mostrarSeccion("formulario-contenedor");
    mostrarSeccion("form-login");
});

// Si usuarix quiere registrarse desde inicio o desde sesión
document.getElementById("btn-registrarse").addEventListener("click", () => {
    mostrarFormularioRegistro();
});

document.getElementById("btn-registrarse-desde-sesion").addEventListener("click", () => {
    mostrarFormularioRegistro();
});

//Inicio desde sesión activa 
document.getElementById("btn-ingresar-sesion").addEventListener("click", () => {
    const lastUser = JSON.parse(localStorage.getItem("lastUser"));
    const inputPassword = document.getElementById("input-password").value;
    let base = null;

    // Determinar base datos según el rol
    if (lastUser.rol === ROLES.STUDENT) {
        base = studentDataBase;
    } else if (lastUser.rol === ROLES.TEACHER) {
        base = teacherDataBase;
    };

    // Buscar usuarix en la base según mail
    const userIndex = base.findIndex(user => user.mail === lastUser.mail);

    if (userIndex !== -1 && base[userIndex].contraseña === inputPassword) {
        // Contraseña válida → mostrar dashboard
        if (lastUser.rol === ROLES.STUDENT) {
            showStudentDashboard(base, userIndex);
        } else if (lastUser.rol === ROLES.TEACHER) {
            showTeacherDashboard(base, userIndex);
        }
    } else {
        alert("La contraseña no coincide. Intentá nuevamente.");
    }
});

//Login normal (Sin sesion activa)
document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();

    const mail = document.getElementById("login-mail").value.trim();
    const password = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error");


    // Buscar usuario en la base correspondiente
    let base = currentRole === ROLES.STUDENT ? studentDataBase : teacherDataBase;
    const userIndex = base.findIndex(user => user.mail === mail);

    if (userIndex === -1) {
        errorMsg.textContent = "No existe ninguna cuenta registrada con ese mail.";
        return;
    }

    const user = base[userIndex];

    if (user.contraseña !== password) {
        errorMsg.textContent = "La contraseña no es correcta.";
        return;
    }

    // Si ok -> guardar sesión
    localStorage.setItem("lastUser", JSON.stringify({
        mail: user.mail,
        nombre: user.nombre,
        rol: user.rol
    }));

    ocultarSeccion("form-login");

    if (currentRole === ROLES.STUDENT) {
        showStudentDashboard(base, userIndex);
    } else {
        showTeacherDashboard(base, userIndex);
    }
});

// Registro 
document.getElementById("form-register").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("register-nombre").value.trim();
    const mail = document.getElementById("register-mail").value.trim();
    const password = document.getElementById("register-password").value;
    const dni = document.getElementById("register-dni").value.trim();
    const legajo = document.getElementById("register-legajo").value.trim();
    const errorMsg = document.getElementById("register-error");

    let base = currentRole === ROLES.STUDENT ? studentDataBase : teacherDataBase;

    // Validar mail y contraseña con regex
    if (!validateInput(mail, "email")) {
        errorMsg.textContent = "El mail ingresado no es válido.";
        return;
    };

    if (!validateInput(password, "password")) {
        errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula y un número.";
        return;
    };

    // Verificar si ya existe ese mail
    if (base.some(user => user.mail === mail)) {
        errorMsg.textContent = "Ese mail ya está registrado.";
        return;
    };

    // Verificar si legajo está precargado en base
    const index = base.findIndex(user => user.legajo === legajo && user.dni === dni);
    if (index === -1) {
        errorMsg.textContent = "No estás cargadx en la base institucional. Contactá a lxs directivxs de escuela.";
        return;
    };

    // Si es docente, validamos número de empleadx también
    if (currentRole === ROLES.TEACHER) {
        const numeroEmpleado = document.getElementById("register-numeroEmpleado").value.trim();
        const materia = document.getElementById("register-materia").value.trim();

        if (base[index].numeroEmpleado !== numeroEmpleado) {
            errorMsg.textContent = "Los datos no coinciden. Contactá a lxs directivxs de escuela.";
            return;
        };

        // Registro exitoso (docente)
        base[index] = new Teacher({
            nombre,
            mail,
            contraseña: password,
            dni,
            legajo,
            numeroEmpleado,
            materia,
            mensajes: []
        });

    } else if (currentRole === ROLES.STUDENT) {
        // Registro exitoso (alumnx)
        base[index] = new Student({
            nombre,
            mail,
            contraseña: password,
            dni,
            legajo,
            tareasPendientes: [],
            notas: {},
            mensajes: []
        });
    };

    // Guardar base actualizada en localStorage
    if (currentRole === ROLES.STUDENT) {
        localStorage.setItem("studentDataBase", JSON.stringify(studentDataBase));
    } else if (currentRole === ROLES.TEACHER) {
        localStorage.setItem("teacherDataBase", JSON.stringify(teacherDataBase));
    };

    // Guardar sesión activa
    localStorage.setItem("lastUser", JSON.stringify({
        mail: mail,
        nombre: nombre,
        rol: currentRole
    }));

    // Ocultar formulario registro y mostrar dashboard
    ocultarSeccion("form-register");

    if (currentRole === ROLES.STUDENT) {
        showStudentDashboard(base, index);
    } else {
        showTeacherDashboard(base, index);
    };
});


document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "btn-cerrar-sesion") {
        cerrarSesion();
    }
});



