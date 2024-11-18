const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib/index.js");
const { employee } = require("./models/employee.model.js");
const { role } = require("./models/role.model.js");
const { department } = require("./models/department.model.js");
const { employeeDepartment } = require("./models/employeeDepartment.model.js");
const { employeeRole } = require("./models/employeeRole.model.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Helper function to get employee's associated departments
async function getEmployeeDepartments(employeeId) {
    const employeeDepartments = await employeeDepartment.findAll({
        where: { employeeId },
    });

    let departmentData;
    for (let empDep of employeeDepartments) {
        departmentData = await department.findOne({
            where: { id: empDep.departmentId },
        });
    }

    return departmentData;
}

// Helper function to get employee's associated roles
async function getEmployeeRoles(employeeId) {
    const employeeRoles = await employeeRole.findAll({
        where: { employeeId },
    });

    let roleData;
    for (let empRole of employeeRoles) {
        roleData = await role.findOne({
            where: { id: empRole.roleId },
        });
    }

    return roleData;
}

// Helper function to get employee details with associated departments and roles
async function getEmployeeDetails(employeeData) {
    const department = await getEmployeeDepartments(employeeData.id);
    const role = await getEmployeeRoles(employeeData.id);

    return {
        ...employeeData.dataValues,
        department,
        role,
    };
}

// Fetch all employees data
async function fetchAllEmployeesData() {
    let employees = await employee.findAll();

    let employeeList = [];

    for (let i = 0; i < employees.length; i++) {
        let detailedEmployeeData = await getEmployeeDetails(employees[i]);
        employeeList.push(detailedEmployeeData);
    }

    return { employees: employeeList };
}

// Helper function to create new Emplpyee
async function addNewEmployee(newEmployee) {
    let newEmployeeData = await employee.create(newEmployee);

    return newEmployeeData;
}

// Helper function to create employee department mapping
async function createEmployeeDepartmentMapping(data) {
    let employeeDepartmentMappingData = await employeeDepartment.create({
        employeeId: data.employeeId,
        departmentId: data.departmentId,
    });

    return { employeeDepartmentMappingData };
}

// Helper function to create employee role mapping
async function createEmployeeRoleMapping(data) {
    let employeeRoleMappingData = await employeeRole.create({
        employeeId: data.employeeId,
        roleId: data.roleId,
    });

    return { employeeRoleMappingData };
}

// Endpoint to seed database
app.get('/seed_db', async (req, res) => {
    try {

        await sequelize.sync({ force: true });

        const departments = await department.bulkCreate([
            { name: 'Engineering' },
            { name: 'Marketing' },
        ]);

        const roles = await role.bulkCreate([
            { title: 'Software Engineer' },
            { title: 'Marketing Specialist' },
            { title: 'Product Manager' },
        ]);

        const employees = await employee.bulkCreate([
            { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
            { name: 'Priya Singh', email: 'priya.singh@example.com' },
            { name: 'Ankit Verma', email: 'ankit.verma@example.com' },
        ]);

        // Associate employees with departments and roles using create method on junction models
        await employeeDepartment.create({
            employeeId: employees[0].id,
            departmentId: departments[0].id,
        });
        await employeeRole.create({
            employeeId: employees[0].id,
            roleId: roles[0].id,
        });

        await employeeDepartment.create({
            employeeId: employees[1].id,
            departmentId: departments[1].id,
        });
        await employeeRole.create({
            employeeId: employees[1].id,
            roleId: roles[1].id,
        });

        await employeeDepartment.create({
            employeeId: employees[2].id,
            departmentId: departments[0].id,
        });
        await employeeRole.create({
            employeeId: employees[2].id,
            roleId: roles[2].id,
        });

        return res.status(200).json({ message: 'Database seeded!' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: "Failed to seed database" })
    }
});

// endpoint 1
app.get("/employees", async (req, res) => {
    try {
        let result = await fetchAllEmployeesData();

        if (result.employees.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No employee data found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// endpoint 2
async function fetchEmployeeDataById(id) {
    let employeeData = await employee.findOne({ where: { id } });

    let detailedEmployeeData = await getEmployeeDetails(employeeData);

    return { employee: detailedEmployeeData };
}

app.get("/employees/details/:id", async (req, res) => {
    try {
        let employeeId = req.params.id;

        let result = await fetchEmployeeDataById(employeeId);

        if (result.employee) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No employee data found" })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

// endpoint 3
async function fetchEmployeeDataByDeptId(departmentId) {
    let employeeDataByDeptId = await employeeDepartment.findAll({ where: { departmentId: departmentId } });


    let employeeDataList = [];

    for (let i = 0; i < employeeDataByDeptId.length; i++) {
        let fetchEmployeeOnId = await employee.findOne({ where: { id: employeeDataByDeptId[i].id } });
        let employeeData = await getEmployeeDetails(fetchEmployeeOnId);
        employeeDataList.push(employeeData);
    }

    return { employees: employeeDataList };
}

app.get("/employees/department/:departmentId", async (req, res) => {
    try {
        let departmentId = req.params.departmentId;

        let result = await fetchEmployeeDataByDeptId(departmentId);

        if (result.employees.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No employee found in department" });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// endpoint 4
async function fetchEmployeeDataByRoleId(roleId) {
    let employeeDataByRoleId = await employeeRole.findAll({ where: { roleId: roleId } });


    let employeeDataList = [];

    for (let i = 0; i < employeeDataByRoleId.length; i++) {
        let fetchEmployeeOnId = await employee.findOne({ where: { id: employeeDataByRoleId[i].id } });
        let employeeData = await getEmployeeDetails(fetchEmployeeOnId);
        employeeDataList.push(employeeData);
    }

    return { employees: employeeDataList };
}

app.get("/employees/role/:roleId", async (req, res) => {
    try {
        let roleId = req.params.roleId;

        let result = await fetchEmployeeDataByRoleId(roleId);

        if (result.employees.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No employee found for the role" });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// endpoint 5
async function sortEmployeesByName(order) {
    let employees = await employee.findAll({ order: [["name", order]] });

    let employeeList = [];

    for (let i = 0; i < employees.length; i++) {
        let detailedEmployeeData = await getEmployeeDetails(employees[i]);
        employeeList.push(detailedEmployeeData);
    }

    return { employees: employeeList };
}

app.get("/employees/sort-by-name", async (req, res) => {
    try {
        let order = req.query.order;

        let result = await sortEmployeesByName(order);

        if (result.employees.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No employees found" });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// endpoint 5
app.post("/employees/new", async (req, res) => {
    try {
        let newEmployee = req.body;

        let newEmployeeResponse = await addNewEmployee(newEmployee);

        if (newEmployeeResponse == undefined) {
            return res.status(400).json({ message: "Failed to add new employee" });
        } else {
            let empDeptMapping = await createEmployeeDepartmentMapping({
                employeeId: newEmployeeResponse.id,
                departmentId: newEmployee.departmentId,
            });

            if (empDeptMapping == undefined) {
                return res.status(400).json({ message: "Failed to add new employee" });
            }

            let empRoleMapping = await createEmployeeRoleMapping({
                employeeId: newEmployeeResponse.id,
                roleId: newEmployee.roleId,
            });

            if (empRoleMapping == undefined) {
                return res.status(400).json({ message: "Failed to add new employee" });
            }

            let newEmployeeDetails = await getEmployeeDetails(newEmployeeResponse);

            if (newEmployeeDetails != undefined) {
                return res.status(200).json({ employee: newEmployeeDetails });
            } else {
                return res
                    .status(404)
                    .json({ error: "No details found for new employee" });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// endpoint 6
// Helper function to remove employee department mapping
async function removeEmployeeDepartmentMapping(data) {
    let removeDeptMapping = await employeeDepartment.destroy({
        where: {
            employeeId: data.employeeId,
        },
    });

    return { removeDeptMapping };
}

// Helper function to remove employee role mapping
async function removeEmployeeRoleMapping(data) {
    let removeRoleMapping = await employeeRole.destroy({
        where: {
            employeeId: data.employeeId,
        },
    });

    return { removeRoleMapping };
}


// Update ticket using id
async function updateEmployee(updateEmployeeReq, id) {
    // check whether record is present
    let employeeData = await employee.findOne({ where: { id } });

    // if record is not present
    if (!employeeData) {
        return { message: "No employee found for given id" };
    }

    // check whether updation of roleId or departmentId is required
    if (
        updateEmployeeReq.departmentId != undefined ||
        updateEmployeeReq.roleId != undefined
    ) {
        // check whether updation of departmentId is required
        if (updateEmployeeReq.departmentId != undefined) {
            // remove old ticket-agent mapping
            let removeDeptMapping = await removeEmployeeDepartmentMapping({
                employeeId: employeeData.id,
            });

            if (removeDeptMapping) {
                // create new employee-department mapping
                let employeeDeptMapping = await createEmployeeDepartmentMapping({
                    employeeId: employeeData.id,
                    departmentId: updateEmployeeReq.departmentId,
                });

                // Error handling for create failure condition
                if (!employeeDeptMapping) {
                    return { message: "Failed to update employee data" };
                }
            } else {
                // Error handling for destroy failure condition
                return { message: "Failed to update employee data" };
            }
            // check whether updation of roleId is required
        } else if (updateEmployeeReq.roleId != undefined) {
            // remove old employee role mapping
            let removeRoleMapping = await removeEmployeeRoleMapping({
                employeeId: employeeData.id,
            });

            if (removeRoleMapping) {
                // create new employee-role mapping
                let employeeRoleMapping = await createEmployeeRoleMapping({
                    employeeId: newEmployeeResponse.id,
                    roleId: updateEmployeeReq.roleId,
                });

                // Error handling for create failure condition
                if (!employeeRoleMapping) {
                    return { message: "Failed to update employee data" };
                }
            } else {
                // Error handling for destroy failure condition
                return { message: "Failed to update employee data" };
            }
        }
    }
    employeeData.set(updateEmployeeReq);
    employeeData.save();

    let finalEmployeeData = await getEmployeeDetails(employeeData);

    return { employee: finalEmployeeData };
}

app.post("/employees/update/:id", async (req, res) => {
    try {
        let employeeId = req.params.id;

        let updateEmployeeReq = req.body;

        let updateEmployeeResponse = await updateEmployee(updateEmployeeReq, employeeId);

        if (updateEmployeeResponse.employee != undefined) {
            return res.status(200).json(updateEmployeeResponse);
        } else {
            return res.status(400).json(updateEmployeeResponse);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// endpoint 7
// Delete ticket data using id
async function deleteEmployeeData(id) {
    let employeeRecord = await employee.findOne({ where: { id } });

    if (!employeeRecord) {
        return { status: false, message: "No employee data found" };
    } else {
        let deleteEmpDeptMapping = await removeEmployeeDepartmentMapping({
            employeeId: id,
        });
        let deleteEmpRoleMapping = await removeEmployeeRoleMapping({
            employeeId: id,
        });

        if (!deleteEmpDeptMapping || !deleteEmpRoleMapping) {
            return { status: false, message: "Failed to delete employee data" };
        } else {
            let deleteEmployee = await employee.destroy({ where: { id } });

            if (deleteEmployee) {
                return {
                    status: true,
                    message: `Record with ID ${id} deleted successfully`,
                };
            } else {
                return { status: false, message: "Failed to delete employee data" };
            }
        }
    }
}

app.post("/employees/delete", async (req, res) => {
    try {
        let employeeId = req.body.id;

        let result = await deleteEmployeeData(employeeId);

        if (result.status) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => { console.log(`Server is up and running on port ${port}`) })
