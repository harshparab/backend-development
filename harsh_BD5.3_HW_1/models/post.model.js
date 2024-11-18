const { Datatypes, sequelize } = require("../lib/index.js");

const post = sequelize.define("post", {
  title: Datatypes.TEXT,
  content: Datatypes.TEXT,
  author: Datatypes.TEXT,
});

module.exports = { post };
