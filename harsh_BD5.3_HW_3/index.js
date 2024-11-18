const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib/index.js");
const { company } = require("./models/company.model.js");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const companiesData = [
  {
    name: "Tech Innovators",
    industry: "Technology",
    foundedYear: 2010,
    headquarters: "San Francisco",
    revenue: 75000000,
  },
  {
    name: "Green Earth",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Portland",
    revenue: 50000000,
  },
  {
    name: "Innovatech",
    industry: "Technology",
    foundedYear: 2012,
    headquarters: "Los Angeles",
    revenue: 65000000,
  },
  {
    name: "Solar Solutions",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Austin",
    revenue: 60000000,
  },
  {
    name: "HealthFirst",
    industry: "Healthcare",
    foundedYear: 2008,
    headquarters: "New York",
    revenue: 80000000,
  },
  {
    name: "EcoPower",
    industry: "Renewable Energy",
    foundedYear: 2018,
    headquarters: "Seattle",
    revenue: 55000000,
  },
  {
    name: "MediCare",
    industry: "Healthcare",
    foundedYear: 2012,
    headquarters: "Boston",
    revenue: 70000000,
  },
  {
    name: "NextGen Tech",
    industry: "Technology",
    foundedYear: 2018,
    headquarters: "Chicago",
    revenue: 72000000,
  },
  {
    name: "LifeWell",
    industry: "Healthcare",
    foundedYear: 2010,
    headquarters: "Houston",
    revenue: 75000000,
  },
  {
    name: "CleanTech",
    industry: "Renewable Energy",
    foundedYear: 2008,
    headquarters: "Denver",
    revenue: 62000000,
  },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await company.bulkCreate(companiesData);

    return res.status(200).json({ message: "Database seeded succesfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function fetchAllCompanies() {
  let companies = await company.findAll();

  return { companies };
}

app.get("/companies", async (req, res) => {
  try {
    let result = await fetchAllCompanies();

    if (result.companies.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No companies found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function addNewCompany(newCompany) {
  let newCompanyData = await company.create(newCompany);

  return { newCompany: newCompanyData };
}

app.post("/companies/new", async (req, res) => {
  try {
    let newCompany = req.body.newCompany;

    let result = await addNewCompany(newCompany);

    if (result.newCompany != {}) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to add new company" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
async function updateCompanyByID(newCompanyData, id) {
  let companyData = await company.findOne({ where: { id } });

  if (companyData) {
    companyData.set(newCompanyData);

    companyData.save();

    return {
      message: "Company updated successfully",
      updatedCompany: companyData,
    };
  } else {
    return { message: "" };
  }
}

app.post("/companies/update/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let newCompanyData = req.body;

    let result = await updateCompanyByID(newCompanyData, id);

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to update company data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 4
async function deleteCompanyByID(id) {
  let deletedRecord = await company.destroy({ where: { id } });

  if (deletedRecord) {
    return { message: "Company record deleted successfully" };
  } else {
    return { message: "" };
  }
}

app.post("/companies/delete", async (req, res) => {
  try {
    let id = req.body.id;

    let result = await deleteCompanyByID(id);

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res
        .status(400)
        .json({ message: "Failed to delete company record" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("Server is listening on port ::", port);
});
