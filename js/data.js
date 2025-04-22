// Base de datos simulada de estudiantes y docentes

const initialStudents = [
    new Student({
        nombre: "Sol Martínez",
        mail: "sol.martinez@mail.com",
        contraseña: "Sol1234",
        dni: "40123456",
        legajo: "A001",
        notas: {
            matematica: 9,
            lengua: 8,
            historia: 7
        },
        tareasPendientes: ["TP de Geografía", "Lectura de cuento corto"],
        mensajes: []
    }),
    new Student({
        nombre: "Bruno López",
        mail: "bruno.lopez@mail.com",
        contraseña: "Bruno2024",
        dni: "40991234",
        legajo: "A004",
        notas: {
            matematica: 6,
            lengua: 9,
            historia: 8
        },
        tareasPendientes: ["Esquema de Historia", "Ejercicios de Matemática"],
        mensajes: []
    }),
    new Student({
        nombre: "",
        mail: "",
        contraseña: "",
        dni: "40876543",
        legajo: "A002",
        notas: {},
        tareasPendientes: [],
        mensajes: []
    })
];

const initialTeachers = [
    new Teacher({
        nombre: "Laura Fernández",
        mail: "laura.fernandez@escuela.edu.ar",
        contraseña: "laura123",
        dni: "32145678",
        legajo: "P001",
        numeroEmpleado: "E001",
        materia: "Lengua y Literatura",
        mensajes: []
    }),
    new Teacher({
        nombre: "",
        mail: "",
        contraseña: "",
        dni: "33445566",
        legajo: "P003",
        numeroEmpleado: "E003",
        materia: "",
        mensajes: []
    })
];
