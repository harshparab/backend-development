const { DataType, sequelize } = require("../lib/index.js");

const student = sequelize.define("student", {
  name: {
    type: DataType.TEXT,
    allowNull: false,
  },
  age: {
    type: DataType.INTEGER,
    allowNull: false,
  },
});

module.exports = { student };
