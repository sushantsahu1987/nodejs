const os = require("os");
const path = require("path");
const fs = require("fs");

const DIR_STATS = "./stats";

const writeToFile = ({ time, cpu, args, file }) => {
  const statpath = path.join(__dirname, DIR_STATS, file);
  const stream = fs.createWriteStream(statpath, { flags: "a" });
  const wtf = `${new Date().toISOString()} | ${time} | ${cpu} | ${args} ${
    os.EOL
  }`;
  stream.write(wtf);
};

module.exports = { writeToFile };
