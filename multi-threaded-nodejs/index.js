const faker = require("faker");
const _ = require("lodash");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const cluster = require("cluster");
const { result } = require("lodash");
const numCPUs = 2;

const images_array = [];
const args = process.argv;
const N = args.length < 3 ? 2 : Number(args[2]);


// const launch = async () => {
//   _.times(N, (i) => {
//     const img = faker.image.imageUrl();
//     images_array.push({ name: `${i}.png`, imageUrl: img });
//   });

//   const images_array_promises = images_array.map((img) => download(img));

//   console.time("download_time");
//   Promise.allSettled(images_array_promises).then((values) => {
//     values.forEach((status) => {
//       console.log(status);
//     });
//     console.timeEnd("download_time");
//   });
// };

const workers = [];

// launch();
if (cluster.isMaster) {
  console.log(`master: ${process.pid}`);
  _.times(N, (i) => {
    const img = faker.image.imageUrl();
    images_array.push({ name: `${i}.png`, imageUrl: img });
  });

  const images_array_promises = images_array.map((img) => download2(img));
  console.log("image array promise length : ", images_array_promises.length);
  Promise.allSettled(images_array_promises).then((results) => {
    results.forEach((res, index) => {
      if (res.status === "fulfilled" && res.value.status === 200) {
        const imgpath = path.join(__dirname, "./images", `${index}.png`);  
        const dest = fs.createWriteStream(imgpath);
        res.value.body.pipe(dest);
      }
    });
  }).catch(err => {
      console.log(err);
  });

  _.times(2, () => {
    const w = cluster.fork();
    workers.push(w);
  });
} else {
  console.log(`client: ${process.pid}`);
}
