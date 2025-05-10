export default class User {
  constructor({ id, firstName, lastName, email, password }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
