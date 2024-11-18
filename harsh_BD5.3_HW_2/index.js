const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib/index.js");
const { employee } = require("./models/employee.model.js");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const employeesData = [
  {
    name: "John Doe",
    designation: "Manager",
    department: "Sales",
    salary: 90000,
  },
  {
    name: "Anna Brown",
    designation: "Developer",
    department: "Engineering",
    salary: 80000,
  },
  {
    name: "James Smith",
    designation: "Designer",
    department: "Marketing",
    salary: 70000,
  },
  {
    name: "Emily Davis",
    designation: "HR Specialist",
    department: "Human Resources",
    salary: 60000,
  },
  {
    name: "Michael Wilson",
    designation: "Developer",
    department: "Engineering",
    salary: 85000,
  },
  {
    name: "Sarah Johnson",
    designation: "Data Analyst",
    department: "Data Science",
    salary: 75000,
  },
  {
    name: "David Lee",
    designation: "QA Engineer",
    department: "Quality Assurance",
    salary: 70000,
  },
  {
    name: "Linda Martinez",
    designation: "Office Manager",
    department: "Administration",
    salary: 50000,
  },
  {
    name: "Robert Hernandez",
    designation: "Product Manager",
    department: "Product",
    salary: 95000,
  },
  {
    name: "Karen Clark",
    designation: "Sales Associate",
    department: "Sales",
    salary: 55000,
  },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await employee.bulkCreate(employeesData);

    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function fetchAllEmployees() {
  let employees = await employee.findAll();

  return { employees };
}

app.get("/employees", async (req, res) => {
  try {
    let result = await fetchAllEmployees();

    if (result.employees.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function addNewEmployee(newEmployee) {
  let newEmployeeData = await employee.create(newEmployee);

  return { newEmployee: newEmployeeData };
}

app.post("/employees/new", async (req, res) => {
  try {
    let newEmployee = req.body.newEmployee;

    let result = await addNewEmployee(newEmployee);

    if (result.newEmployee != {}) {
      return res.status(200).json(newEmployee);
    } else {
      return res
        .status(400)
        .json({ message: "Failed to add new employee data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
async function updateEmployeeByID(newEmployeeData, id) {
  let updatedData = await employee.findOne({ where: { id } });

  if (!updatedData) {
    return { message: "" };
  } else {
    updatedData.set(newEmployeeData);
    await updatedData.save();

    return {
      message: "Data updated successfully",
      updatedEmployee: updatedData,
    };
  }
}

app.post("/employees/update/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let newEmployeeData = req.body;

    let result = await updateEmployeeByID(newEmployeeData, id);

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res
        .status(400)
        .json({ message: "Failed to update employee data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 4
async function deleteEmployeeByID(id) {
  let deletedEmployee = await employee.destroy({ where: { id } });

  if (deletedEmployee) {
    return { message: "Employee record deleted successfully" };
  } else {
    return { message: "" };
  }
}

app.post("/employees/delete", async (req, res) => {
  try {
    let id = req.body.id;

    let result = await deleteEmployeeByID(id);
    if (result.message != "") {
      return res
        .status(200)
        .json({ message: "Employee record deleted successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to delete employee record" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("Server is listening on port ::", port);
});
