
//Bienvenida y elección de rol 
const studentDataBase = [];
const professorDataBase = [];

let userType = prompt("Bienvenidx! ¿Sos alumnx o profe? ingresá una a si sos alumnx y una p si sos profe");
userType = userType.toLowerCase();

let isActiveUser = prompt("¿Ya etsas registradx? Si:Confirmar / No: Cancelar.");

// paso a seguir si es profe o alumnx

if (userType === "a" && isActiveUser === true) {
    //llamo a funcion de login que recibe de parametros una funcion y la base de datos. 
    loginStudent(studentDataBase, showStudentDashboard);

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
