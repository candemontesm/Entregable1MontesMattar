import User from "./User.js";

export default class Student extends User {
  constructor(props) {
    super(props);
    this.legajo = props.legajo;
    this.course = props.course;
  }
}
