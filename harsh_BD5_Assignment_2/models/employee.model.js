const { DataType, sequelize } = require("../lib/index.js");

const employee = sequelize.define("employee", {
    name: { type: DataType.TEXT, allowNull: false },
    email: { type: DataType.TEXT, unique: true, allowNull: false }
});

module.exports = { employee };
