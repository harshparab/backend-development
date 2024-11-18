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
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataType.TEXT,
    allowNull: false,
  },
});

module.exports = { user };
