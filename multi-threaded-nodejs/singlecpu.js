const _ = require("lodash");
const fetch = require("node-fetch");
const moment = require("moment");
const { writeToFile, images, dowloadImages, calculate_time } = require("./utils");

const FILE_SINGLE = "single.txt";
const CPU = 1;
const args = process.argv;
const N = args.length < 3 ? 2 : Number(args[2]);

const launch = async () => {
  const download = (img) => {
    return fetch(img, {
      "User-Agent": "mac-book",
    });
  };

  const images_array = images.slice(0, N);
  const now = moment();
  const images_array_promises = _.map(images_array, (img) => download(img));
  await dowloadImages(images_array_promises);
  const diff_time = calculate_time(now);
  console.log("diff_time :", diff_time);
  const data = {
    time: diff_time,
    cpu: CPU,
    args: N,
    file: FILE_SINGLE,
  };
  writeToFile(data);
};

launch();