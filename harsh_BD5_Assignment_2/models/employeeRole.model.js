const { DataType, sequelize } = require("../lib/index.js");
const { employee } = require("./employee.model.js");
const { role } = require("./role.model.js");

const employeeRole = sequelize.define("employeeRole", {
    employeeId: {
        type: DataType.TEXT,
        references: {
            model: employee,
            key: "id"
        }
    },
    roleId: {
        type: DataType.TEXT,
        references: {
            model: role,
            key: "id"
        }
    }
})

module.exports = { employeeRole };
