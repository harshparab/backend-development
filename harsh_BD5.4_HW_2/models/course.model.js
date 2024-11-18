const { DataType, sequelize } = require("../lib/index.js");

const course = sequelize.define("course", {
  title: { type: DataType.TEXT, allowNull: false },
  description: DataType.TEXT,
});

module.exports = { course };
