const express = require("express");
const { resolve } = require("path");
const { ticket } = require("./models/ticket.model.js");
const { agent } = require("./models/agent.model.js");
const { customer } = require("./models/customer.model.js");
const { ticketAgent } = require("./models/ticketAgent.model.js");
const { ticketCustomer } = require("./models/ticketCustomer.model.js");
const { sequelize } = require("./lib/index.js");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    let customers = await customer.bulkCreate([
      { customerId: 1, name: "Alice", email: "alice@example.com" },
      { customerId: 2, name: "Bob", email: "bob@example.com" },
    ]);

    let agents = await agent.bulkCreate([
      { agentId: 1, name: "Charlie", email: "charlie@example.com" },
      { agentId: 2, name: "Dave", email: "dave@example.com" },
    ]);

    let tickets = await ticket.bulkCreate([
      {
        ticketId: 1,
        title: "Login Issue",
        description: "Cannot login to account",
        status: "open",
        priority: 1,
        customerId: 1,
        agentId: 1,
      },
      {
        ticketId: 2,
        title: "Payment Failure",
        description: "Payment not processed",
        status: "closed",
        priority: 2,
        customerId: 2,
        agentId: 2,
      },
      {
        ticketId: 3,
        title: "Bug Report",
        description: "Found a bug in the system",
        status: "open",
        priority: 3,
        customerId: 1,
        agentId: 1,
      },
    ]);

    await ticketCustomer.bulkCreate([
      { ticketId: tickets[0].id, customerId: customers[0].id },
      { ticketId: tickets[2].id, customerId: customers[0].id },
      { ticketId: tickets[1].id, customerId: customers[1].id },
    ]);

    await ticketAgent.bulkCreate([
      { ticketId: tickets[0].id, agentId: agents[0].id },
      { ticketId: tickets[2].id, agentId: agents[0].id },
      { ticketId: tickets[1].id, agentId: agents[1].id },
    ]);

    return res.status(200).send({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ error: error.message, message: "Failed to seed database" });
  }
});

// Helper function to get ticket's associated customers
async function getTicketCustomers(ticketId) {
  const ticketCustomers = await ticketCustomer.findAll({
    where: { ticketId },
  });

  let customerData;
  for (let cus of ticketCustomers) {
    customerData = await customer.findOne({
      where: { id: cus.customerId },
    });
  }

  return customerData;
}

// Helper function to get ticket's associated agents
async function getTicketAgents(ticketId) {
  const ticketAgents = await ticketAgent.findAll({
    where: { ticketId },
  });

  let agentData;
  for (let singleAgent of ticketAgents) {
    agentData = await agent.findOne({
      where: { id: singleAgent.agentId },
    });
  }

  return agentData;
}

// Helper function to get ticket details with associated customers and agents
async function getTicketDetails(ticketData) {
  const customer = await getTicketCustomers(ticketData.id);
  const agent = await getTicketAgents(ticketData.id);

  return {
    ...ticketData.dataValues,
    customer,
    agent,
  };
}

// Helper function to create new ticket
async function createNewTicket(newTicket) {
  let newTicketData = await ticket.create(newTicket);

  return newTicketData;
}

// Helper function to create ticket agent mapping
async function createTicketAgentMapping(data) {
  let ticketAgentMappingData = await ticketAgent.create({
    ticketId: data.ticketId,
    agentId: data.agentId,
  });

  return { ticketAgentMappingData };
}

// Helper function to create ticket customer mapping
async function createTicketCustomerMapping(data) {
  let ticketCustomerMappingData = await ticketCustomer.create({
    ticketId: data.ticketId,
    customerId: data.customerId,
  });

  return { ticketCustomerMappingData };
}

// Helper function to remove ticket agent mapping
async function removeTicketAgentMapping(data) {
  let removeAgentMapping = await ticketAgent.destroy({
    where: {
      ticketId: data.ticketId,
    },
  });

  return { removeAgentMapping };
}

// Helper function to remove ticket customer mapping
async function removeTicketCustomerMapping(data) {
  let removeCustomerMapping = await ticketAgent.destroy({
    where: {
      ticketId: data.ticketId,
    },
  });

  return { removeCustomerMapping };
}

// Update ticket using id
async function updateTicket(updateTicketReq, id) {
  // check whether record is present
  let ticketData = await ticket.findOne({ where: { id } });

  // if record is not present
  if (!ticketData) {
    return { message: "No ticket found for given id" };
  }

  // check whether updation of agentId or customerId is required
  if (
    updateTicketReq.agentId != undefined ||
    updateTicketReq.customerId != undefined
  ) {
    // check whether updation of agentId is required
    if (updateTicketReq.agentId != undefined) {
      // remove old ticket-agent mapping
      let removeAgentMapping = await removeTicketAgentMapping({
        ticketId: ticketData.id,
      });

      if (removeAgentMapping) {
        // create new ticket-agent mapping
        let ticketAgentMapping = await createTicketAgentMapping({
          ticketId: ticketData.id,
          agentId: updateTicketReq.agentId,
        });

        // Error handling for create failure condition
        if (!ticketAgentMapping) {
          return { message: "Failed to update ticket data" };
        }
      } else {
        // Error handling for destroy failure condition
        return { message: "Failed to update ticket data" };
      }
      // check whether updation of customerId is required
    } else if (updateTicketReq.customerId != undefined) {
      // remove old ticket-customer mapping
      let removeCustomerMapping = await removeTicketCustomerMapping({
        ticketId: ticketData.id,
      });

      if (removeCustomerMapping) {
        // create new ticket-customer mapping
        let ticketCustomerMapping = await createTicketCustomerMapping({
          ticketId: newTicketResponse.id,
          customerId: updateTicketReq.customerId,
        });

        // Error handling for create failure condition
        if (!ticketCustomerMapping) {
          return { message: "Failed to update ticket data" };
        }
      } else {
        // Error handling for destroy failure condition
        return { message: "Failed to update ticket data" };
      }
    }
  }
  ticketData.set(updateTicketReq);
  ticketData.save();

  let finalTicketData = await getTicketDetails(ticketData);

  return { ticket: finalTicketData };
}

// Delete ticket data using id
async function deleteTicketData(id) {
  let ticketRecord = await ticket.findOne({ where: { id } });

  if (!ticketRecord) {
    return { status: false, message: "No ticket data found" };
  } else {
    let deleteTicketAgentMapping = await removeTicketAgentMapping({
      ticketId: id,
    });
    let deleteTicketCustomerMapping = await removeTicketCustomerMapping({
      ticketId: id,
    });

    if (!deleteTicketAgentMapping || !deleteTicketCustomerMapping) {
      return { status: false, message: "Failed to delete ticket data" };
    } else {
      let deleteTicket = await ticket.destroy({ where: { id } });

      if (deleteTicket) {
        return {
          status: true,
          message: `Record with ID ${id} deleted successfully`,
        };
      } else {
        return { status: false, message: "Failed to delete ticket data" };
      }
    }
  }
}

// endpoint 1
app.get("/tickets", async (req, res) => {
  try {
    let fetchAllTickets = await ticket.findAll();

    let ticketDataList = [];

    for (let i = 0; i < fetchAllTickets.length; i++) {
      let singleTicketData = await getTicketDetails(fetchAllTickets[i]);
      ticketDataList.push(singleTicketData);
    }

    if (ticketDataList.length > 0) {
      return res.status(200).json(ticketDataList);
    } else {
      return res.status(404).json({ message: "No tickets found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
app.get("/tickets/details/:id", async (req, res) => {
  try {
    let ticketId = parseInt(req.params.id);

    let ticketData = await ticket.findOne({ where: { id: ticketId } });

    let finalTicketData = await getTicketDetails(ticketData);

    if (finalTicketData != {}) {
      return res.status(200).json({ ticket: finalTicketData });
    } else {
      return res.status(404).json({ error: "No ticket found for ticketId" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
app.get("/tickets/status/:status", async (req, res) => {
  try {
    let ticketStatus = req.params.status;
    let ticketStatusData = await ticket.findAll({
      where: { status: ticketStatus },
    });

    let ticketStatusList = [];

    for (let i = 0; i < ticketStatusData.length; i++) {
      let singleTicketDetails = await getTicketDetails(ticketStatusData[i]);
      ticketStatusList.push(singleTicketDetails);
    }

    if (ticketStatusList.length > 0) {
      return res.status(200).json({ tickets: ticketStatusList });
    } else {
      return res
        .status(404)
        .json({ error: `No ticket found with ${ticketStatus} status` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 4
app.get("/tickets/sort-by-priority", async (req, res) => {
  try {
    let sortedTickets = await ticket.findAll({ order: [["priority", "asc"]] });
    console.log(sortedTickets);

    let sortedDetailedTicketsList = [];

    for (let i = 0; i < sortedTickets.length; i++) {
      let detailedTicket = await getTicketDetails(sortedTickets[i]);

      sortedDetailedTicketsList.push(detailedTicket);
    }

    if (sortedDetailedTicketsList.length > 0) {
      return res.status(200).json({ tickets: sortedDetailedTicketsList });
    } else {
      return res.status(404).json({ error: "No tickets found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 5
app.post("/tickets/new", async (req, res) => {
  try {
    let newTicket = req.body;

    let newTicketResponse = await createNewTicket(newTicket);

    if (newTicketResponse == undefined) {
      return res.status(400).json({ message: "Failed to add new ticket" });
    } else {
      let ticketAgentMapping = await createTicketAgentMapping({
        ticketId: newTicketResponse.id,
        agentId: newTicketResponse.agentId,
      });

      if (ticketAgentMapping == undefined) {
        return res.status(400).json({ message: "Failed to add new ticket" });
      }

      let ticketCustomerMapping = await createTicketCustomerMapping({
        ticketId: newTicketResponse.id,
        customerId: newTicketResponse.customerId,
      });

      if (ticketCustomerMapping == undefined) {
        return res.status(400).json({ message: "Failed to add new ticket" });
      }

      let newTicketDetails = await getTicketDetails(newTicketResponse);

      if (newTicketDetails != undefined) {
        return res.status(200).json({ ticket: newTicketDetails });
      } else {
        return res
          .status(404)
          .json({ error: "No details found for new ticket" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 6
app.post("/tickets/update/:id", async (req, res) => {
  try {
    let ticketId = req.params.id;

    let updateTicketReq = req.body;

    let updateTicketResponse = await updateTicket(updateTicketReq, ticketId);

    if (updateTicketResponse.ticket != undefined) {
      return res.status(200).json(updateTicketResponse);
    } else {
      return res.status(400).json(updateTicketResponse);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 7
app.post("/tickets/delete", async (req, res) => {
  try {
    let ticketId = req.body.id;

    let result = await deleteTicketData(ticketId);

    if (result.status) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${3000}`);
});
