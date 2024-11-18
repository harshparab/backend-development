const { Datatypes, sequelize } = require("../lib/index.js");

const track = sequelize.define("track", {
  name: Datatypes.TEXT,
  genre: Datatypes.TEXT,
  release_year: Datatypes.INTEGER,
  artist: Datatypes.TEXT,
  album: Datatypes.TEXT,
  duration: Datatypes.INTEGER,
});

module.exports = { track };
