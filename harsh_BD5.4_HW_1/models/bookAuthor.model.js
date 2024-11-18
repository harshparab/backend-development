const { DataType, sequelize } = require("../lib/index.js");
const { author } = require("./author.model.js");
const { book } = require("./book.model.js");

const bookAuthor = sequelize.define("bookAuthor", {
  authorId: {
    type: DataType.INTEGER,
    references: {
      model: author,
      key: "id",
    },
  },
  bookId: {
    type: DataType.INTEGER,
    references: {
      model: book,
      key: "id",
    },
  },
});

book.belongsToMany(author, { through: bookAuthor });
author.belongsToMany(book, { through: bookAuthor });

module.exports = { bookAuthor };
