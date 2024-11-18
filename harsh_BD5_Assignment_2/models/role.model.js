const { DataType, sequelize } = require("../lib/index.js");

const role = sequelize.define("role", {
    title: { type: DataType.TEXT }
})

module.exports = { role };
