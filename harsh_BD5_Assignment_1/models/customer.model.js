const { DataType, sequelize } = require("../lib/index.js");

const customer = sequelize.define("customer", {
  name: { type: DataType.TEXT, allowNull: false },
  email: { type: DataType.TEXT, unique: true, allowNull: false },
});

module.exports = { customer };
