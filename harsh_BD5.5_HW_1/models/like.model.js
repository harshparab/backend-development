const { DataType, sequelize } = require("../lib/index.js");
const { user } = require("./user.model.js");
const { book } = require("./book.model.js");

const like = sequelize.define("like", {
  userId: {
    type: DataType.INTEGER,
    references: {
      model: user,
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

user.belongsToMany(book, { through: like });
book.belongsToMany(user, { through: like });

module.exports = { like };
