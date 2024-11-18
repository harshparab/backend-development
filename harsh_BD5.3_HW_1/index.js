const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib/index.js");
const { post } = require("./models/post.model.js");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const postData = [
  {
    title: "Getting Started with Node.js",
    content:
      "This post will guide you through the basics of Node.js and how to set up a Node.js project.",
    author: "Alice Smith",
  },
  {
    title: "Advanced Express.js Techniques",
    content:
      "Learn advanced techniques and best practices for building applications with Express.js.",
    author: "Bob Johnson",
  },
  {
    title: "ORM with Sequelize",
    content:
      "An introduction to using Sequelize as an ORM for Node.js applications.",
    author: "Charlie Brown",
  },
  {
    title: "Boost Your JavaScript Skills",
    content:
      "A collection of useful tips and tricks to improve your JavaScript programming.",
    author: "Dana White",
  },
  {
    title: "Designing RESTful Services",
    content: "Guidelines and best practices for designing RESTful APIs.",
    author: "Evan Davis",
  },
  {
    title: "Mastering Asynchronous JavaScript",
    content:
      "Understand the concepts and patterns for writing asynchronous code in JavaScript.",
    author: "Fiona Green",
  },
  {
    title: "Modern Front-end Technologies",
    content:
      "Explore the latest tools and frameworks for front-end development.",
    author: "George King",
  },
  {
    title: "Advanced CSS Layouts",
    content: "Learn how to create complex layouts using CSS Grid and Flexbox.",
    author: "Hannah Lewis",
  },
  {
    title: "Getting Started with React",
    content: "A beginner's guide to building user interfaces with React.",
    author: "Ian Clark",
  },
  {
    title: "Writing Testable JavaScript Code",
    content:
      "An introduction to unit testing and test-driven development in JavaScript.",
    author: "Jane Miller",
  },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await post.bulkCreate(postData);

    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function fetchAllPosts() {
  let posts = await post.findAll();
  return { posts };
}

app.get("/posts", async (req, res) => {
  try {
    let result = await fetchAllPosts();

    if (result.posts.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No posts found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function addNewPost(newPost) {
  let posts = await post.create(newPost);

  return { newPost: posts };
}

app.post("/posts/new", async (req, res) => {
  try {
    let newPost = req.body.newPost;

    let result = await addNewPost(newPost);

    if (result.newPost != {}) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Failed to add new posts" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
async function updatePostByID(newPostData, id) {
  let postData = await post.findOne({ where: { id } });

  if (!postData) {
    return { message: "" };
  } else {
    postData.set(newPostData);
    await postData.save();

    return { message: "Data Updated Successfully", updatedPost: postData };
  }
}

app.post("/posts/update/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let newPostData = req.body;

    let result = await updatePostByID(newPostData, id);

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to update data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 4
async function deletePostByID(id) {
  let deletedPost = await post.destroy({ where: { id } });

  if (deletedPost) {
    return { message: "Post record deleted successfully" };
  } else {
    return { message: "" };
  }
}

app.post("/posts/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);

    let result = await deletePostByID(id);

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to delete record" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
