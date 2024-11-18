const { DataType, sequelize } = require("../lib/index.js");
const { employee } = require("./employee.model.js");
const { department } = require("./department.model.js")

const employeeDepartment = sequelize.define("employeeDepartment", {
    employeeId: { type: DataType.TEXT, references: { model: employee, key: "id" } },
    departmentId: { type: DataType.TEXT, references: { model: department, key: "id" } }
});

module.exports = { employeeDepartment };
