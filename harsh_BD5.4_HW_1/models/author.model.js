const { DataType, sequelize } = require("../lib/index.js");

const author = sequelize.define("author", {
  name: { type: DataType.TEXT, allowNull: false },
  birthYear: { type: DataType.INTEGER, allowNull: false },
});

module.exports = { author };
