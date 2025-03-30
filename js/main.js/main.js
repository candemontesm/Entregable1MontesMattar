
// Declaración de variables globales
const studentDataBase = [
    {
        nombre: "Sol Martínez",
        mail: "sol.martinez@mail.com",
        contraseña: "sol1234",
        dni: "40123456",
        legajo: "A001",
        notas: {
            matematica: 9,
            lengua: 8,
            historia: 7
        },
        tareasPendientes: ["TP de Geografía", "Lectura de cuento corto"],
        mensajes: []
    },
    {
        nombre: "Bruno López",
        mail: "bruno.lopez@mail.com",
        contraseña: "bruno2024",
        dni: "40991234",
        legajo: "A004",
        notas: {
            matematica: 6,
            lengua: 9,
            historia: 8
        },
        tareasPendientes: ["Esquema de Historia", "Ejercicios de Matemática"],
        mensajes: []
    },
    {
        nombre: "",
        mail: "",
        contraseña: "",
        dni: "40876543",
        legajo: "A002",
        notas: {},
        tareasPendientes: [],
        mensajes: []
    },
    {
        nombre: "",
        mail: "",
        contraseña: "",
        dni: "40987654",
        legajo: "A003",
        notas: {},
        tareasPendientes: [],
        mensajes: []
    }
];
const teacherDataBase = [
    {
        nombre: "Laura Fernández",
        mail: "laura.fernandez@escuela.edu.ar",
        contraseña: "laura123",
        dni: "32145678",
        legajo: "P001",
        numeroEmpleado: "E001",
        materia: "Lengua y Literatura",
        mensajes: []
    },
    {
        nombre: "Carlos Gutiérrez",
        mail: "carlos.gutierrez@escuela.edu.ar",
        contraseña: "carlos456",
        dni: "33998877",
        legajo: "P002",
        numeroEmpleado: "E002",
        materia: "Historia",
        mensajes: []
    },
    {
        nombre: "",
        mail: "",
        contraseña: "",
        dni: "33445566",
        legajo: "P003",
        numeroEmpleado: "E003",
        materia: "",
        mensajes: []
    },
    {
        nombre: "",
        mail: "",
        contraseña: "",
        dni: "32221100",
        legajo: "P004",
        numeroEmpleado: "E004",
        materia: "",
        mensajes: []
    }
];

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







