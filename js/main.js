
// Declaración de variables globales
// Definición de roles
const ROLES = {
    STUDENT: "STUDENT",
    TEACHER: "TEACHER"
};

// Clase base: User
class User {
    constructor(data) {
        this.nombre = data.nombre;
        this.mail = data.mail;
        this.contraseña = data.contraseña;
        this.dni = data.dni;
        this.legajo = data.legajo;
        this.mensajes = data.mensajes || [];
    };
};

// Clase Student que hereda de User
class Student extends User {
    constructor(data) {
        super(data);
        this.rol = ROLES.STUDENT;
        this.notas = data.notas || {};
        this.tareasPendientes = data.tareasPendientes || [];
    };
};

// Clase Teacher que hereda de User
class Teacher extends User {
    constructor(data) {
        super(data);
        this.rol = ROLES.TEACHER;
        this.numeroEmpleado = data.numeroEmpleado;
        this.materia = data.materia;
    };
};

// Bases de datos activas (se cargan desde data.js)
let studentDataBase = [...initialStudents];
let teacherDataBase = [...initialTeachers];

// Variable para guardar el rol seleccionado
let currentRole = null;

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
    }
};


// Al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    const lastUser = JSON.parse(localStorage.getItem("lastUser"));

    if (lastUser) {
        // Si hay un usuario guardado, mostramos el login directo
        mostrarSeccion("inicio-sesion");

        const saludo = document.getElementById("saludo-personalizado");
        saludo.textContent = `Bienvenidx ${lastUser.nombre} al Aula Virtual del CPEM 30`;

    } else {
        // Si no hay sesión guardada, mostramos opciones básicas
        mostrarSeccion("seleccion-inicial");
    }
});

document.getElementById("btn-ingresar-sesion").addEventListener("click", () => {
    const lastUser = JSON.parse(localStorage.getItem("lastUser"));
    const inputPassword = document.getElementById("input-password").value;
    let base = null;

    // Determinar base según el rol
    if (lastUser.rol === ROLES.STUDENT) {
        base = studentDataBase;
    } else if (lastUser.rol === ROLES.TEACHER) {
        base = teacherDataBase;
    }

    // Buscar al usuario en la base según mail
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

document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que recargue la página

    const mail = document.getElementById("login-mail").value.trim();
    const password = document.getElementById("login-password").value;

    // Validaciones con regex
    const errorMsg = document.getElementById("login-error");

    if (!validateInput(mail, "email")) {
        errorMsg.textContent = "El mail ingresado no es válido.";
        return;
    }

    if (!validateInput(password, "password")) {
        errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula y un número.";
        return;
    }

    // Buscar en la base correspondiente
    let base = currentRole === ROLES.STUDENT ? studentDataBase : teacherDataBase;

    const userIndex = base.findIndex(user => user.mail === mail);

    if (userIndex !== -1 && base[userIndex].contraseña === password) {
        // Guardar sesión
        localStorage.setItem("lastUser", JSON.stringify({
            mail: base[userIndex].mail,
            nombre: base[userIndex].nombre,
            rol: base[userIndex].rol
        }));

        // Mostrar dashboard
        ocultarSeccion("form-login");

        if (currentRole === ROLES.STUDENT) {
            showStudentDashboard(base, userIndex);
        } else {
            showTeacherDashboard(base, userIndex);
        }

    } else {
        alert("Los datos ingresados no coinciden con ningún usuario registrado.");
    }
});








/*

// Declaración de funciones 
function checkUserInformation(dataBase, prop1, value1, prop2, value2) {
    for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i][prop1] === value1 && dataBase[i][prop2] === value2) {
            return i;
        };
    };
    return false;
};

function loginStudent(dataBase) {
    let tryAgain;
    let userInDataBase;

    do {
        let userMail = prompt("Ingresá tu mail");
        let userPassword = prompt("Ingresá tu contraseña");

        userInDataBase = checkUserInformation(dataBase, "mail", userMail, "contraseña", userPassword);

        if (userInDataBase !== false) {

            showStudentDashboard(dataBase, userInDataBase);
            break;
        } else {
            tryAgain = confirm("Los datos  no coinciden.\n" +
                "¿Querés intentar de nuevo?\n" +
                "Si: Confirmar / No: Cancelar"
            );
        };

    } while (userInDataBase === false && tryAgain === true);
};


function showStudentDashboard(dataBase, studentIndex) {
    const currentUser = dataBase[studentIndex];
    alert(`¡Bienvenidx ${currentUser.nombre}!`);
    let option = "";

    while (option !== "3") {
        option = prompt(
            "Escribí el número de la opción que elijas:\n" +
            "1. Ver notas\n" +
            "2. Ver tareas pendientes\n" +
            "3. Salir"
        );

        if (option === "1") {
            alert(
                "Tus notas:\n" +
                "Matemática: " + currentUser.notas.matematica + "\n" +
                "Lengua: " + currentUser.notas.lengua + "\n" +
                "Historia: " + currentUser.notas.historia
            );
        } else if (option === "2") {
            if (currentUser.tareasPendientes.length === 0) {
                alert("¡No  tenes tareas pendientes!");
            } else {
                let message = "Tareas pendientes:\n"

                for (let i = 0; i < currentUser.tareasPendientes.length; i++) {
                    message += (i + 1) + ". " + currentUser.tareasPendientes[i] + "\n";
                };

                alert(message);
            };

        } else if (option === "3") {
            alert("¡Hasta pronto!");
        } else {
            alert("Opción inválida. Intentá de nuevo.");
        };
    };
};

function signUpStudent(dataBase, index) {
    dataBase[index].nombre = prompt("Ingresá: Nombre y Apellido");
    dataBase[index].mail = prompt("Ingresá: Mail");
    dataBase[index].contraseña = prompt("Ingresá: Contraseña");
};


function loginTeacher(dataBase) {
    let userInDataBase;
    let tryAgain;
    do {
        let userEmployeeNum = prompt("Ingresá tu Número de Empleado");
        let userPassword = prompt("Ingresá tu contraseña");

        userInDataBase = checkUserInformation(dataBase, "numeroEmpleado", userEmployeeNum, "contraseña", userPassword);

        if (userInDataBase !== false) {
            showTeacherDashboard(dataBase, userInDataBase);
            break;
        } else {
            tryAgain = confirm("Los datos  no coinciden.\n" +
                "¿Querés intentar de nuevo?\n" +
                "Si: Confirmar / No: Cancelar"
            );
        };

    } while (userInDataBase === false && tryAgain === true);
};


function showTeacherDashboard(dataBase, teacherIndex) {
    const currentUser = dataBase[teacherIndex];
    let option = "";

    while (option !== "3") {
        option = prompt(
            `Hola, profe ${currentUser.nombre}\n` +
            `Materia: ${currentUser.materia}\n\n` +
            "¿Qué desea hacer?\n" +
            "1. Ver mensajes recibidos\n" +
            "2. Cargar aviso para alumnxs\n" +
            "3. Cerrar sesión"
        );

        if (option === "1") {
            if (currentUser.mensajes.length === 0) {
                alert("No tiene mensajes nuevos.");
            } else {
                let mensajesTexto = "Mensajes recibidos:\n";

                for (let i = 0; i < currentUser.mensajes.length; i++) {
                    mensajesTexto += (i + 1) + ". " + currentUser.mensajes[i] + "\n";
                };

                alert(mensajesTexto);
            };

        } else if (option === "2") {
            let aviso = prompt("Escriba el nuevo aviso o tarea:");
            alert("Usted publicó un nuevo aviso: " + aviso);

        } else if (option === "3") {
            alert("Sesión cerrada. ¡Hasta luego, profe!");
        } else {
            alert("Opción inválida. Inténtelo de nuevo.");
        };
    };

};
function signUpTeacher(dataBase, index) {
    dataBase[index].nombre = prompt("Ingrese: Nombre y Apellido");
    dataBase[index].mail = prompt("Ingrese: Mail");
    dataBase[index].contraseña = prompt("Ingrese: Contraseña");
    dataBase[index].materia = prompt("Ingrese: Materia que enseña");
};

//Inicio del programa

let userType;
let isActiveUser;
let cancelado = false;

do {
    userType = prompt(
        "¡Bienvenidx!\n" +
        "¿Sos alumnx o profe?\n" +
        "Ingresá 'a' si sos alumnx\n" +
        "Ingresá 'p' si sos profe"
    );

    if (userType === null) {
        cancelado = true;
        alert("Operación cancelada. ¡Hasta Pronto!");
        break;
    };

    userType = userType.toLowerCase();

    if (userType !== "a" && userType !== "p") {
        alert("Opción inválida. Por favor, intentá nuevamente");
    };
} while (userType !== "a" && userType !== "p");


if (!cancelado) {
    isActiveUser = confirm(
        "¿Ya estás registradx?\n" +
        "Si: Confirmar / No: Cancelar"
    );

    //ALUMNX:
    if (userType === "a" && isActiveUser === true) {

        loginStudent(studentDataBase);

    } else if (userType === "a" && isActiveUser === false) {

        let userId = prompt("Ingresá tu numero de DNI, sin puntos");
        let userFile = prompt(
            "Ingresa tu número de legajo.\n" +
            "Si no lo sabés, comunicate con lxs directivxs de la Escuela."
        );

        let userInDataBase = checkUserInformation(studentDataBase, "dni", userId, "legajo", userFile);

        if (userInDataBase === false) {
            alert("No estás cargado en la base de datos.\n" +
                "Comunicate con lxs directivxs de la Escuela."
            );
        } else {

            signUpStudent(studentDataBase, userInDataBase);
            alert("¡Registro exitoso!");
            let login = confirm("¿Querés Ingresar a tu cuenta?");

            if (login === true) {
                loginStudent(studentDataBase);
            } else {
                alert("¡Muchas gracias por tu visita!\n" +
                    "Nos vemos pronto."
                );
            };
        };


    };

    //PROFE:

    if (userType === "p" && isActiveUser === true) {

        loginTeacher(teacherDataBase);

    } else if (userType === "p" && isActiveUser === false) {

        let userEmployeeNum = prompt(
            "Ingrese su numero de empleadx.\n" +
            "Si no lo sabe no puede continuar.\n" +
            "Comuníquese con lxs directivxs de la Escuela."
        );
        let userFile = prompt(
            "Ingrese su número de legajo.\n" +
            "Si no lo sabe no puede continuar.\n" +
            "Comuníquese con lxs directivxs de la Escuela."
        );

        let userInDataBase = checkUserInformation(teacherDataBase, "numeroEmpleado", userEmployeeNum, "legajo", userFile)

        if (userInDataBase === false) {
            alert("No está cargado en la base de datos.\n" +
                "Comuníquese con lxs directivxs de la Escuela."
            );

        } else {

            signUpTeacher(teacherDataBase, userInDataBase);
            alert("¡Registro exitoso!");
            const login = confirm("¿Quiere ingresar a su cuenta?");

            if (login === true) {
                loginTeacher(teacherDataBase);

            } else {
                alert("¡Muchas gracias por tu visita!\n" +
                    "Nos vemos pronto :)"
                );
            };
        };

    };
};

*/





