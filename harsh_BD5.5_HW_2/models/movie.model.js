const { DataType, sequelize } = require("../lib/index.js");

const movie = sequelize.define("movie", {
  title: DataType.TEXT,
  director: DataType.TEXT,
  genre: DataType.TEXT,
  year: DataType.INTEGER,
  summary: DataType.TEXT,
});

module.exports = { movie };
