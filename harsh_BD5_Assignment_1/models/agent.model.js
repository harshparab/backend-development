const { DataType, sequelize } = require("../lib/index.js");

const agent = sequelize.define("agent", {
  name: { type: DataType.TEXT, allowNull: false },
  email: { type: DataType.TEXT, unique: true, allowNull: false },
});

module.exports = { agent };
