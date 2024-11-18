const { DataType, sequelize } = require("../lib/index.js");

const track = sequelize.define("track", {
  name: DataType.TEXT,
  genre: DataType.TEXT,
  release_year: DataType.INTEGER,
  artist: DataType.TEXT,
  album: DataType.TEXT,
  duration: DataType.INTEGER,
});

module.exports = { track };
