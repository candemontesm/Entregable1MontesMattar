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