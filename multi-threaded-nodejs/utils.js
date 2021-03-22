const os = require("os");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

const DIR_STATS = "./stats";
const DIR_IMAGES = "./images";
const json = require("./assets/images.json");

const writeToFile = ({ time, cpu, args, file }) => {
  const statpath = path.join(__dirname, DIR_STATS, file);
  const stream = fs.createWriteStream(statpath, { flags: "a" });
  const wtf = `${new Date().toISOString()} | ${time} | ${cpu} | ${args} ${
    os.EOL
  }`;
  stream.write(wtf);
};

const images = (() => {
  const result = [];
  for (var i = 0; i < json.length; i++) {
    var obj = json[i];
    result.push(obj.image);
  }
  return result;
})();

const processImages = (images_array_promises, pid) => {
  return new Promise((resolve, reject) => {
    Promise.allSettled(images_array_promises)
      .then((results) => {
        results.forEach((res, index) => {
          if (res.status === "fulfilled" && res.value.status === 200) {
            const imgpath = path.join(
              __dirname,
              DIR_IMAGES,
              `${pid}-${index}.png`
            );
            const dest = fs.createWriteStream(imgpath);
            res.value.body.pipe(dest);
          }
        });
        resolve(results.length);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const dowloadImages = async (images_array_promises) => {
  try {
    const length = await processImages(images_array_promises, process.pid);
    return length;
  } catch (error) {
    console.log(error);
  }
};

function calculate_time(now) {
  const final = moment();
  const diff_time = final.diff(now, "milliseconds");
  return diff_time;
}

module.exports = { writeToFile, images, dowloadImages, calculate_time };
