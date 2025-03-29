
// Declaración de variables globales
const studentDataBase = [
    {
        nombre: "Sol Martínez",
        mail: "sol.martinez@mail.com",
        password: "sol1234",
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
        password: "bruno2024",
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
        password: "",
        dni: "40876543",
        legajo: "A002",
        notas: {},
        tareasPendientes: [],
        mensajes: []
    },
    {
        nombre: "",
        mail: "",
        password: "",
        dni: "40987654",
        legajo: "A003",
        notas: {},
        tareasPendientes: [],
        mensajes: []
    }
];
const professorDataBase = [];

// Declaración de funciones 
function checkUserInformation(dataBase, user, password) {
    for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].user === user && dataBase[i].password === password) {
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


//Bienvenida y elección de rol 

let userType = prompt("Bienvenidx! ¿Sos alumnx o profe? ingresá una a si sos alumnx y una p si sos profe");
userType = userType.toLowerCase();

let isActiveUser = prompt("¿Ya etsas registradx? Si: Confirmar / No: Cancelar");

// paso a seguir si es profe o alumnx

if (userType === "a" && isActiveUser === true) {

    do {
        //Pido los datos del usuario:
        let userMail = prompt("Ingrese mail");
        let userPassword = prompt("Ingrese contraseña");

        //Chequeo si los datos estan en la base 
        let access = checkUserInformation(studentDataBase, userMail, userPassword);

        if (access !== false) {
            //Si estan le doy acceso
            showStudentDashboard(studentDataBase, access);
        };

        //Si no estan le aviso y le pregunto si desea intentar de  nuevo
        let tryAgain = confirm("Los datos  no coinciden. ¿Deseas intentar de nuevo? Si: Confirmar / No: Cancelar");


    } while (access === false && tryAgain === true);
    //Que  deberia hacer acá? 


} else if (userType === "a" && isActiveUser === false) {
    // llamo a la funcion de singup
    studentDataBase.push(signUpStudent());
};

if (userType === "p" && isActiveUser === true) {
    //llamo a funcion de login que recibe de parametros una funcion y la base de datos. 
    loginProfessor(professorDataBase, showProfessorDashboard);

} else if (userType === "p" && isActiveUser === false) {
    // llamo a la funcion de singup
    professorDataBase.push(signUpProfessor());
};
