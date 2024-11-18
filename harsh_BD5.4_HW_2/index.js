const express = require("express");
const { resolve } = require("path");
const { course } = require("./models/course.model");
const { sequelize } = require("./lib");
const { student } = require("./models/student.model");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

let courseData = [
  { title: "Math 101", description: "Basic Mathematics" },
  { title: "History 201", description: "World History" },
  { title: "Science 301", description: "Basic Sciences" },
];

let studentData = [
  { name: "John Doe", age: 24 },
  { name: "Harsh Parab", age: 26 },
  { name: "Nikhil Sonje", age: 24 },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await course.bulkCreate(courseData);
    await student.bulkCreate(studentData);

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function addNewStudent(newStudent) {
  let newStudentData = await student.create(newStudent);

  return { newStudent: newStudentData };
}

app.post("/students/new", async (req, res) => {
  try {
    let newStudent = req.body.newStudent;

    let result = await addNewStudent(newStudent);

    if (result.newStudent != undefined) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to add new student" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function updateStudentById(newStudentData, id) {
  let updatedStudentData = await student.findOne({ where: { id } });

  if (updatedStudentData) {
    updatedStudentData.set(newStudentData);
    updatedStudentData.save();

    return {
      message: "Student updated successfully",
      updatedStudent: updatedStudentData,
    };
  } else {
    return { message: "" };
  }
}

app.post("/students/update/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let newStudentData = req.body;

    let result = await updateStudentById(newStudentData, id);
    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to update data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
