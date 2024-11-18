const { DataType, sequelize } = require("../lib/index.js");

const book = sequelize.define("book", {
  title: { type: DataType.TEXT, allowNull: false },
  genre: { type: DataType.TEXT, allowNull: false },
  publicationYear: { type: DataType.INTEGER, allowNull: false },
});

module.exports = { book };
