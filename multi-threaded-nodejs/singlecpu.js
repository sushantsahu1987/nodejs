const faker = require("faker");
const _ = require("lodash");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

const { writeToFile } = require("./utils");

const DIR_IMAGES = "./images";
const FILE_SINGLE = "single.txt";
const CPU = 1;

const images_array = [];
const args = process.argv;
const N = args.length < 3 ? 2 : Number(args[2]);

const download = (img) => {
  return fetch(img);
};

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

_.times(N, (i) => {
  const img = faker.image.imageUrl();
  images_array.push({ name: `${i}.png`, imageUrl: img });
});

const now = moment();
const images_array_promises = images_array.map((img) => download(img.imageUrl));
(async () => {
  try {
    await processImages(images_array_promises, process.pid);
  } catch (error) {
    console.log(error);
  } finally {
    const diff_time = calculate_time(now); 
    console.log("diff_time :", diff_time);
    const file = {
      time: diff_time,
      cpu: CPU,
      args: N,
      file: FILE_SINGLE,
    };
    writeToFile(file);
  }
})();

function calculate_time(now) {
  const final = moment();
  const diff_time = final.diff(now, "milliseconds");
  return diff_time;
}
