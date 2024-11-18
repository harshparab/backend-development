const express = require("express");
const { resolve } = require("path");
const { author } = require("./models/author.model");
const { sequelize } = require("./lib");
const { book } = require("./models/book.model");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const authorsData = [
  { name: "J.K. Rowling", birthYear: 1965 },
  { name: "George Orwell", birthYear: 1903 },
  { name: "Jane Austen", birthYear: 1775 },
  { name: "Mark Twain", birthYear: 1835 },
  { name: "Mary Shelley", birthYear: 1797 },
];

const booksData = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    genre: "Fantasy",
    publicationYear: 1997,
  },
  { title: "1984", genre: "Dystopian", publicationYear: 1949 },
  {
    title: "Pride and Prejudice",
    genre: "Romance",
    publicationYear: 1813,
  },
  {
    title: "Adventures of Huckleberry Finn",
    genre: "Adventure",
    publicationYear: 1884,
  },
  { title: "Frankenstein", genre: "Horror", publicationYear: 1818 },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await book.bulkCreate(booksData);
    await author.bulkCreate(authorsData);

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function addNewAuthor(newAuthor) {
  let newAuthorData = await author.create(newAuthor);

  return { newAuthor: newAuthorData };
}

app.post("/authors/new", async (req, res) => {
  try {
    let newAuthor = req.body.newAuthor;

    let result = await addNewAuthor(newAuthor);

    if (result.newAuthor != undefined) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to add new author" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function updateAuthorById(newAuthorData, id) {
  let fetchedAuthorData = await author.findOne({ where: { id } });

  if (fetchedAuthorData) {
    fetchedAuthorData.set(newAuthorData);
    fetchedAuthorData.save();

    return {
      message: "Author updated successfully",
      updatedAuthor: fetchedAuthorData,
    };
  } else {
    return { message: "" };
  }
}

app.post("/authors/update/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let newAuthorData = req.body;

    let result = await updateAuthorById(newAuthorData, id);
    if (result.updatedAuthor != undefined && result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to update data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
