const _ = require("lodash");
const fetch = require("node-fetch");
const cluster = require("cluster");
const moment = require("moment");

const {
  writeToFile,
  images,
  dowloadImages,
  calculate_time,
} = require("./utils");

const CPU = 2;
const FILE_MULTIPLE = "multiple.txt";

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

const workerMessagerHandler = (msg) => {
  console.log(
    `command process ${process.pid} starts at ${new Date().toISOString()}`
  );
  switch (msg.command) {
    case COMMAND.PROCESS:
      if (msg.pid === process.pid) {
        console.log(`command process ${process.pid} starts ...`);
        const { images } = msg;
        const images_array_promises = _.map(images, (img) => download(img));
        (async () => {
          const result = await dowloadImages(images_array_promises);
          console.log(`process ${process.pid} download complete ...`, result);
          process.send({
            command: COMMAND.PROCESS_COMPLETE,
            worker: process.pid,
          });
          process.send({ command: COMMAND.SHUTDOWN, worker: process.pid });
        })();
      }
      break;

    default:
      break;
  }
};


const masterhandler = (now) => {
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

  return masterMessagerHandler
}

const sendMessage = (worker) => {
  const {w, images} = worker;
  const data = {
    command: COMMAND.PROCESS,
    images,
    pid: w.process.pid,
  }
  w.send(data);
};

if (cluster.isMaster) {
  console.log(`master: ${process.pid}`);
  const images_array = images.slice(0, N);
  const chunk_size = N / CPU;
  const chunked_images_array = _.chunk(images_array, chunk_size);

  _.times(CPU, (index) => {
    const w = cluster.fork();
    workers[String(w.process.pid)] = {
      w,
      images: chunked_images_array[index],
    };
  });
  liveWorkers = Object.keys(workers).length;
  const now = moment();
  for (const pid in workers) {
    const worker = workers[pid];
    worker.w.on("message", masterhandler(now));
    sendMessage(worker);
  }
} else {
  console.log(`worker: ${process.pid}`);
  process.on("message", workerMessagerHandler);
}


