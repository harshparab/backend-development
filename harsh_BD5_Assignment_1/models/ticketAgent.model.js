const { DataType, sequelize } = require("../lib/index.js");
const { agent } = require("./agent.model.js");
const { ticket } = require("./ticket.model.js");

const ticketAgent = sequelize.define("ticketAgent", {
  ticketId: {
    type: DataType.INTEGER,
    references: { model: ticket, key: "id" },
  },
  agentId: {
    type: DataType.INTEGER,
    references: { model: agent, key: "id" },
  },
});

ticket.belongsToMany(agent, { through: ticketAgent });
agent.belongsToMany(ticket, { through: ticketAgent });

module.exports = { ticketAgent };
