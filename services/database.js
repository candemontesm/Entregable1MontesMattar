/* global Swal, Toastify */
import { loadLS, saveLS } from "./storage.js";
import { getData } from "./api.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

const DB_KEY = "cpem30_db";

// Carga inicial (JSON -> instancias -> LS)
export async function initDatabase() {
  let db = loadLS(DB_KEY);
  if (!db) {
    const [studentsJSON, teachersJSON, tasks, grades, messages] =
      await Promise.all([
        getData("students"),
        getData("teachers"),
        getData("tasks"),
        getData("grades"),
        getData("messages"),
      ]);

    db = {
      students: studentsJSON.map((s) => new Student(s)),
      teachers: teachersJSON.map((t) => new Teacher(t)),
      tasks,
      grades,
      messages,
    };
    saveLS(DB_KEY, db);
  }
  return db;
}

export const dbGet = () => loadLS(DB_KEY);
export const dbSet = (db) => saveLS(DB_KEY, db);
