const { DataType, sequelize } = require("../lib/index.js");
const { agent } = require("./agent.model.js");
const { customer } = require("./customer.model.js");

const ticket = sequelize.define("ticket", {
  title: DataType.TEXT,
  description: DataType.TEXT,
  status: DataType.TEXT,
  priority: DataType.INTEGER,
  customerId: {
    type: DataType.INTEGER,
    references: { model: customer, key: "id" },
  },
  agentId: {
    type: DataType.INTEGER,
    references: { model: agent, key: "id" },
  },
});

module.exports = { ticket };
