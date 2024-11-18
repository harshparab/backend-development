const { DataType, sequelize } = require("../lib/index.js");
const { course } = require("./course.model");
const { student } = require("./student.model.js");

const studentCourse = sequelize.define("studentCourse", {
  studentId: {
    type: DataType.TEXT,
    references: {
      model: student,
      key: "id",
    },
  },
  courseId: {
    type: DataType.TEXT,
    references: {
      model: course,
      key: "id",
    },
  },
});

student.belongsToMany(course, { through: studentCourse });
course.belongsToMany(student, { through: studentCourse });

module.exports = { studentCourse };
