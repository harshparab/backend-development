const { DataType, sequelize } = require("../lib/index.js");

const employee = sequelize.define("employee", {
  name: DataType.TEXT,
  designation: DataType.TEXT,
  department: DataType.TEXT,
  salary: DataType.INTEGER,
});

module.exports = { employee };
