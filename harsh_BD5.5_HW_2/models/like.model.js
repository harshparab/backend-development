const { DataType, sequelize } = require("../lib/index.js");
const { movie } = require("./movie.model.js");
const { user } = require("./user.model.js");

const like = sequelize.define("like", {
  userId: {
    type: DataType.INTEGER,
    references: {
      model: user,
      key: "id",
    },
  },
  movieId: {
    type: DataType.INTEGER,
    references: {
      model: movie,
      key: "id",
    },
  },
});

movie.belongsToMany(user, { through: like });
user.belongsToMany(movie, { through: like });

module.exports = { like };
