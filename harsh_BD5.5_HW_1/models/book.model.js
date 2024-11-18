const { DataType, sequelize } = require("../lib/index.js");

const book = sequelize.define("book", {
  title: DataType.TEXT,
  author: DataType.TEXT,
  genre: DataType.TEXT,
  year: DataType.INTEGER,
  summary: DataType.TEXT,
});

module.exports = { book };
