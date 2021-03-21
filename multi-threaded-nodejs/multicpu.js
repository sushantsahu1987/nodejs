const faker = require("faker");
const _ = require("lodash");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const cluster = require("cluster");
const moment = require("moment");

const { writeToFile } = require("./utils");

const CPU = 5;
const DIR_IMAGES = "./images";
const FILE_MULTIPLE = "multiple.txt";

const images_array = [];
const workers = {};
const args = process.argv;
const N = args.length < 3 ? 2 : Number(args[2]);
let liveWorkers = 0;

const COMMAND = {
  SHUTDOWN: "SHUTDOWN",
  PROCESS: "PROCESS",
  PROCESS_COMPLETE: "PROCESS_COMPLETE",
};

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

if (cluster.isMaster) {
  console.log(`master: ${process.pid}`);
  _.times(N, (i) => {
    const img = faker.image.imageUrl();
    images_array.push({ name: `${i}.png`, imageUrl: img });
  });

  const chunk_size = N / CPU;

  const chunked_images_array = _.chunk(images_array, chunk_size);

  // const half = Math.ceil(images_array.length / 2);
  // const firstHalf = images_array.splice(0, half);
  // const secondHalf = images_array.splice(-half);
  // const chunked_images_array = [firstHalf, secondHalf];

  _.times(CPU, (index) => {
    const w = cluster.fork();
    workers[String(w.process.pid)] = {
      w,
      images: chunked_images_array[index],
      status: 1,
    };
  });
  liveWorkers = Object.keys(workers).length;

  const masterMessagerHandler = (msg) => {
    switch (msg.command) {
      case COMMAND.SHUTDOWN:
        console.log(`shutting down worker : `, msg.worker);
        workers[msg.worker].w.disconnect();
        break;

      case COMMAND.PROCESS_COMPLETE:
        console.log(`process complete : `, msg.worker);
        liveWorkers--;
        if (liveWorkers === 0) {
          const diff_time = calculate_time(now);
          const file = {
            time: diff_time,
            cpu: CPU,
            args: N,
            file: FILE_MULTIPLE,
          };
          writeToFile(file);
          console.log("diff_time :", diff_time);
        }
        break;

      default:
        break;
    }
  };

  const now = moment();
  for (const pid in workers) {
    const worker = workers[pid].w;
    worker.on("message", masterMessagerHandler);
    worker.send({
      command: COMMAND.PROCESS,
      images: workers[pid].images,
      pid: worker.process.pid,
    });
  }
} else {
  console.log(`worker: ${process.pid}`);

  process.on("message", (msg) => {
    console.log(
      `command process ${process.pid} starts at ${new Date().toISOString()}`
    );
    switch (msg.command) {
      case COMMAND.PROCESS:
        if (msg.pid === process.pid) {
          console.log(`command process ${process.pid} starts ...`);
          const { images } = msg;
          const images_array_promises = images.map((img) =>
            download(img.imageUrl)
          );
          (async () => {
            try {
              await processImages(images_array_promises, process.pid);
            } catch (error) {
              console.log(error);
            } finally {
              process.send({
                command: COMMAND.PROCESS_COMPLETE,
                worker: process.pid,
              });
              process.send({ command: COMMAND.SHUTDOWN, worker: process.pid });
            }
          })();
        }
        break;

      default:
        break;
    }
  });
}
function calculate_time(now) {
  const final = moment();
  const diff_time = final.diff(now, "milliseconds");
  return diff_time;
}
