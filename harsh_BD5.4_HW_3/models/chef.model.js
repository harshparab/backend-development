const { DataType, sequelize } = require("../lib/index.js");

const chef = sequelize.define("chef", {
  name: { type: DataType.TEXT, allowNull: false },
  birthYear: { type: DataType.TEXT, allowNull: false },
});

module.exports = { chef };
