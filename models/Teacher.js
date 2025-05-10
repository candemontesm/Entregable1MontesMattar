import User from "./User.js";

export default class Teacher extends User {
  constructor(props) {
    super(props);
    this.legajo = props.legajo;
    this.subject = props.subject;
  }
}
