const { DataType, sequelize } = require("../lib/index.js");

const department = sequelize.define("department", {
    name: { type: DataType.TEXT }
})

module.exports = { department };
