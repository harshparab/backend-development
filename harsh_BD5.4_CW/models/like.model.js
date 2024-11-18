const { DataType, sequelize } = require("../lib/index.js");
const { user } = require("./user.model.js");
const { track } = require("./track.model.js");

const like = sequelize.define("like", {
  userId: {
    type: DataType.INTEGER,
    references: {
      model: user,
      key: "id",
    },
  },
  trackId: {
    type: DataType.INTEGER,
    references: {
      model: track,
      key: "id",
    },
  },
});

user.belongsToMany(track, { through: like });
track.belongsToMany(user, { through: like });

module.exports = { like };
