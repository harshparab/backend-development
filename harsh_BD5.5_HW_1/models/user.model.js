const { DataType, sequelize } = require("../lib/index.js");

const user = sequelize.define("user", {
  username: {
    type: DataType.TEXT,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataType.TEXT,
    unique: true,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  },
  password: {
    type: DataType.TEXT,
    allowNull: false,
  },
});

module.exports = { user };
