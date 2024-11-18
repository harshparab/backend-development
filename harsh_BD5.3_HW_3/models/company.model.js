const { DataType, sequelize } = require("../lib/index.js");

const company = sequelize.define("company", {
  name: DataType.TEXT,
  industry: DataType.TEXT,
  foundedYear: DataType.INTEGER,
  headquarters: DataType.TEXT,
  revenue: DataType.INTEGER,
});

module.exports = { company };
