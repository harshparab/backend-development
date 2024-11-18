const { DataType, sequelize } = require("../lib/index.js");
const { customer } = require("./customer.model.js");
const { ticket } = require("./ticket.model.js");

const ticketCustomer = sequelize.define("ticketCustomer", {
  ticketId: {
    type: DataType.INTEGER,
    references: { model: ticket, key: "id" },
  },
  customerId: {
    type: DataType.INTEGER,
    references: { model: customer, key: "id" },
  },
});

ticket.belongsToMany(customer, { through: ticketCustomer });
customer.belongsToMany(ticket, { through: ticketCustomer });

module.exports = { ticketCustomer };
