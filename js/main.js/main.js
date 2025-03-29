
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
const professorDataBase = [
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
function checkUserInformation(dataBase, userInfo1, userInfo2) {
    for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].userInfo1 === userInfo1 && dataBase[i].userInfo2 === userInfo2) {
            return i;
        };
    };
    return false;
};

function showStudentDashboard(dataBase, index) {
    const currentUser = dataBase[index];
    alert(`¡Bienvenidx ${currentUser.nombre}`)
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
            alert(
                "Tareas pendientes:\n" +
                "- " + currentUser.tareasPendientes[0] + "\n" +
                "- " + currentUser.tareasPendientes[1]
            );
        } else if (option === "3") {
            alert("¡Hasta pronto!");
        } else {
            alert("Opción inválida. Intentá de nuevo.");
        };
    };
};

function signUpStudent(dataBase, index) {
    dataBase[index].nombre = prompt("Ingresa: Nombre y Apellido");
    dataBase[index].mail = prompt("Ingresá: Mail");
    dataBase[index].contraseña = prompt("Ingresa: Contraseña");
};

function loginStudent(dataBase) {
    do {
        //Pido los datos del usuario:
        let mail = prompt("Ingresá tu mail");
        let contraseña = prompt("Ingresá tu contraseña");

        //Chequeo si los datos estan en la base 
        let userInDataBase = checkUserInformation(studentDataBase, mail, contraseña);

        if (userInDataBase !== false) {
            //Si estan le doy acceso
            showStudentDashboard(studentDataBase, userInDataBase);
        };

        //Si no estan le aviso y le pregunto si desea intentar de  nuevo
        let tryAgain = confirm("Los datos  no coinciden.\n" +
            "¿Querés intentar de nuevo?\n" +
            "Si: Confirmar / No: Cancelar"
        );


    } while (userInDataBase === false && tryAgain === true);
    //Que  deberia hacer acá? 
};

function loginProfessor(dataBase) {
    do {
        //Pido los datos del usuario:
        let numeroEmpleado = prompt("Ingresá tu Número de Empleado");
        let contraseña = prompt("Ingresá tu contraseña");

        //Chequeo si los datos estan en la base 
        let userInDataBase = checkUserInformation(professorDataBase, numeroEmpleado, contraseña);

        if (userInDataBase !== false) {
            //Si estan le doy acceso
            showProfessorDashboard(professorDataBase, userInDataBase);
        };

        //Si no estan le aviso y le pregunto si desea intentar de  nuevo
        let tryAgain = confirm("Los datos  no coinciden.\n" +
            "¿Querés intentar de nuevo?\n" +
            "Si: Confirmar / No: Cancelar"
        );


    } while (userInDataBase === false && tryAgain === true);
};

function signUpProfessor(dataBase, index) {
    dataBase[index].nombre = prompt("Ingresá: Nombre y Apellido");
    dataBase[index].mail = prompt("Ingresá: Mail");
    dataBase[index].contraseña = prompt("Ingresá: Contraseña");
    dataBase[index].materia = prompt("Ingresá: Materia que enseñas")
};

function showProfessorDashboard(dataBase, index) {
    const currentUser = dataBase[index];
    let option = "";

    while (option !== "3") {
        option = prompt(
            `Hola, profe ${currentUser.nombre} 👩‍🏫\n` +
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
                    mensajesTexto += "- " + teacher.mensajes[i] + "\n";
                };

                alert(mensajesTexto);
            };

        } else if (option === "2") {
            let aviso = prompt("Escribí el nuevo aviso o tarea:");
            alert("El aviso se publicó: " + aviso);

        } else if (option === "3") {
            alert("Sesión cerrada. ¡Hasta luego, profe!");
        } else {
            alert("Opción inválida. Intentelo de nuevo.");
        };
    };

};

//Inicio del programa

let userType = prompt(
    "¡Bienvenidx!\n" +
    "¿Sos alumnx o profe?\n" +
    "Ingresá 'a' si sos alumnx\n" +
    "Ingresá 'p' si sos profe"
);
userType = userType.toLowerCase();

let isActiveUser = prompt(
    "¿Ya etsas registradx?\n" +
    "Si: Confirmar\n" +
    "No: Cancelar"
);

// paso a seguir si es profe o alumnx
//ALUMNX:

if (userType === "a" && isActiveUser === true) {

    loginStudent(studentDataBase);

} else if (userType === "a" && isActiveUser === false) {

    //Pido los datos
    let dni = prompt("Ingresá tu numero de DNI, sin puntos");
    let legajo = prompt(
        "Ingresa tu número de legajo.\n" +
        "Si no lo sabés, comunicate con lxs directivxs de la Escuela."
    );

    let userInDataBase = checkUserInformation(studentDataBase, dni, legajo)
    //Si no esta le aviso que no esta 
    if (userInDataBase === false) {
        alert("No estás cargado en la base de datos.\n" +
            "Comunicate con lxs directivxs de la Escuela."
        );
    } else {

        signUpStudent(studentDataBase, userInDataBase);
        alert("¡Registro exitoso!");
        const login = confirm("¿Querés Ingresar a tu cuenta?");
        if (login === true) {
            loginStudent(studentDataBase);
        } else {
            alert("¡Muchas gracias por tu visita!\n" +
                "Nos vemos pronto "
            );
        };
    };


};

//PROFE:

if (userType === "p" && isActiveUser === true) {
    //llamo a funcion de login que recibe de parametros una funcion y la base de datos. 
    loginProfessor(professorDataBase);

} else if (userType === "p" && isActiveUser === false) {

    //Pido los datos
    let numeroEmpleado = prompt(
        "Ingresá tu numero de empleadx.\n" +
        "Si no lo sabés, comunicate con la Dirección de la Escuela."
    );
    let legajo = prompt(
        "Ingresa tu número de legajo.\n" +
        "Si no lo sabés, Comunicate con lxs directivxs de la Escuela."
    );

    let userInDataBase = checkUserInformation(professorDataBase, numeroEmpleado, legajo)
    //Si no esta le aviso que no esta 
    if (userInDataBase === false) {
        alert("No estás cargado en la base de datos.\n" +
            "Comunicate con lxs directivxs de la Escuela."
        );
    } else {

        signUpProfessor(professorDataBase, userInDataBase);
        alert("¡Registro exitoso!");
        const login = confirm("¿Querés Ingresar a tu cuenta?");
        if (login === true) {
            loginProfessor(professorDataBase);
        } else {
            alert("¡Muchas gracias por tu visita!\n" +
                "Nos vemos pronto :)"
            );
        };
    };

};
